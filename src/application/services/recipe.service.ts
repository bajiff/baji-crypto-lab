import type { PipelineRecipe, PipelineRecipeStep } from '../../domain/interfaces/PipelineRecipe';
import { cipherRegistry, type CipherId } from '../../infrastructure/ciphers/cipher.registry';
import { CipherError } from '../../domain/errors/CipherError';

export function createRecipe(steps: { cipherId: CipherId; keyVal: string }[], name = 'Resep CryptoLab'): PipelineRecipe {
  return {
    version: '1.0',
    name,
    createdAt: new Date().toISOString(),
    steps: steps.map((s) => ({ cipherId: s.cipherId, keyVal: s.keyVal || '' })),
  };
}

export function exportRecipeToJSON(steps: { cipherId: CipherId; keyVal: string }[], name = 'Resep CryptoLab'): string {
  const recipe = createRecipe(steps, name);
  return JSON.stringify(recipe, null, 2);
}

export function importRecipeFromJSON(jsonString: string): PipelineRecipe {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      throw new Error('Format JSON tidak valid (bukan objek).');
    }
    if (!Array.isArray(data.steps)) {
      throw new Error('Resep tidak memiliki daftar langkah (steps) yang valid.');
    }
    if (data.steps.length === 0) {
      throw new Error('Resep pipeline tidak boleh kosong.');
    }

    const validSteps: PipelineRecipeStep[] = [];
    for (let i = 0; i < data.steps.length; i++) {
      const step = data.steps[i];
      if (!step || typeof step.cipherId !== 'string') {
        throw new Error(`Langkah #${i + 1} tidak memiliki cipherId yang valid.`);
      }
      if (!(step.cipherId in cipherRegistry)) {
        throw new Error(`Langkah #${i + 1} menggunakan algoritma yang tidak dikenal: "${step.cipherId}".`);
      }
      validSteps.push({
        cipherId: step.cipherId as CipherId,
        keyVal: typeof step.keyVal === 'string' ? step.keyVal : String(step.keyVal || ''),
      });
    }

    return {
      version: typeof data.version === 'string' ? data.version : '1.0',
      name: typeof data.name === 'string' ? data.name : 'Resep Impor CryptoLab',
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
      steps: validSteps,
    };
  } catch (err) {
    if (err instanceof CipherError) throw err;
    throw new CipherError(
      `Gagal mengimpor resep: ${err instanceof Error ? err.message : String(err)}`,
      'pipeline',
      'validation'
    );
  }
}

export function encodeRecipeToURLParam(steps: { cipherId: CipherId; keyVal: string }[], name = 'Resep URL'): string {
  try {
    const recipe = createRecipe(steps, name);
    const jsonStr = JSON.stringify(recipe);
    const base64 = btoa(encodeURIComponent(jsonStr));
    // Make URL-safe Base64
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    throw new CipherError('Gagal mengodekan resep ke parameter URL.', 'pipeline', 'validation');
  }
}

export function decodeRecipeFromURLParam(urlParam: string): PipelineRecipe {
  try {
    let base64 = urlParam.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(atob(base64));
    return importRecipeFromJSON(jsonStr);
  } catch (err) {
    if (err instanceof CipherError) throw err;
    throw new CipherError('Gagal membaca resep dari link URL. Parameter rusak atau tidak valid.', 'pipeline', 'validation');
  }
}

export function downloadRecipeAsFile(recipeOrSteps: PipelineRecipe | { cipherId: CipherId; keyVal: string }[], filename = 'cryptolab-recipe.json'): void {
  if (typeof window === 'undefined') return;
  
  const recipe = 'version' in recipeOrSteps ? recipeOrSteps : createRecipe(recipeOrSteps);
  const jsonStr = JSON.stringify(recipe, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
