interface User {
  id?: number;
  username: string;
  connected: string;
  avatar: string;
}

interface ChatMessage {
  sender: string;
  text: string;
}

interface Props {
  ami: User;
  message: ChatMessage;
}

const LeftMessageContainer = ({ ami, message }: Props) => {
  return (
    <div>
      {/* Message Left Container */}
      <div className="message-left message-container">
        <div className="span-left"></div>
        <div className="span-content">
          <img
            className="message-container__avatar"
            src={ami.avatar}
            alt="user'avatar profile"
          />
          <div>
            <p>{message.text}</p>
          </div>
        </div>
        <div className="span-right"></div>
      </div>
      <div className="span-right"></div>
    </div>
  );
};

export default LeftMessageContainer;
