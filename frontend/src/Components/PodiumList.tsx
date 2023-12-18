import axios from "axios";
import { useEffect, useState } from "react";
import PodiumUserRow from "./PodiumUserRow";
import { User } from "../models/User";


const PodiumList = () => {
	const [Users, setPodiumUser] = useState<User[] | null>(null);
	useEffect(() => {
		axios
			.get<User[]>("/api/leaderboard")
			.then((response) => setPodiumUser(response.data));
	}, []);

	return (
		<div>
			<div className="flex flex-col items-center mb-4">
				<h2 className="text-2xl">Podium</h2>
			</div>
			<div className="flex flex-col justify-between w-96 gap-4">
				{Users &&
					Users.map((user, index) => (
						<PodiumUserRow key={index} currentUser={user} />
					))}
			</div>
		</div>
	);
};

export default PodiumList;
