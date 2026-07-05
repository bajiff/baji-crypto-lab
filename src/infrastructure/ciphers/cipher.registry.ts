import { base64Cipher } from './base64.cipher';
import { caesarCipher } from './caesar.cipher';
import { rot13Cipher } from './rot13.cipher';
import { vigenereCipher } from './vigenere.cipher';
import { xorCipher } from './xor.cipher';
import { aesCipher } from './aes.cipher';

export const cipherRegistry = {
  base64: base64Cipher,
  caesar: caesarCipher,
  rot13: rot13Cipher,
  vigenere: vigenereCipher,
  xor: xorCipher,
  aes: aesCipher,
} as const;

export type CipherId = keyof typeof cipherRegistry;
export const getAllCiphers = () => Object.values(cipherRegistry);
