import { NoSymbolIcon, UserIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { User } from "../../models/User";
import { useTabContext } from "../../contexts/TabContext";

interface Props {
  ami: User;
  index: number;
}

const FriendChatListItem = ({ ami, index }: Props) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const { activeTab } = useTabContext();
  const isActive = index === activeTab;

  const changeFriendshipStatus = async () => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir bloquer cet utilisateur?"
    );

    if (isConfirmed) {
      await axios.patch("api/friends/" + ami.username, { status: "blocked" });
      setIsBlocked(true);
    }
  };

  return (
    <>
      {!isBlocked && (
        <div
          className={`flex flex-row items-center gap-10 p-4 hover:bg-neutral-800 rounded-md w-full hover:cursor-pointer 
          ${isActive ? "bg-neutral-800" : "bg-transparent"}`}
        >
          <div className="flex flex-row w-full gap-4">
            <img
              src={ami.avatar}
              alt="user'avatar profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className=" text-left">
              <div className="text-xl">{ami.username}</div>
              <div className="text-sm text-gray-400">{ami.connected}</div>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="w-5 h-5 opacity-50 hover:opacity-100"
              onClick={() => changeFriendshipStatus()}
            >
              <NoSymbolIcon />
            </button>
            <button
              type="button"
              className="w-5 h-5 opacity-50 hover:opacity-100"
            >
              <UserIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendChatListItem;
