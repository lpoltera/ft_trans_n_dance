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
      <div className="p-2 flex flex-col items-start max-w-md mr-auto">
        <div className="flex flex-row gap-3 bg-cyan-900 py-2 pr-3 pl-2 rounded-xl">
          <img
            className="w-6 h-6 rounded-full object-cover"
            src={user.avatar}
            alt="user avatar profile"
          />
          <div className="flex flex-col items-start">
            <p>{message.text}</p>
          </div>
        </div>
        <span className=" block text-xs text-white opacity-50 mt-1 ml-1">
          {formattedDateTime}
        </span>
      </div>
    </>
  );
};

export default LeftMessageContainer;
