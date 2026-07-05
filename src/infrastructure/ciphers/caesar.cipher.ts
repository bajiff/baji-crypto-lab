import type { Cipher } from '../../domain/interfaces/Cipher';
import { CipherError } from '../../domain/errors/CipherError';

function parseShift(key?: string): number {
  if (key === undefined || key.trim() === '') {
    throw new CipherError('Key shift tidak boleh kosong untuk Caesar Cipher.', 'caesar', 'validation');
  }
  const shift = parseInt(key, 10);
  if (isNaN(shift)) {
    throw new CipherError('Key shift harus berupa angka bulat (integer).', 'caesar', 'validation');
  }
  // Normalize shift to 0-25 range (handles negative shifts too)
  return ((shift % 26) + 26) % 26;
}

function shiftText(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const isUpperCase = code >= 65 && code <= 90;
    const base = isUpperCase ? 65 : 97;
    return String.fromCharCode(((code - base + shift) % 26) + base);
  });
}

export const caesarCipher: Cipher = {
  meta: {
    id: 'caesar',
    name: 'Caesar Cipher',
    needsKey: true,
    keyType: 'number',
    keyPlaceholder: 'Shift (misal: 3 atau -5)',
    description: 'Cipher substitusi klasik dengan menggeser huruf abjad sebanyak nilai shift.',
  },
  async encrypt(plainText: string, key?: string): Promise<string> {
    const shift = parseShift(key);
    return shiftText(plainText, shift);
  },
  async decrypt(cipherText: string, key?: string): Promise<string> {
    const shift = parseShift(key);
    // To decrypt, we shift by (26 - shift)
    return shiftText(cipherText, (26 - shift) % 26);
  },
};
