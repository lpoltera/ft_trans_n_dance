import { NoSymbolIcon, UserIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { User } from "../../models/User";
import { useTabContext } from "../../contexts/TabContext";
import IconButton from "../IconButton";
import { useNotificationContext } from "../../contexts/NotificationContext";

interface Props {
	ami: User;
	index: number;
}

const FriendChatListItem = ({ ami, index }: Props) => {
	const [isBlocked, setIsBlocked] = useState(false);
	const { activeTab } = useTabContext();
	const isActive = index === activeTab;
	const { msgSender } = useNotificationContext();

	const changeFriendshipStatus = async () => {
		const isConfirmed = window.confirm(
			"Êtes-vous sûr de vouloir bloquer cet utilisateur?"
		);

		if (isConfirmed) {
			await axios.patch("api/friends/" + ami.username, { status: "blocked" });
			setIsBlocked(true);
		}
	};

	const navigateToProfile = () => {
		window.location.href = "/profil/" + ami.username;
	};

	return (
		<>
			{!isBlocked && (
				<div
					className={`flex flex-row items-center gap-10 p-4 hover:bg-[#f67539] rounded-l-xl rounded-r-none w-full hover:cursor-pointer
          ${isActive ? "bg-neutral-800" : "bg-transparent"}`}
				>
					<div className="flex flex-row w-full gap-4">
						<img
							src={ami.avatar}
							alt="user'avatar profile"
							className="w-12 h-12 rounded-full object-cover"
						/>
						<div className=" text-left">
							<div className={`text-xl ${msgSender === ami.username ? "text-red-500" : ""}`}>{ami.username}</div>
							<div className="text-sm text-gray-400">{ami.connected}</div>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<IconButton
							icon={<NoSymbolIcon />}
							onClick={() => changeFriendshipStatus()}
							classCustom="w-5 h-5 text-neutral-400 hover:text-white"
							tooltip="Bloquer cet utilisateur"
							tooltipId="tooltip-block-user"
							type="button"
						/>
						<IconButton
							icon={<UserIcon />}
							onClick={() => navigateToProfile()}
							classCustom="w-5 h-5 text-neutral-400 hover:text-white"
							tooltip="Voir le profil"
							tooltipId="tooltip-profil-user"
							type="button"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default FriendChatListItem;
