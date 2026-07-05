import type { Cipher } from './Cipher';

export interface PipelineStep {
  id?: string;
  cipher: Cipher;
  key?: string;
}
