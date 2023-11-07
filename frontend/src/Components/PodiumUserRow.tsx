interface User {
  id: number;
  username: string;
  connected: string;
  totalXP: number;
  avatar: string;
}
interface Props {
  user: User;
}

const PodiumUserRow = ({ user }: Props) => {
  return (
    <a
      href={"/profil/" + user.username}
      key={user.id}
      className="flex justify-between py-4 px-4 border border-white hover:bg-neutral-800 rounded-md"
    >
      <div className="flex justify-center gap-4">
        <img
          src={user.avatar}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col justify-start">
          <div className="text-xl">{user.username}</div>
          <div className="text-sm text-gray-400">{user.connected}</div>
        </div>
      </div>
      <div className="text-xl flex justify-end items-center">
        {user.totalXP} pts
      </div>
    </a>
  );
};

export default PodiumUserRow;
