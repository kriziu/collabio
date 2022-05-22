import { AiOutlineClose } from 'react-icons/ai';

import { useModal } from '@/common/recoil/modal';

const NotFoundModal = ({ id }: { id: string }) => {
  const { closeModal } = useModal();

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10 ">
      <button onClick={closeModal} className="absolute top-5 right-5">
        <AiOutlineClose />
      </button>
      <h2 className="text-lg font-bold">Room with that id ({id}) not found!</h2>
      <h3>Check id and try to join room again.</h3>
    </div>
  );
};

export default NotFoundModal;
