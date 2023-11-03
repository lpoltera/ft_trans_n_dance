import PodiumUserRow from "./PodiumUserRow";
import avatar from "../assets/avatar-cat.png";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
	id: number,
	username: string,
	totalXP: number,
	connected: string
	avatar: string,
}
const PodiumList = () => {
	const [Users, setPodiumUser] = useState<User[] | null>(null);
	useEffect(() => {
		axios.get<User[]>("/api/leaderboard")
		.then((response) => setPodiumUser(response.data))
	}, []);
//   const Users = [
//     {
//       id: 1,
//       pseudo: "Raph",
//       status: "En ligne",
//       score: 3200,
//       avatar: avatar,
//     },
//     {
//       id: 2,
//       pseudo: "Paul",
//       status: "Hors ligne",
//       score: 3000,
//       avatar: avatar,
//     },
//     { id: 4, pseudo: "Lucas", status: "En ligne", score: 2800, avatar: avatar },
//   ];
  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl">Podium</h2>
      </div>
      <div className="flex flex-col justify-between w-96 gap-4">
        {Users && Users.map((user, index) => (
          <PodiumUserRow key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default PodiumList;
