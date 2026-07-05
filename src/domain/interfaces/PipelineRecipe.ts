import type { CipherId } from '../../infrastructure/ciphers/cipher.registry';

export interface PipelineRecipeStep {
  cipherId: CipherId;
  keyVal: string;
}

export interface PipelineRecipe {
  version: string;
  name: string;
  createdAt: string;
  steps: PipelineRecipeStep[];
}
