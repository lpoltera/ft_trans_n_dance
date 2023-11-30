import { ChatMessage } from "../../models/Notifications";
import { User } from "../../models/User";

interface Props {
  user: User;
  message: ChatMessage;
}

const RightMessageContainer = ({ user, message }: Props) => {
  const dateTime = message.createdAt ? message.createdAt.split("T") : null;
  // sconst date = dateTime ? dateTime[0] : "";
  const time = dateTime ? dateTime[1].substring(0, 5) : "";
  const formattedDateTime = `${time}`;
  return (
    <>
      <div className="p-2 flex flex-col items-end max-w-md ml-auto">
        <div className="flex flex-row gap-3 bg-cyan-900 py-2 pl-3 pr-2 rounded-xl">
          <div>
            <p>{message.text}</p>
          </div>
          <img
            className="w-6 h-6 rounded-full object-cover"
            src={user.avatar}
            alt="user avatar profile"
          />
        </div>
        <span className=" block text-xs text-white opacity-50 mt-1 mr-1">
          {formattedDateTime}
        </span>
      </div>
    </>
  );
};

export default RightMessageContainer;
