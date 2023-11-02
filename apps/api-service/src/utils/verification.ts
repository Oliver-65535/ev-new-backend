export const generateRandomCode = (digits: number): string => {
  return Array(digits)
    .fill(null)
    .map(() => Math.round(Math.random() * 9).toString())
    .join('');
};
