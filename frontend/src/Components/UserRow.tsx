import {
  NoSymbolIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { User } from "../models/User";
import IconButton from "./IconButton";

interface Props {
  user: User;
  isMyProfile?: boolean;
  isFriend?: boolean;
}

const UserRow = ({ user, isMyProfile = false, isFriend = false }: Props) => {
  // TOBEDELETED
  const addFriend = () => {};
  const removeFriend = () => {};
  const blockUser = () => {};
  return (
    <a
      href={`/profil/${user.username}`}
      className="flex w-full rounded-lg justify-between items-center py-4 px-6 bg-cyan-950 hover:bg-neutral-800"
    >
      <div className="flex shrink gap-4 items-center">
        <img
          src={user.avatar}
          alt="Profile picture"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex flex-col gap-1 pt-1">
          <h1 className="text-lg leading-none">{user.username}</h1>
          <span className="text-neutral-400 text-sm">{user.connected}</span>
        </div>
      </div>
      <div className="flex gap-0 items-center">
        {isMyProfile || isFriend ? (
          <>
            <IconButton
              icon={<UserMinusIcon />}
              classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
              onClick={removeFriend}
              tooltip="Supprimer de la liste d'amis"
              tooltipId="removeFriend"
            />
          </>
        ) : (
          <>
            <IconButton
              icon={<UserPlusIcon />}
              classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
              onClick={addFriend}
              tooltip="Ajouter en ami"
              tooltipId="addFriend"
            />
          </>
        )}
        <IconButton
          onClick={blockUser}
          icon={<NoSymbolIcon />}
          classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
          tooltip="Bloquer"
          tooltipId="blockUser"
        />
      </div>
    </a>
  );
};

export default UserRow;
