/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Notifs } from "../models/Notifications";
import IconButton from "./IconButton";
import { useNotificationContext } from "../contexts/NotificationContext";

const NotificationCard = ({
	sender,
	receiver,
	message,
	status,
	game,
	createdAt,
}: Notifs) => {
	const { setNotifsList, socket } = useNotificationContext();

	async function HandleNotifFriend(message: string) {
		await axios.patch("api/friends/" + sender, { status: message });
		const response = await axios.get("/api/notifications/my");
		setNotifsList(response.data);
	}

	async function HandleNotifGame(message: string) {
		await axios.patch("api/game/update/" + game.id, { status: message });
		socket?.emit("sendGameInvitationResponse", { message, sender, receiver }); // add game.id or sender and receiver
		const response = await axios.get("/api/notifications/my");
		setNotifsList(response.data);
	}

	return (
		<div className="py-2 pl-4 pr-2 w-full rounded-lg bg-cyan-950 shadow-md">
			<div className="mb-1">{message}</div>
			<div className="flex flex-row justify-between items-center">
				<div className="text-sm text-neutral-400">
					{createdAt || "Sometime ago"}
				</div>
				<div className="flex">
					<IconButton
						onClick={
							game
								? () => HandleNotifGame("en cours")
								: () => HandleNotifFriend("valider")
						}
						icon={<CheckIcon />}
						classCustom="w-6 h-6 p-1 rounded-lg hover:bg-green-800"
					/>
					<IconButton
						onClick={
							game
								? () => HandleNotifGame("refuser")
								: () => HandleNotifFriend("refuser")
						}
						icon={<XMarkIcon />}
						classCustom="w-6 h-6 p-1 rounded-lg hover:bg-red-800"
					/>
				</div>
			</div>
		</div>
	);
};

export default NotificationCard;
