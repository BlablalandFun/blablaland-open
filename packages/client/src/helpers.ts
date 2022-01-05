export function random(min = 0, max = 50) {
  let num = Math.random() * (max - min) + min;

  return Math.floor(num);
};