import PodiumUserRow from "./PodiumUserRow";
import avatar from "../assets/avatar-1.png";

const PodiumList = () => {
  const Users = [
    {
      id: 1,
      pseudo: "Raph",
      status: "En ligne",
      score: 3200,
      avatar: avatar,
    },
    {
      id: 2,
      pseudo: "Paul",
      status: "Hors ligne",
      score: 3000,
      avatar: avatar,
    },
    { id: 4, pseudo: "Lucas", status: "En ligne", score: 2800, avatar: avatar },
  ];
  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl">Podium</h2>
      </div>
      <div className="flex flex-col justify-between w-96 gap-4">
        {Users.map((user, index) => (
          <PodiumUserRow key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default PodiumList;
