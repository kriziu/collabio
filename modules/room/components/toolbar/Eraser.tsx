import { FaEraser } from 'react-icons/fa';

import { useOptions } from '@/common/recoil/options';

const Eraser = () => {
  const [options, setOptions] = useOptions();

  return (
    <button
      className={`btn-icon text-xl ${options.erase && 'bg-green-400'}`}
      onClick={() => {
        setOptions((prev) => ({ ...prev, erase: !prev.erase }));
      }}
    >
      <FaEraser />
    </button>
  );
};

export default Eraser;
