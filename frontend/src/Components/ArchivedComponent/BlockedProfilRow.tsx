import { CheckIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { User } from "../../models/User";
import IconButton from "../IconButton";


interface Props {
	ami: User;
	handleBlockedListChange: () => void;
}

const FriendProfilRow = ({ ami, handleBlockedListChange }: Props) => {

	const removeFriend = async () => {
		try {
			await axios.delete('api/friends/' + ami.username)
		} catch (error) {
				console.log("Erreur lors de la suppression de l'ami")
		}
	}

	const changeFriendshipStatus = async () => {
		await axios.patch("api/friends/" + ami.username, { status: "valider" });
		handleBlockedListChange();
		// window.location.reload();
	};

	return (
		<>
			<div className="flex justify-between items-center pr-4 hover:bg-[#f67539] rounded-md">
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
					<div className="text-xl flex justify-end items-center"></div>
				</a>
				<div className="grid grid-flow-col grid-cols-3 gap-2">
					<IconButton
						icon={<CheckIcon />}
						classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
						onClick={() => changeFriendshipStatus()}
						tooltip="Débloquer"
						tooltipId="unblockFriend"
					/>
					<IconButton
						icon={<UserMinusIcon />}
						classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
						onClick={() => removeFriend()}
						tooltip="Supprimer"
						tooltipId="removeFriend"
					/>
				</div>
			</div>
		</>
	);
};

export default FriendProfilRow;
