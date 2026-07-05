import type { PipelineStep } from '../../domain/interfaces/PipelineStep';
import { CipherError } from '../../domain/errors/CipherError';

export async function encryptPipeline(plainText: string, steps: PipelineStep[]): Promise<string> {
  if (!steps || steps.length === 0) {
    throw new CipherError('Pipeline kombinasi tidak boleh kosong. Tambahkan minimal 1 langkah algoritma.', 'pipeline', 'validation');
  }

  let currentText = plainText;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    try {
      currentText = await step.cipher.encrypt(currentText, step.key);
    } catch (err) {
      if (err instanceof CipherError) {
        throw new CipherError(
          `Langkah #${i + 1} (${step.cipher.meta.name}) gagal: ${err.message}`,
          step.cipher.meta.id,
          'encrypt'
        );
      }
      throw new CipherError(
        `Langkah #${i + 1} (${step.cipher.meta.name}) mengalami kesalahan tidak terduga: ${err instanceof Error ? err.message : String(err)}`,
        step.cipher.meta.id,
        'encrypt'
      );
    }
  }
  return currentText;
}
