import type { Cipher } from '../../domain/interfaces/Cipher';
import { CipherError } from '../../domain/errors/CipherError';

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;
const KEY_LENGTH = 256;

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

function validatePassword(password?: string): string {
  if (!password || !password.trim()) {
    throw new CipherError('Kata sandi (password) tidak boleh kosong untuk AES-256-GCM.', 'aes', 'validation');
  }
  return password;
}

export const aesCipher: Cipher = {
  meta: {
    id: 'aes',
    name: 'AES-256-GCM',
    needsKey: true,
    keyType: 'password',
    keyPlaceholder: 'Kata sandi rahasia (misal: MySecretPassword!@#)',
    description: 'Enkripsi kriptografis kuat berstandar industri dengan integritas data (GCM) dan turunan kunci PBKDF2.',
  },
  async encrypt(plainText: string, key?: string): Promise<string> {
    const password = validatePassword(key);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
      const derivedKey = await deriveKey(password, salt);
      
      const textBytes = new TextEncoder().encode(plainText);
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        derivedKey,
        textBytes
      );

      const encryptedBytes = new Uint8Array(encryptedBuffer);
      const combined = new Uint8Array(SALT_LENGTH + IV_LENGTH + encryptedBytes.length);
      combined.set(salt, 0);
      combined.set(iv, SALT_LENGTH);
      combined.set(encryptedBytes, SALT_LENGTH + IV_LENGTH);

      let binString = '';
      for (let i = 0; i < combined.length; i++) {
        binString += String.fromCharCode(combined[i]);
      }
      return btoa(binString);
    } catch (err) {
      if (err instanceof CipherError) throw err;
      throw new CipherError(
        `Gagal melakukan enkripsi AES: ${err instanceof Error ? err.message : String(err)}`,
        'aes',
        'encrypt'
      );
    }
  },
  async decrypt(cipherText: string, key?: string): Promise<string> {
    const password = validatePassword(key);
    try {
      const binString = atob(cipherText.trim());
      const combined = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) {
        combined[i] = binString.charCodeAt(i);
      }

      if (combined.length < SALT_LENGTH + IV_LENGTH) {
        throw new CipherError('Format ciphertext AES tidak valid atau terlalu pendek.', 'aes', 'decrypt');
      }

      const salt = combined.slice(0, SALT_LENGTH);
      const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

      const derivedKey = await deriveKey(password, salt);
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        derivedKey,
        ciphertext
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (err) {
      if (err instanceof CipherError) throw err;
      throw new CipherError(
        'Gagal mendekripsi AES-256-GCM. Kata sandi salah atau data telah dimodifikasi (integrity check gagal).',
        'aes',
        'decrypt'
      );
    }
  },
};
