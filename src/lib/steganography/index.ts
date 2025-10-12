export type SteganographyAlgorithm =
  | 'lsb'
  | 'lsb_matching'
  | 'pvd'
  | 'masking'
  | 'dct_dwt'
  | 'palette_based'
  | 'whitespace'
  | 'word_mapping'
  | 'line_shift';

export const imageAlgorithms = [
  { value: 'lsb', label: 'LSB (Least Significant Bit)' },
  { value: 'lsb_matching', label: 'LSB Matching (Coming Soon)' },
  { value: 'pvd', label: 'Pixel Value Differencing (Coming Soon)' },
  { value: 'masking', label: 'Masking & Filtering (Coming Soon)' },
  { value: 'dct_dwt', label: 'DCT/DWT Transform (Coming Soon)' },
  { value: 'palette_based', label: 'Palette-Based (Coming Soon)' },
] as const;

export const textAlgorithms = [
  { value: 'whitespace', label: 'Whitespace Encoding' },
  { value: 'word_mapping', label: 'Word Mapping (Coming Soon)' },
  { value: 'line_shift', label: 'Line-Shift (Coming Soon)' },
] as const;
