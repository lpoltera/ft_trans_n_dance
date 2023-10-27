interface User {
  id: number;
  pseudo: string;
  status: string;
  score: number;
  avatar: string;
}
interface Props {
  user: User;
}

const PodiumUserRow = ({ user }: Props) => {
  return (
    <a
      href={"/profil/" + user.pseudo}
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
          <div className="text-xl">{user.pseudo}</div>
          <div className="text-sm text-gray-400">{user.status}</div>
        </div>
      </div>
      <div className="text-xl flex justify-end items-center">
        {user.score} pts
      </div>
    </a>
  );
};

export default PodiumUserRow;
