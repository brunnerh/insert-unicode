export const codesToHex = (codes: number[]) => codes.map(code => `0x${code.toString(16)}`).join(' ');

export const codesToText = (codes: number[]) => codes.map(code => String.fromCodePoint(code)).join('');