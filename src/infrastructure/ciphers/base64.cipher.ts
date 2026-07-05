import type { Cipher } from '../../domain/interfaces/Cipher';
import { CipherError } from '../../domain/errors/CipherError';

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binString = '';
  for (let i = 0; i < bytes.length; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString);
}

function base64ToUtf8(str: string): string {
  const binString = atob(str.trim());
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export const base64Cipher: Cipher = {
  meta: {
    id: 'base64',
    name: 'Base64 Encoding',
    needsKey: false,
    description: 'Standar encoding teks ke format Base64 (mendukung UTF-8 & Emoji sepenuhnya).',
  },
  async encrypt(plainText: string): Promise<string> {
    try {
      return utf8ToBase64(plainText);
    } catch (err) {
      throw new CipherError(
        `Gagal mengenkripsi ke Base64: ${err instanceof Error ? err.message : String(err)}`,
        'base64',
        'encrypt'
      );
    }
  },
  async decrypt(cipherText: string): Promise<string> {
    try {
      return base64ToUtf8(cipherText);
    } catch (err) {
      throw new CipherError(
        'Format Base64 tidak valid. Pastikan teks input adalah string Base64 yang benar.',
        'base64',
        'decrypt'
      );
    }
  },
};
