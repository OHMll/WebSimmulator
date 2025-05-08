export function avg(numbers) {
  let sum = 0;
  numbers.forEach(num => sum += num);
  return numbers.length === 0 ? 0 : sum / numbers.length;
}
