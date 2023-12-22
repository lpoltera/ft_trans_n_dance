import { useUserContext } from "../contexts/UserContext";
import { User } from "../models/User";

interface Props {
  currentUser: User;
}

const PodiumUserRow = ({ currentUser }: Props) => {
  const { user } = useUserContext();
  return (
    <a
      href={"/profil/" + currentUser.username}
      key={currentUser.id}
      className="flex justify-between py-4 px-4 border border-white hover:bg-[#f67539] rounded-md"
    >
      <div className="flex justify-center gap-4">
        <img
          src={currentUser.avatar}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col justify-start">
          <div className="text-xl">
            {currentUser.username}{" "}
            {currentUser.username === user?.username && <sup>(vous)</sup>}
          </div>
          <div className="text-sm text-gray-400">{currentUser.connected}</div>
        </div>
      </div>
      <div className="text-xl flex justify-end items-center">{3000} pts</div>
    </a>
  );
};

export default PodiumUserRow;
