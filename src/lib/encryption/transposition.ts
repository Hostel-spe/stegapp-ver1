export const transpositionEncrypt = (text: string, key: number = 4): string => {
  const rows = Math.ceil(text.length / key);
  const grid: string[][] = Array(rows).fill(null).map(() => Array(key).fill(''));
  
  let index = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < key; j++) {
      if (index < text.length) {
        grid[i][j] = text[index++];
      }
    }
  }
  
  let result = '';
  for (let j = 0; j < key; j++) {
    for (let i = 0; i < rows; i++) {
      result += grid[i][j];
    }
  }
  
  return result;
};

export const transpositionDecrypt = (text: string, key: number = 4): string => {
  const rows = Math.ceil(text.length / key);
  const grid: string[][] = Array(rows).fill(null).map(() => Array(key).fill(''));
  
  let index = 0;
  for (let j = 0; j < key; j++) {
    for (let i = 0; i < rows; i++) {
      if (index < text.length) {
        grid[i][j] = text[index++];
      }
    }
  }
  
  let result = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < key; j++) {
      result += grid[i][j];
    }
  }
  
  return result;
};
