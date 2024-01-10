import {
	NoSymbolIcon,
	UserMinusIcon,
	UserPlusIcon,
	CheckIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { User } from "../models/User";
import IconButton from "./IconButton";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";



interface Props {
	selectedUser: User;
	isMyProfile?: boolean;
	isFriend?: boolean;
	relationStatus: string | null;
	handleBlockedListChange: () => void;
}

const UserRow = ({ selectedUser, isMyProfile, isFriend, relationStatus, handleBlockedListChange }: Props) => {
	const { user } = useUserContext()
	const navigate = useNavigate();

	const removeFriend = async () => {
		try {
			await axios.delete('api/friends/' + selectedUser.username)
		} catch (error) {
			console.log("Erreur lors de la suppression de l'ami")
		}
	}


	const unBlockUser = async () => {
		await axios.patch("api/friends/" + selectedUser.username, { status: "valider" });
		handleBlockedListChange();
		// window.location.reload();
	};

	const blockUser = async () => {
		const isConfirmed = window.confirm(
			"Êtes-vous sûr de vouloir bloquer cet utilisateur?"
		);
		if (isConfirmed) {
			handleBlockedListChange();
			await axios.patch("api/friends/" + selectedUser.username, { status: "blocked" });
			// setIsBlocked(true);
		}
	};

	const navigateToProfil = async () => {
		if (user?.username !== selectedUser.username) {
			handleBlockedListChange();
			navigate("/profil/" + selectedUser.username);
			// window.location.href = "/profil/" + selectedUser.username;
		}
		else {
			handleBlockedListChange();
			navigate("/profil/");
			// window.location.href = "/profil/";
		}
	}

	return (
		<div className="cursor-default flex w-full rounded-lg justify-between items-center py-4 px-6 bg-cyan-950 hover:bg-[#f67539]">
			<div className="flex shrink gap-4 items-center">
				<img
					src={selectedUser.avatar}
					alt="Profile picture"
					className="w-12 h-12 rounded-full"
				/>
				<div className="flex flex-col gap-1 pt-1">
					<div className="text-xl">{selectedUser.username}</div>
					<div className="text-sm text-gray-400">{selectedUser.connected}</div>
				</div>
			</div>
			<div className="flex gap-0 items-center">
				{isMyProfile && (
					<>
						<IconButton
							icon={<UserMinusIcon />}
							classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
							onClick={removeFriend}
							tooltip="Supprimer de la liste d'amis"
							tooltipId="removeFriend"
						/>
					</>
				)}
				{isMyProfile && (
					<>
						{relationStatus !== "blocked" ? (
							<IconButton
								icon={<NoSymbolIcon />}
								onClick={blockUser}
								classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
								tooltip="Bloquer"
								tooltipId="blockUser"
							/>
						) : (
							<IconButton
								icon={<CheckIcon />}
								classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
								tooltip="Débloquer"
								onClick={unBlockUser}
								tooltipId="unblockUser" />
						)}
					</>
				)}
				<IconButton
					icon={<UserIcon />}
					classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
					onClick={navigateToProfil}
					tooltip="Voir le profil"
					tooltipId="navigateToProfil"
				/>
			</div>
		</div>
	);
};

export default UserRow;
