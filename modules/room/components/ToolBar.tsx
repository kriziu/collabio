import { useSetOptions } from '@/common/recoil/options/options.hooks';

const ToolBar = () => {
  const setOptions = useSetOptions();

  return (
    <div className="absolute left-0 top-0 z-50 flex gap-5 bg-black text-white">
      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: 'red' }))}
      >
        red
      </button>
      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: 'green' }))}
      >
        green
      </button>
      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: 'blue' }))}
      >
        blue
      </button>
      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: 'black' }))}
      >
        black
      </button>
    </div>
  );
};

export default ToolBar;
