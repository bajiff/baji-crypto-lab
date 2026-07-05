import { describe, it, expect } from 'vitest';
import { base64Cipher } from '../../src/infrastructure/ciphers/base64.cipher';
import { caesarCipher } from '../../src/infrastructure/ciphers/caesar.cipher';
import { cipherRegistry, getAllCiphers } from '../../src/infrastructure/ciphers/cipher.registry';

describe('Base64 Cipher', () => {
  it('should encrypt and decrypt standard ASCII text', async () => {
    const input = 'Hello, World! 123';
    const encrypted = await base64Cipher.encrypt(input);
    expect(encrypted).not.toBe(input);
    const decrypted = await base64Cipher.decrypt(encrypted);
    expect(decrypted).toBe(input);
  });

  it('should handle UTF-8 and Emojis without throwing out-of-range errors', async () => {
    const input = 'Halo Tuan Baji! 🚀 🔥 🔐 Selamat datang di CryptoLab! (中文/日本語)';
    const encrypted = await base64Cipher.encrypt(input);
    const decrypted = await base64Cipher.decrypt(encrypted);
    expect(decrypted).toBe(input);
  });

  it('should throw CipherError when decrypting invalid Base64', async () => {
    await expect(base64Cipher.decrypt('not-valid-base-64!!!===')).rejects.toThrow(/tidak valid/i);
  });
});

describe('Caesar Cipher', () => {
  it('should encrypt and decrypt with positive shift', async () => {
    const input = 'Hello, World! 123';
    const encrypted = await caesarCipher.encrypt(input, '3');
    expect(encrypted).toBe('Khoor, Zruog! 123');
    const decrypted = await caesarCipher.decrypt(encrypted, '3');
    expect(decrypted).toBe(input);
  });

  it('should encrypt and decrypt with negative shift', async () => {
    const input = 'CryptoLab Neobrutalism';
    const encrypted = await caesarCipher.encrypt(input, '-5');
    const decrypted = await caesarCipher.decrypt(encrypted, '-5');
    expect(decrypted).toBe(input);
  });

  it('should preserve non-alphabet characters (emojis, numbers, spaces)', async () => {
    const input = 'Test 123 🚀 #Neobrutalism!';
    const encrypted = await caesarCipher.encrypt(input, '13');
    expect(encrypted).toContain(' 123 🚀 #');
    const decrypted = await caesarCipher.decrypt(encrypted, '13');
    expect(decrypted).toBe(input);
  });

  it('should throw validation error when key is empty or invalid', async () => {
    await expect(caesarCipher.encrypt('test', '')).rejects.toThrow(/tidak boleh kosong/i);
    await expect(caesarCipher.encrypt('test', 'abc')).rejects.toThrow(/angka bulat/i);
  });
});

describe('Cipher Registry', () => {
  it('should register base64 and caesar ciphers', () => {
    expect(cipherRegistry.base64).toBeDefined();
    expect(cipherRegistry.caesar).toBeDefined();
    expect(getAllCiphers().length).toBeGreaterThanOrEqual(2);
  });
});
