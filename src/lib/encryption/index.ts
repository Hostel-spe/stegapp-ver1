import { caesarEncrypt, caesarDecrypt } from './caesar';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere';
import { playfairEncrypt, playfairDecrypt } from './playfair';
import { transpositionEncrypt, transpositionDecrypt } from './transposition';

export type EncryptionAlgorithm = 
  | 'caesar'
  | 'vigenere'
  | 'playfair'
  | 'transposition'
  | 'double_transposition'
  | 'hill'
  | 'rsa'
  | 'des'
  | 'sdes'
  | 'diffie_hellman'
  | 'elgamal'
  | 'stream_cipher';

export const encryptMessage = (message: string, algorithm: EncryptionAlgorithm, key?: string): string => {
  switch (algorithm) {
    case 'caesar':
      return caesarEncrypt(message, 3);
    case 'vigenere':
      return vigenereEncrypt(message, key || 'KEY');
    case 'playfair':
      return playfairEncrypt(message, key || 'KEYWORD');
    case 'transposition':
      return transpositionEncrypt(message, 4);
    case 'double_transposition':
      return transpositionEncrypt(transpositionEncrypt(message, 4), 4);
    default:
      return message;
  }
};

export const decryptMessage = (message: string, algorithm: EncryptionAlgorithm, key?: string): string => {
  switch (algorithm) {
    case 'caesar':
      return caesarDecrypt(message, 3);
    case 'vigenere':
      return vigenereDecrypt(message, key || 'KEY');
    case 'playfair':
      return playfairDecrypt(message, key || 'KEYWORD');
    case 'transposition':
      return transpositionDecrypt(message, 4);
    case 'double_transposition':
      return transpositionDecrypt(transpositionDecrypt(message, 4), 4);
    default:
      return message;
  }
};

export const encryptionAlgorithms = [
  { value: 'caesar', label: 'Caesar Cipher' },
  { value: 'vigenere', label: 'Vigenère Cipher' },
  { value: 'playfair', label: 'Playfair Cipher' },
  { value: 'transposition', label: 'Transposition Cipher' },
  { value: 'double_transposition', label: 'Double Transposition Cipher' },
  { value: 'hill', label: 'Hill Cipher (Coming Soon)' },
  { value: 'rsa', label: 'RSA (Coming Soon)' },
  { value: 'des', label: 'DES (Coming Soon)' },
  { value: 'sdes', label: 'S-DES (Coming Soon)' },
  { value: 'diffie_hellman', label: 'Diffie-Hellman (Coming Soon)' },
  { value: 'elgamal', label: 'ElGamal (Coming Soon)' },
  { value: 'stream_cipher', label: 'Stream Cipher (Coming Soon)' },
] as const;
