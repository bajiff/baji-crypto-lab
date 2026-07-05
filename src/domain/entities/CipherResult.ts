export interface CipherResult {
  id: string;
  input: string;
  output: string;
  algorithm: string;
  timestamp: number; // Unix epoch ms
  mode: 'single' | 'combo';
}
