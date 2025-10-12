const createMatrix = (key: string): string[][] => {
  const matrix: string[][] = [];
  const used = new Set<string>();
  const keyStr = (key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ')
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/[^A-Z]/g, '');
  
  let row: string[] = [];
  for (const char of keyStr) {
    if (!used.has(char)) {
      used.add(char);
      row.push(char);
      if (row.length === 5) {
        matrix.push(row);
        row = [];
      }
    }
  }
  
  return matrix;
};

const findPosition = (matrix: string[][], char: string): [number, number] => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) return [i, j];
    }
  }
  return [0, 0];
};

export const playfairEncrypt = (text: string, key: string = 'KEYWORD'): string => {
  const matrix = createMatrix(key);
  const cleanText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let result = '';
  
  for (let i = 0; i < cleanText.length; i += 2) {
    let a = cleanText[i];
    let b = i + 1 < cleanText.length ? cleanText[i + 1] : 'X';
    
    if (a === b) b = 'X';
    
    const [row1, col1] = findPosition(matrix, a);
    const [row2, col2] = findPosition(matrix, b);
    
    if (row1 === row2) {
      result += matrix[row1][(col1 + 1) % 5];
      result += matrix[row2][(col2 + 1) % 5];
    } else if (col1 === col2) {
      result += matrix[(row1 + 1) % 5][col1];
      result += matrix[(row2 + 1) % 5][col2];
    } else {
      result += matrix[row1][col2];
      result += matrix[row2][col1];
    }
  }
  
  return result;
};

export const playfairDecrypt = (text: string, key: string = 'KEYWORD'): string => {
  const matrix = createMatrix(key);
  let result = '';
  
  for (let i = 0; i < text.length; i += 2) {
    const a = text[i];
    const b = text[i + 1];
    
    const [row1, col1] = findPosition(matrix, a);
    const [row2, col2] = findPosition(matrix, b);
    
    if (row1 === row2) {
      result += matrix[row1][(col1 + 4) % 5];
      result += matrix[row2][(col2 + 4) % 5];
    } else if (col1 === col2) {
      result += matrix[(row1 + 4) % 5][col1];
      result += matrix[(row2 + 4) % 5][col2];
    } else {
      result += matrix[row1][col2];
      result += matrix[row2][col1];
    }
  }
  
  return result;
};
