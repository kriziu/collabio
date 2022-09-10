import { CgScreen } from 'react-icons/cg';

import { useModal } from '@/modules/modal';

import BackgroundModal from '../modals/BackgroundModal';

const BackgroundPicker = () => {
  const { openModal } = useModal();

  return (
    <button className="btn-icon" onClick={() => openModal(<BackgroundModal />)}>
      <CgScreen />
    </button>
  );
};

export default BackgroundPicker;
