export interface EncodingDetectionResult {
  type: 'base64' | 'hex' | 'binary' | 'url' | 'json' | 'text';
  label: string;
  confidence: 'high' | 'medium' | 'low';
  description: string;
}

export function detectEncoding(text: string): EncodingDetectionResult {
  const clean = text.trim();
  if (!clean) {
    return {
      type: 'text',
      label: 'Teks Biasa',
      confidence: 'low',
      description: 'Menunggu input teks...',
    };
  }

  // 1. Check JSON Structured Data
  if ((clean.startsWith('{') && clean.endsWith('}')) || (clean.startsWith('[') && clean.endsWith(']'))) {
    try {
      JSON.parse(clean);
      return {
        type: 'json',
        label: 'Terdeteksi JSON Data',
        confidence: 'high',
        description: 'Teks merupakan objek atau array berformat JSON yang valid.',
      };
    } catch (e) {}
  }

  // 2. Check URL Percent-Encoding
  if (/%[0-9A-Fa-f]{2}/.test(clean) && (clean.includes('%20') || clean.includes('%3D') || clean.includes('%2F') || clean.includes('%2B') || clean.includes('%3A') || clean.includes('%25'))) {
    return {
      type: 'url',
      label: 'Terdeteksi URL Encoded',
      confidence: 'high',
      description: 'Teks mengandung karakter berformat URL Percent-Encoding (%XX).',
    };
  }

  // 3. Check Binary (8-bit binary string)
  const binaryClean = clean.replace(/\s+/g, '');
  if (/^[01]+$/.test(binaryClean) && binaryClean.length >= 8 && binaryClean.length % 8 === 0) {
    return {
      type: 'binary',
      label: 'Terdeteksi Biner (Binary 8-bit)',
      confidence: 'high',
      description: 'Teks terdiri dari aliran bit biner 0 dan 1 (kelipatan 8 bit / byte).',
    };
  }

  // 4. Check Hexadecimal (Hex Byte String)
  const hexClean = clean.replace(/^0x/i, '').replace(/[\s:-]+/g, '');
  if (/^[0-9A-Fa-f]+$/.test(hexClean) && hexClean.length >= 4 && hexClean.length % 2 === 0) {
    const hasHexLetters = /[A-Fa-f]/.test(hexClean);
    const hasHexFormatting = /^0x/i.test(clean) || /[\s:-]/.test(clean);
    if (hasHexLetters || hasHexFormatting || hexClean.length >= 8) {
      return {
        type: 'hex',
        label: 'Terdeteksi Hexadecimal (Hex)',
        confidence: hasHexLetters || hasHexFormatting ? 'high' : 'medium',
        description: 'Teks teridentifikasi sebagai bilangan basis 16 (Hexadecimal Byte String).',
      };
    }
  }

  // 5. Check Base64 Encoding
  const b64Clean = clean.replace(/\s+/g, '');
  if (/^[A-Za-z0-9+/-_]+={0,2}$/.test(b64Clean) && b64Clean.length >= 4 && b64Clean.length % 4 === 0) {
    const endsWithPad = /=+$/.test(b64Clean);
    const hasB64Symbols = /[+/-_]/.test(b64Clean);
    const isLonger = b64Clean.length >= 8;

    if (endsWithPad || hasB64Symbols || isLonger) {
      try {
        const stdB64 = b64Clean.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(stdB64);
        if (decoded && decoded !== clean) {
          return {
            type: 'base64',
            label: 'Terdeteksi Base64 Encoding',
            confidence: endsWithPad || hasB64Symbols ? 'high' : 'medium',
            description: 'Teks berformat Base64 (RFC 4648 Binary-to-Text Encoding).',
          };
        }
      } catch (e) {}
    }
  }

  // Default fallback: Plain Text
  return {
    type: 'text',
    label: 'Teks Biasa (ASCII / UTF-8)',
    confidence: 'high',
    description: 'Teks karakter standar reguler (tidak terdeteksi format encoding khusus).',
  };
}
