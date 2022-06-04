import { BsFillImageFill } from 'react-icons/bs';
import Resizer from 'react-image-file-resizer';

import { useMoveImage } from '../../hooks/useMoveImage';

const ImageChoser = () => {
  const { setMoveImage } = useMoveImage();

  const handleImageInput = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.addEventListener('change', () => {
      if (fileInput && fileInput.files) {
        const file = fileInput.files[0];
        Resizer.imageFileResizer(
          file,
          700,
          700,
          'WEBP',
          100,
          0,
          (uri) => {
            setMoveImage(uri.toString());
          },
          'base64'
        );
      }
    });
  };

  return (
    <button className="btn-icon text-xl" onClick={handleImageInput}>
      <BsFillImageFill />
    </button>
  );
};

export default ImageChoser;
