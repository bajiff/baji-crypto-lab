export interface CipherMeta {
  id: string;              // 'aes' | 'caesar' | dst — dipakai sebagai key registry
  name: string;            // nama tampil, misal "AES-256-GCM"
  needsKey: boolean;       // apakah butuh input key/password dari user
  keyType?: 'number' | 'text' | 'password'; // hint untuk UI input
  keyPlaceholder?: string; // contoh: "Shift 0-25" atau "Enter password"
  description: string;
}

export interface Cipher {
  meta: CipherMeta;
  encrypt(plainText: string, key?: string): Promise<string>;
  decrypt(cipherText: string, key?: string): Promise<string>;
}
