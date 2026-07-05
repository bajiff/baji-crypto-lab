import type { Cipher } from '../../domain/interfaces/Cipher';

export async function encryptSingle(plainText: string, cipher: Cipher, key?: string): Promise<string> {
  return cipher.encrypt(plainText, key);
}
