import type { PipelineStep } from '../../domain/interfaces/PipelineStep';
import { CipherError } from '../../domain/errors/CipherError';

export async function decryptPipeline(cipherText: string, steps: PipelineStep[]): Promise<string> {
  if (!steps || steps.length === 0) {
    throw new CipherError('Pipeline kombinasi tidak boleh kosong. Tambahkan minimal 1 langkah algoritma.', 'pipeline', 'validation');
  }

  let currentText = cipherText;
  // Decrypt in reverse order: from steps.length - 1 down to 0
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];
    try {
      currentText = await step.cipher.decrypt(currentText, step.key);
    } catch (err) {
      if (err instanceof CipherError) {
        throw new CipherError(
          `Langkah dekripsi #${i + 1} (${step.cipher.meta.name}) gagal: ${err.message}`,
          step.cipher.meta.id,
          'decrypt'
        );
      }
      throw new CipherError(
        `Langkah dekripsi #${i + 1} (${step.cipher.meta.name}) mengalami kesalahan tidak terduga: ${err instanceof Error ? err.message : String(err)}`,
        step.cipher.meta.id,
        'decrypt'
      );
    }
  }
  return currentText;
}
