export const encodeWhitespace = (coverText: string, message: string): string => {
  const binary = message
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
  
  const words = coverText.split(' ');
  let result = '';
  let binaryIndex = 0;
  
  for (let i = 0; i < words.length && binaryIndex < binary.length; i++) {
    result += words[i];
    if (i < words.length - 1) {
      result += binary[binaryIndex] === '0' ? ' ' : '  '; // 1 or 2 spaces
      binaryIndex++;
    }
  }
  
  return result;
};

export const decodeWhitespace = (stegoText: string): string => {
  let binary = '';
  
  for (let i = 0; i < stegoText.length - 1; i++) {
    if (stegoText[i] === ' ') {
      binary += stegoText[i + 1] === ' ' ? '1' : '0';
    }
  }
  
  let message = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    if (byte.length < 8) break;
    const charCode = parseInt(byte, 2);
    if (charCode === 0) break;
    message += String.fromCharCode(charCode);
  }
  
  return message;
};
