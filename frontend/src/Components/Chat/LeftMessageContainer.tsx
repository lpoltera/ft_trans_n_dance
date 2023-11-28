import { ChatMessage } from "../../models/Notifications";
import { User } from "../../models/User";

interface Props {
  user: User;
  message: ChatMessage;
}

const LeftMessageContainer = ({ user, message }: Props) => {
  const dateTime = message.createdAt ? message.createdAt.split("T") : null;
  // const date = dateTime ? dateTime[0] : "";
  const time = dateTime ? dateTime[1].substring(0, 5) : "";
  const formattedDateTime = `${time}`;
  return (
    <>
      <div className="p-2 max-w-max mr-auto ml-4">
        <div className="flex flex-row gap-4">
          <img
            className="w-6 h-6 rounded-full object-cover"
            src={user.avatar}
            alt="user avatar profile"
          />
          <div className="flex flex-col items-start">
            <p>{message.text}</p>
            <span className=" block text-xs text-white opacity-50">
              {formattedDateTime}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftMessageContainer;
