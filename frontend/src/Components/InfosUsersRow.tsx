import {
  InformationCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

interface User {
  username: string;
  avatar: string;
  connected: string;
  win: number;
  loss: number;
  draw: number;
  totalXP: number;
  totalGame: number;
}

interface Props {
  ami: User;
  handleStatsButtonClick: (ami: User) => void;
}

const InfosUsersRow = ({ ami, handleStatsButtonClick }: Props) => {
  const changeFriendshipStatus = async () => {
    await axios.patch("api/friends/" + ami.username, { status: "pending" });
    window.location.reload();
  };

  return (
    <>
      <div className="flex justify-between items-center pr-4 hover:bg-neutral-800 rounded-md">
        <a href={"/profil/" + ami.username} className="py-4 px-4">
          <div className="flex justify-center gap-4">
            <img
              src={ami.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col justify-start">
              <div className="text-xl">{ami.username}</div>
              <div className="text-sm text-gray-400">{ami.connected}</div>
            </div>
          </div>
          <div className="text-xl flex justify-end items-center"></div>
        </a>
        <div className="grid grid-flow-col grid-cols-3 gap-2">
          <button
            type="button"
            className="w-6 h-6 opacity-100 hover:opacity-100"
            onClick={() => changeFriendshipStatus()}
          >
            <UserPlusIcon />
          </button>
          <button
            type="button"
            className="w-6 h-6 opacity-100 hover:opacity-100"
            onClick={() => handleStatsButtonClick(ami)}
          >
            <InformationCircleIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default InfosUsersRow;
