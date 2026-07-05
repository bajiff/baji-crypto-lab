import { describe, it, expect } from 'vitest';
import { encryptSingle } from '../../src/application/use-cases/encryptSingle';
import { decryptSingle } from '../../src/application/use-cases/decryptSingle';
import { encryptPipeline } from '../../src/application/use-cases/encryptPipeline';
import { decryptPipeline } from '../../src/application/use-cases/decryptPipeline';
import { base64Cipher } from '../../src/infrastructure/ciphers/base64.cipher';
import { caesarCipher } from '../../src/infrastructure/ciphers/caesar.cipher';
import { rot13Cipher } from '../../src/infrastructure/ciphers/rot13.cipher';
import { vigenereCipher } from '../../src/infrastructure/ciphers/vigenere.cipher';
import { xorCipher } from '../../src/infrastructure/ciphers/xor.cipher';
import { aesCipher } from '../../src/infrastructure/ciphers/aes.cipher';
import type { PipelineStep } from '../../domain/interfaces/PipelineStep';

describe('Single Use Cases', () => {
  it('should encrypt and decrypt using single use case functions', async () => {
    const input = 'Hello Single Use Case 🚀';
    const encrypted = await encryptSingle(input, caesarCipher, '5');
    const decrypted = await decryptSingle(encrypted, caesarCipher, '5');
    expect(decrypted).toBe(input);
  });
});

describe('Pipeline Use Cases', () => {
  it('should execute sequential encryption and reverse decryption across multiple ciphers', async () => {
    const input = 'Rahasia Negara: Kombinasi 6 Cipher! 🚀 🔥 🔐';
    
    const steps: PipelineStep[] = [
      { id: 'step-1', cipher: base64Cipher },
      { id: 'step-2', cipher: caesarCipher, key: '7' },
      { id: 'step-3', cipher: rot13Cipher },
      { id: 'step-4', cipher: vigenereCipher, key: 'RAHASIA' },
      { id: 'step-5', cipher: xorCipher, key: 'KEY_XOR' },
      { id: 'step-6', cipher: aesCipher, key: 'SuperSecretAESPassword!@#' },
    ];

    const encrypted = await encryptPipeline(input, steps);
    expect(encrypted).not.toBe(input);
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);

    const decrypted = await decryptPipeline(encrypted, steps);
    expect(decrypted).toBe(input);
  });

  it('should throw validation error when pipeline steps array is empty', async () => {
    await expect(encryptPipeline('test', [])).rejects.toThrow(/tidak boleh kosong/i);
    await expect(decryptPipeline('test', [])).rejects.toThrow(/tidak boleh kosong/i);
  });

  it('should format error clearly indicating which step failed', async () => {
    const steps: PipelineStep[] = [
      { id: 'step-1', cipher: base64Cipher },
      { id: 'step-2', cipher: vigenereCipher, key: '' }, // empty key should fail
    ];

    await expect(encryptPipeline('test', steps)).rejects.toThrow(/Langkah #2 \(Vigenère Cipher\) gagal/i);
  });
});
