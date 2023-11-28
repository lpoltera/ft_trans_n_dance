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
      <div className="p-2 max-w-max ml-auto mr-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-end">
            <p>{message.text}</p>
            <span className=" block text-xs text-white opacity-50">
              {formattedDateTime}
            </span>
          </div>
          <img
            className="w-6 h-6 rounded-full object-cover"
            src={user.avatar}
            alt="user avatar profile"
          />
        </div>
      </div>
    </>
  );
};

export default RightMessageContainer;
