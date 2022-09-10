import { socket } from '@/common/lib/socket';
import { MessageType } from '@/common/types/global';

const Message = ({ userId, msg, username, color }: MessageType) => {
  const me = socket.id === userId;

  return (
    <div
      className={`my-2 flex gap-2 text-clip ${me && 'justify-end text-right'}`}
    >
      {!me && (
        <h5 style={{ color }} className="font-bold">
          {username}
        </h5>
      )}
      <p style={{ wordBreak: 'break-all' }}>{msg}</p>
    </div>
  );
};

export default Message;
