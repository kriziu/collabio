import { MotionValue } from 'framer-motion';

export const getPos = (pos: number, motionValue: MotionValue) =>
  pos - motionValue.get();
