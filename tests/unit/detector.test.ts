import { describe, it, expect } from 'vitest';
import { detectEncoding } from '../../src/application/services/detector.service';

describe('Detector Service — Encoding Auto-Detection', () => {
  it('should detect Base64 encoding accurately', () => {
    const res1 = detectEncoding('SGVsbG8gRHVuaWE=');
    expect(res1.type).toBe('base64');
    expect(res1.label).toContain('Base64');

    const res2 = detectEncoding('QmFqaSBDcnlwdG8gTGFi'); // No padding
    expect(res2.type).toBe('base64');
  });

  it('should detect Hexadecimal encoding accurately', () => {
    const res1 = detectEncoding('48656c6c6f2042616a69');
    expect(res1.type).toBe('hex');

    const res2 = detectEncoding('0x48 65 6c 6c 6f');
    expect(res2.type).toBe('hex');

    const res3 = detectEncoding('48:65:6c:6c:6f:21');
    expect(res3.type).toBe('hex');
  });

  it('should detect 8-bit Binary strings accurately', () => {
    const res = detectEncoding('01001000 01100101 01101100 01101100 01101111');
    expect(res.type).toBe('binary');
  });

  it('should detect URL percent-encoding accurately', () => {
    const res = detectEncoding('Hello%20World%21%3D%25');
    expect(res.type).toBe('url');
  });

  it('should detect JSON structured data accurately', () => {
    const res = detectEncoding('{"name": "Baji", "role": "Senior Engineer"}');
    expect(res.type).toBe('json');
  });

  it('should fallback to plain text for standard readable sentences', () => {
    const res = detectEncoding('Halo Tuan Baji, selamat datang di Crypto Lab.');
    expect(res.type).toBe('text');
  });
});
