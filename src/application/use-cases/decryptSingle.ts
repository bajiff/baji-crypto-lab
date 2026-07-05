import type { Cipher } from '../../domain/interfaces/Cipher';

export async function decryptSingle(cipherText: string, cipher: Cipher, key?: string): Promise<string> {
  return cipher.decrypt(cipherText, key);
}
