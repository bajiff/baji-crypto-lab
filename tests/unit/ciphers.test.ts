import { describe, it, expect } from 'vitest';
import { base64Cipher } from '../../src/infrastructure/ciphers/base64.cipher';
import { caesarCipher } from '../../src/infrastructure/ciphers/caesar.cipher';
import { rot13Cipher } from '../../src/infrastructure/ciphers/rot13.cipher';
import { vigenereCipher } from '../../src/infrastructure/ciphers/vigenere.cipher';
import { xorCipher } from '../../src/infrastructure/ciphers/xor.cipher';
import { aesCipher } from '../../src/infrastructure/ciphers/aes.cipher';
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

describe('ROT13 Cipher', () => {
  it('should encrypt and decrypt correctly (symmetric)', async () => {
    const input = 'Hello, World! 123 🚀';
    const encrypted = await rot13Cipher.encrypt(input);
    expect(encrypted).toBe('Uryyb, Jbeyq! 123 🚀');
    const decrypted = await rot13Cipher.decrypt(encrypted);
    expect(decrypted).toBe(input);
  });
});

describe('Vigenère Cipher', () => {
  it('should encrypt and decrypt standard text with key', async () => {
    const input = 'ATTACK AT DAWN!';
    const key = 'LEMON';
    const encrypted = await vigenereCipher.encrypt(input, key);
    expect(encrypted).toBe('LXFOPV EF RNHR!');
    const decrypted = await vigenereCipher.decrypt(encrypted, key);
    expect(decrypted).toBe(input);
  });

  it('should preserve non-alphabet characters and emojis', async () => {
    const input = 'Halo Tuan Baji! 🚀 🔥';
    const key = 'KUNCI';
    const encrypted = await vigenereCipher.encrypt(input, key);
    const decrypted = await vigenereCipher.decrypt(encrypted, key);
    expect(decrypted).toBe(input);
  });

  it('should throw validation error on empty or invalid key', async () => {
    await expect(vigenereCipher.encrypt('test', '')).rejects.toThrow(/tidak boleh kosong/i);
    await expect(vigenereCipher.encrypt('test', '12345')).rejects.toThrow(/setidaknya satu huruf/i);
  });
});

describe('XOR Cipher', () => {
  it('should encrypt to Base64 and decrypt back', async () => {
    const input = 'CryptoLab XOR Test 🔐 (中文)';
    const key = 'SECRET_KEY_123';
    const encrypted = await xorCipher.encrypt(input, key);
    expect(encrypted).not.toBe(input);
    const decrypted = await xorCipher.decrypt(encrypted, key);
    expect(decrypted).toBe(input);
  });

  it('should throw error on empty key or invalid Base64 decrypt', async () => {
    await expect(xorCipher.encrypt('test', '')).rejects.toThrow(/tidak boleh kosong/i);
    await expect(xorCipher.decrypt('not-base-64$$$', 'key')).rejects.toThrow(/gagal mendekripsi/i);
  });
});

describe('AES-256-GCM Cipher', () => {
  it('should encrypt and decrypt using PBKDF2 and Web Crypto', async () => {
    const input = 'Sangat Rahasia: Teks ini dilindungi AES-256-GCM! 🚀 🔥 🔐';
    const password = 'StrongPassword!@#2026';
    const encrypted = await aesCipher.encrypt(input, password);
    expect(encrypted).not.toBe(input);
    const decrypted = await aesCipher.decrypt(encrypted, password);
    expect(decrypted).toBe(input);
  });

  it('should fail decryption if password is wrong (integrity check failure)', async () => {
    const input = 'Secret Data';
    const encrypted = await aesCipher.encrypt(input, 'CorrectPassword');
    await expect(aesCipher.decrypt(encrypted, 'WrongPassword')).rejects.toThrow(/kata sandi salah atau data telah dimodifikasi/i);
  });

  it('should throw validation error when password is empty', async () => {
    await expect(aesCipher.encrypt('test', '')).rejects.toThrow(/tidak boleh kosong/i);
  });
});

describe('Cipher Registry', () => {
  it('should register all 6 ciphers', () => {
    expect(cipherRegistry.base64).toBeDefined();
    expect(cipherRegistry.caesar).toBeDefined();
    expect(cipherRegistry.rot13).toBeDefined();
    expect(cipherRegistry.vigenere).toBeDefined();
    expect(cipherRegistry.xor).toBeDefined();
    expect(cipherRegistry.aes).toBeDefined();
    expect(getAllCiphers().length).toBe(6);
  });
});
