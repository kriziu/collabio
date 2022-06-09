import { RgbaColor } from 'react-colorful';

export const getStringFromRgba = (rgba: RgbaColor) =>
  `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
