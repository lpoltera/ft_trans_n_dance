import { CheckIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { User } from "../../models/User";

interface Props {
  ami: User;
}

const FriendProfilRow = ({ ami }: Props) => {
  const changeFriendshipStatus = async () => {
    await axios.patch("api/friends/" + ami.username, { status: "valider" });
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
            className="w-6 h-6 opacity-50 hover:opacity-100"
            onClick={() => changeFriendshipStatus()}
          >
            <CheckIcon />
          </button>
          <button
            type="button"
            className="w-6 h-6 opacity-50 hover:opacity-100"
          >
            <UserMinusIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default FriendProfilRow;
