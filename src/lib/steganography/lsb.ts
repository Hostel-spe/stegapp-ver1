export const encodeLSB = async (imageData: ImageData, message: string): Promise<ImageData> => {
  const binary = message
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('') + '00000000'; // Null terminator
  
  const data = new Uint8ClampedArray(imageData.data);
  let binaryIndex = 0;
  
  for (let i = 0; i < data.length && binaryIndex < binary.length; i += 4) {
    // Modify RGB channels (skip alpha)
    for (let j = 0; j < 3 && binaryIndex < binary.length; j++) {
      data[i + j] = (data[i + j] & 0xFE) | parseInt(binary[binaryIndex]);
      binaryIndex++;
    }
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

export const decodeLSB = (imageData: ImageData): string => {
  const data = imageData.data;
  let binary = '';
  
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      binary += (data[i + j] & 1).toString();
    }
  }
  
  let message = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    const charCode = parseInt(byte, 2);
    if (charCode === 0) break;
    message += String.fromCharCode(charCode);
  }
  
  return message;
};
