import type { Cipher } from '../../domain/interfaces/Cipher';
import { CipherError } from '../../domain/errors/CipherError';

function validateKey(key?: string): Uint8Array {
  if (!key || !key.trim()) {
    throw new CipherError('Kata kunci (key) tidak boleh kosong untuk XOR Cipher.', 'xor', 'validation');
  }
  const keyBytes = new TextEncoder().encode(key);
  if (keyBytes.length === 0) {
    throw new CipherError('Kata kunci tidak valid.', 'xor', 'validation');
  }
  return keyBytes;
}

function xorBytes(data: Uint8Array, key: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ key[i % key.length];
  }
  return out;
}

export const xorCipher: Cipher = {
  meta: {
    id: 'xor',
    name: 'XOR Cipher',
    needsKey: true,
    keyType: 'text',
    keyPlaceholder: 'Kata kunci (misal: SECRET)',
    description: 'Cipher bitwise XOR sederhana dengan kata kunci berulang (output dikodekan dalam format Base64).',
  },
  async encrypt(plainText: string, key?: string): Promise<string> {
    const keyBytes = validateKey(key);
    try {
      const textBytes = new TextEncoder().encode(plainText);
      const xored = xorBytes(textBytes, keyBytes);
      
      let binString = '';
      for (let i = 0; i < xored.length; i++) {
        binString += String.fromCharCode(xored[i]);
      }
      return btoa(binString);
    } catch (err) {
      if (err instanceof CipherError) throw err;
      throw new CipherError(
        `Gagal melakukan enkripsi XOR: ${err instanceof Error ? err.message : String(err)}`,
        'xor',
        'encrypt'
      );
    }
  },
  async decrypt(cipherText: string, key?: string): Promise<string> {
    const keyBytes = validateKey(key);
    try {
      const binString = atob(cipherText.trim());
      const cipherBytes = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) {
        cipherBytes[i] = binString.charCodeAt(i);
      }
      const xored = xorBytes(cipherBytes, keyBytes);
      return new TextDecoder('utf-8', { fatal: true }).decode(xored);
    } catch (err) {
      if (err instanceof CipherError) throw err;
      throw new CipherError(
        'Gagal mendekripsi teks XOR. Pastikan teks input dalam format Base64 yang benar dan kata kunci sesuai.',
        'xor',
        'decrypt'
      );
    }
  },
};
