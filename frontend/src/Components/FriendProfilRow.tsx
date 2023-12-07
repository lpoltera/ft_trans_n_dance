import {
  ChatBubbleBottomCenterTextIcon,
  NoSymbolIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { User } from "../models/User";

interface Props {
  ami: User;
  IsMyProfile: boolean;
}

const navigateToChat = () => {
  window.location.href = "/chat";
};

const FriendProfilRow = ({ ami, IsMyProfile }: Props) => {
  const [isBlocked, setIsBlocked] = useState(false);

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
          {IsMyProfile && (
            <div className="grid grid-flow-col grid-cols-3 gap-2">
              <button
                type="button"
                className="w-6 h-6 opacity-50 hover:opacity-100"
                onClick={() => changeFriendshipStatus()}
              >
                <NoSymbolIcon />
              </button>
              <button
                type="button"
                className="w-6 h-6 opacity-50 hover:opacity-100"
                onClick={navigateToChat}
              >
                <ChatBubbleBottomCenterTextIcon />
              </button>
              <button
                type="button"
                className="w-6 h-6 opacity-50 hover:opacity-100"
              >
                <UserIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FriendProfilRow;
