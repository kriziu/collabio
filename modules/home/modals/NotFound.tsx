import { AiOutlineClose } from 'react-icons/ai';

import { useModal } from '@/modules/modal';

const NotFoundModal = ({ id }: { id: string }) => {
  const { closeModal } = useModal();

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10 ">
      <button onClick={closeModal} className="absolute top-5 right-5">
        <AiOutlineClose />
      </button>
      <h2 className="text-lg font-bold">
        Room with id &quot;{id}&quot; does not exist or is full!
      </h2>
      <h3>Try to join room later.</h3>
    </div>
  );
};

export default NotFoundModal;
