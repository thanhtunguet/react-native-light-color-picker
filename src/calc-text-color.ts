import { hex2Rgb } from 'colorsys';

export function calcTextColor(color: string) {
  const { r, g, b } = hex2Rgb(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.5) {
    return '#000000';
  }
  return '#FFFFFF';
}
