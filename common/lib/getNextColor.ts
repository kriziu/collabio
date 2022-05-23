import { COLORS_ARRAY } from '../constants/colors';

export const getNextColor = (color?: string) => {
  const index = COLORS_ARRAY.findIndex((colorArr) => colorArr === color);

  if (index === -1) return COLORS_ARRAY[0];

  return COLORS_ARRAY[(index + 1) % COLORS_ARRAY.length];
};
