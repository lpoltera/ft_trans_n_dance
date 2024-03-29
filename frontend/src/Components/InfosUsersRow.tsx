import {
	InformationCircleIcon,
	UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";
import { User } from "../models/User";
import IconButton from "./IconButton";

interface Props {
	ami: User;
	handleStatsButtonClick: (ami: User) => void;
	currentUser: User;
	displayToast: (socket: any) => void;
	selectedUser: User | null;
}

const InfosUsersRow = ({
	ami,
	handleStatsButtonClick,
	currentUser,
	displayToast,
	selectedUser,
}: Props) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io("https://localhost:8000");

		// newSocket.on("error", (error) => {
		//   displayToast(error.error);
		// });

		// newSocket.on("myNotifs", () => {
		//   displayToast("");
		// });

		setSocket(newSocket);

		return () => { };
	}, []);

	//   const addFriend = () => {
	//     // await axios
	//     //   .post("/api/friends/add/" + ami.username)
	//     //   .then(() => {
	//     displayToast();
	//     changeFriendshipStatus();
	//     //   })
	//     //   .catch((err) => {
	//     //     if (err.response && err.response.data && err.response.data.message) {
	//     //       const errorMessage = err.response.data.message;
	//     //       return alert("Error: " + errorMessage);
	//     //     } else {
	//     //       return alert("Error: " + err.message);
	//     //     }
	//     //   });
	//   };

	// socket?.on("connect_error", (error) => {
	//   console.log("Erreur de connexion : ", error);
	// });

	// socket?.on("error", (error) => {
	//   console.log("Erreurrrr : ", error);
	//   displayToast(error);
	// });

	const changeFriendshipStatus = async () => {
		console.log("send notif");
		if (socket) {
			socket.emit("sendFriendNotif", {
				sender: currentUser.username,
				receiver: ami.username,
				message: `Tu as reçu une demande d'ami de ${currentUser.username}`,
			});
		}
		displayToast(socket);

		// addFriend();
	};

	console.log("selectedUser in InfosUsersRow =", selectedUser);
	console.log("ami in InfosUsersRow =", ami);
	return (
		<>
			<div className={`flex justify-between items-center pr-4 rounded-md ${selectedUser === ami ? "bg-neutral-600" : "hover:bg-[#f67539]"}`}>
				{/* <div className={`flex justify-between items-center pr-4 hover:bg-[#f67539] rounded-md bg-red-600`}> */}
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
				</a>
				<div className="grid grid-flow-col grid-cols-3 gap-2">
					<IconButton
						icon={<UserPlusIcon />}
						classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
						onClick={() => changeFriendshipStatus()}
						tooltip="Ajouter en ami"
						tooltipId="addFriend"
					/>
					<IconButton
						icon={<InformationCircleIcon />}
						classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
						onClick={() => handleStatsButtonClick(ami)}
						tooltip="Afficher les stats du joueur"
						tooltipId="displayUserStats"
					/>
				</div>
			</div >
		</>
	);
};

export default InfosUsersRow;
