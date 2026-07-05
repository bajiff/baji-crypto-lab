import type { Cipher } from '../../domain/interfaces/Cipher';

function rot13Transform(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const isUpperCase = code >= 65 && code <= 90;
    const base = isUpperCase ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
}

export const rot13Cipher: Cipher = {
  meta: {
    id: 'rot13',
    name: 'ROT13 Cipher',
    needsKey: false,
    description: 'Cipher substitusi sederhana yang menggeser huruf abjad sebanyak 13 posisi (enkripsi = dekripsi).',
  },
  async encrypt(plainText: string): Promise<string> {
    return rot13Transform(plainText);
  },
  async decrypt(cipherText: string): Promise<string> {
    return rot13Transform(cipherText);
  },
};
