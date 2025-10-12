export const caesarEncrypt = (text: string, shift: number = 3): string => {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
};

export const caesarDecrypt = (text: string, shift: number = 3): string => {
  return caesarEncrypt(text, 26 - shift);
};
