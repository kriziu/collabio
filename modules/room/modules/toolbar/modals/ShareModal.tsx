import { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';

import { useRoom } from '@/common/recoil/room';
import { useModal } from '@/modules/modal';

const ShareModal = () => {
  const { id } = useRoom();
  const { closeModal } = useModal();

  const [url, setUrl] = useState('');

  useEffect(() => setUrl(window.location.href), []);

  const handleCopy = () => navigator.clipboard.writeText(url);

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10 pt-5">
      <button onClick={closeModal} className="absolute top-5 right-5">
        <AiOutlineClose />
      </button>
      <h2 className="text-2xl font-bold">Invite</h2>
      <h3>
        Room id: <p className="inline font-bold">{id}</p>
      </h3>
      <div className="relative mt-2">
        <input type="text" value={url} readOnly className="input sm:w-96" />
        <button className="btn absolute right-0 h-full" onClick={handleCopy}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
