import {
	BellAlertIcon,
	ChatBubbleBottomCenterIcon,
	TrophyIcon,
	UserCircleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useNotificationContext } from "../contexts/NotificationContext";
import IconButton from "./IconButton";
import MenuDropdown from "./MenuDropdown";
import NotificationPanel from "./NotificationPanel";
import { useNavigate, useParams } from "react-router-dom";
import ButtonIcon from "./ArchivedComponent/ButtonIcon";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
	const {
		unreadNotif,
		notifModal,
		notifsList,
		setUnreadNotif,
		setNotifModal,
		unreadChat,
		setUnreadChat,
	} = useNotificationContext();
	const navigate = useNavigate();
	const [numberOfNotifs, setNumberOfNotifs] = useState(0);

	const url = window.location.href;
	const urlSegments = url.split("/");
	let idURL: string | any = urlSegments[urlSegments.length - 1];

	useEffect(() => {
		if (notifsList)
			setNumberOfNotifs(notifsList.length);
	}, [notifsList]);

	const profilLinks = [
		{ title: "Profil", href: "/profil" },
		{ title: "Déconnexion", href: "/logout" },
	];

	const checkIfGame = () => {
		return /\/game\/\d+/.test(location.pathname);
	};

	const checkIfTournament = () => {
		return /\/tournaments\/\d+/.test(location.pathname);
	};

	const checkNavigate = async () => {
		if (checkIfGame() || checkIfTournament()) {
			const isConfirm = window.confirm(
				"Êtes-vous sûr de vouloir quitter le jeu ou le tournoi ? Cette action supprimera le jeu ou le tournoi en cours"
			);
			if (isConfirm) {
				if (localStorage.getItem("canAccessGame"))
					localStorage.removeItem("canAccessGame");
				if (localStorage.getItem("canAccessTournament"))
					localStorage.removeItem("canAccessTournament");
				await axios.delete('https://localhost:8000/api/game/' + idURL);
				return true;
			} else
				return false;
		}
		return true;
	}

	const navigateToProfil = async () => {
		if (await checkNavigate()) {
			navigate("/profil");
		} else {
			return;
		}
	};


	const navigateToAccueil = async () => {
		if (await checkNavigate()) {
			navigate("/accueil");
		} else {
			return;
		}
	};

	const navigateToChat = async () => {
		if (await checkNavigate()) {
			navigate("/chat");
			setUnreadChat(false);
		} else {
			return;
		}
	};

	const navigateToTournaments = async () => {
		if (await checkNavigate()) {
			navigate("/tournaments");
		} else {
			return;
		}
	};

	const navigateToUsers = async () => {
		if (await checkNavigate()) {
			navigate("/users");
		} else {
			return;
		}
	};

	const showNotificationPanel = () => {
		setUnreadNotif(false);
		setNotifModal(!notifModal);
	};

	return (
		<>
			<div
				className={`fixed top-0 right-0 left-0 flex items-center justify-between pl-6 pr-4 h-16 z-40 ${idURL === "accueil" ? "" : "bg-cyan-900"
					}`}
			>
				<button
					onClick={navigateToAccueil}
					id="logoLink"
					className="text-white text-lg hover:text-[#f67539]"
				>
					PONG<sup>42</sup>
				</button>
				<nav className="flex text-white">
					<div className="relative">
						<IconButton
							onClick={showNotificationPanel}
							icon={<BellAlertIcon />}
							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
						/>
						<span
							className={`px-1 rounded-full absolute top-1 right-1 z-10 text-xs ${unreadNotif ? "bg-red-600" : "bg-cyan-950"
								}`}
						>
							{numberOfNotifs}
						</span>
					</div>
					<div className="relative">
						<IconButton
							onClick={navigateToChat}
							icon={<ChatBubbleBottomCenterIcon />}
							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
						/>
						{unreadChat && (
							<span className="bg-red-600 w-2 h-2 rounded-full absolute top-2 right-2 z-10"></span>
						)}
					</div>
					<div className="relative">
						<ButtonIcon onClick={navigateToTournaments}>
							<TrophyIcon />
						</ButtonIcon>
					</div>
					<IconButton
						onClick={navigateToUsers}
						icon={<UserGroupIcon />}
						classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
					/>
					<MenuDropdown links={profilLinks}>
						<IconButton
							onClick={navigateToProfil}
							icon={<UserCircleIcon />}
							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
						/>
					</MenuDropdown>
				</nav>
				<NotificationPanel></NotificationPanel>
			</div>
		</>
	);
};

export default Navbar;