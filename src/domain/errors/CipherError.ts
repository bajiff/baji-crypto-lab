export class CipherError extends Error {
  constructor(
    message: string,
    public readonly algorithm: string,
    public readonly operation: 'encrypt' | 'decrypt' | 'validation'
  ) {
    super(message);
    this.name = 'CipherError';
  }
}
