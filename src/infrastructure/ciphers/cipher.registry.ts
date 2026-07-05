import { base64Cipher } from './base64.cipher';
import { caesarCipher } from './caesar.cipher';

export const cipherRegistry = {
  base64: base64Cipher,
  caesar: caesarCipher,
} as const;

export type CipherId = keyof typeof cipherRegistry;
export const getAllCiphers = () => Object.values(cipherRegistry);
