export const vigenereEncrypt = (text: string, key: string = 'KEY'): string => {
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      const keyChar = key[keyIndex % key.length].toUpperCase();
      const shift = keyChar.charCodeAt(0) - 65;
      result += String.fromCharCode(((code - base + shift) % 26) + base);
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
};

export const vigenereDecrypt = (text: string, key: string = 'KEY'): string => {
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      const keyChar = key[keyIndex % key.length].toUpperCase();
      const shift = keyChar.charCodeAt(0) - 65;
      result += String.fromCharCode(((code - base - shift + 26) % 26) + base);
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
};
