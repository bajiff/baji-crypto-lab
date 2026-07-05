import type { Cipher } from './Cipher';

export interface PipelineStep {
  cipher: Cipher;
  key?: string;
}
