import type { Cipher } from '../../domain/interfaces/Cipher';
import { CipherError } from '../../domain/errors/CipherError';

function cleanKey(key?: string): string {
  if (!key || !key.trim()) {
    throw new CipherError('Kata kunci (key) tidak boleh kosong untuk Vigenère Cipher.', 'vigenere', 'validation');
  }
  const cleaned = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (cleaned.length === 0) {
    throw new CipherError('Kata kunci harus mengandung setidaknya satu huruf abjad (a-z/A-Z).', 'vigenere', 'validation');
  }
  return cleaned;
}

function vigenereTransform(text: string, key: string, isEncrypt: boolean): string {
  let keyIdx = 0;
  const keyLen = key.length;

  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const isUpperCase = code >= 65 && code <= 90;
    const base = isUpperCase ? 65 : 97;
    
    const charShift = code - base;
    const keyShift = key.charCodeAt(keyIdx % keyLen) - 65;
    keyIdx++;

    let newShift = isEncrypt ? (charShift + keyShift) % 26 : (charShift - keyShift + 26) % 26;
    return String.fromCharCode(newShift + base);
  });
}

export const vigenereCipher: Cipher = {
  meta: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    needsKey: true,
    keyType: 'text',
    keyPlaceholder: 'Kata kunci abjad (misal: RAHASIA)',
    description: 'Cipher substitusi polialfabetik menggunakan kata kunci abjad untuk menggeser karakter.',
  },
  async encrypt(plainText: string, key?: string): Promise<string> {
    const validKey = cleanKey(key);
    return vigenereTransform(plainText, validKey, true);
  },
  async decrypt(cipherText: string, key?: string): Promise<string> {
    const validKey = cleanKey(key);
    return vigenereTransform(cipherText, validKey, false);
  },
};
