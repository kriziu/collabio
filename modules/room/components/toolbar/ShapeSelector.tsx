import { useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { BiRectangle } from 'react-icons/bi';
import { BsPencilFill } from 'react-icons/bs';
import { FaCircle } from 'react-icons/fa';
import { useClickAway } from 'react-use';

import { useOptions } from '@/common/recoil/options';

import { EntryAnimation } from '../../animations/Entry.animations';

const ShapeSelector = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useOptions();

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const handleShapeChange = (shape: Shape) => {
    setOptions((prev) => ({
      ...prev,
      shape,
    }));

    setOpened(false);
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="btn-icon text-xl"
        onClick={() => setOpened((prev) => !prev)}
      >
        {options.shape === 'circle' && <FaCircle />}
        {options.shape === 'rect' && <BiRectangle />}
        {options.shape === 'line' && <BsPencilFill />}
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 flex gap-1 rounded-lg bg-zinc-900 p-2"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <button
              className="btn-icon text-xl"
              onClick={() => handleShapeChange('circle')}
            >
              <FaCircle />
            </button>

            <button
              className="btn-icon text-xl"
              onClick={() => handleShapeChange('rect')}
            >
              <BiRectangle />
            </button>

            <button
              className="btn-icon text-xl"
              onClick={() => handleShapeChange('line')}
            >
              <BsPencilFill />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;
