import { describe, it, expect } from 'vitest';
import {
  createRecipe,
  exportRecipeToJSON,
  importRecipeFromJSON,
  encodeRecipeToURLParam,
  decodeRecipeFromURLParam,
} from '../../src/application/services/recipe.service';
import type { CipherId } from '../../src/infrastructure/ciphers/cipher.registry';

describe('Recipe Service', () => {
  const sampleSteps: { cipherId: CipherId; keyVal: string }[] = [
    { cipherId: 'base64', keyVal: '' },
    { cipherId: 'caesar', keyVal: '7' },
    { cipherId: 'vigenere', keyVal: 'RAHASIA' },
    { cipherId: 'aes', keyVal: 'SuperSecret123!' },
  ];

  it('should create a valid recipe object with timestamp and version', () => {
    const recipe = createRecipe(sampleSteps, 'Test Recipe');
    expect(recipe.version).toBe('1.0');
    expect(recipe.name).toBe('Test Recipe');
    expect(recipe.steps.length).toBe(4);
    expect(recipe.steps[1].cipherId).toBe('caesar');
    expect(recipe.steps[1].keyVal).toBe('7');
  });

  it('should export recipe to formatted JSON and import back accurately', () => {
    const jsonStr = exportRecipeToJSON(sampleSteps, 'My JSON Recipe');
    expect(jsonStr).toContain('My JSON Recipe');
    expect(jsonStr).toContain('"cipherId": "vigenere"');

    const imported = importRecipeFromJSON(jsonStr);
    expect(imported.name).toBe('My JSON Recipe');
    expect(imported.steps).toEqual(sampleSteps);
  });

  it('should encode recipe to URL-safe Base64 param and decode back accurately', () => {
    const urlParam = encodeRecipeToURLParam(sampleSteps, 'URL Recipe 🚀');
    expect(urlParam).not.toContain('+');
    expect(urlParam).not.toContain('/');
    expect(urlParam).not.toContain('=');

    const decoded = decodeRecipeFromURLParam(urlParam);
    expect(decoded.name).toBe('URL Recipe 🚀');
    expect(decoded.steps).toEqual(sampleSteps);
  });

  it('should throw validation errors on invalid JSON or unknown cipherId during import', () => {
    expect(() => importRecipeFromJSON('not valid json {')).toThrow(/gagal mengimpor/i);
    
    const invalidSchemaJSON = JSON.stringify({
      version: '1.0',
      steps: [{ cipherId: 'unknown_cipher_id', keyVal: '' }],
    });
    expect(() => importRecipeFromJSON(invalidSchemaJSON)).toThrow(/algoritma yang tidak dikenal/i);

    const emptyStepsJSON = JSON.stringify({
      version: '1.0',
      steps: [],
    });
    expect(() => importRecipeFromJSON(emptyStepsJSON)).toThrow(/tidak boleh kosong/i);
  });
});
