import {
	BellAlertIcon,
	ChatBubbleBottomCenterIcon,
	TrophyIcon,
	UserCircleIcon,
	UserGroupIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useNotificationContext } from "../contexts/NotificationContext";
import IconButton from "./IconButton";
import MenuDropdown from "./MenuDropdown";
import NotificationPanel from "./NotificationPanel";
import { useNavigate } from "react-router-dom";
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

	const navigateToProfil = () => {
		if (checkIfGame() || checkIfTournament()) {
			const isConfirm = window.confirm(
				"Êtes-vous sûr de vouloir quitter le jeu ou le tournoi ? Cette action supprimera le jeu ou le tournoi en cours"
				// remove rights access to the game or tournament
			);
			if (isConfirm) {
				if (localStorage.getItem("canAccessGame"))
					localStorage.removeItem("canAccessGame");
				if (localStorage.getItem("canAccessTournament"))
					localStorage.removeItem("canAccessTournament");
				navigate("/profil");
			} else {
				return;
			}
		} else {
			navigate("/profil");
		}
	};
	const navigateToAccueil = () => {
		if (checkIfGame() || checkIfTournament()) {
			const isConfirm = window.confirm(
				"Êtes-vous sûr de vouloir quitter le jeu ou le tournoi ? Cette action supprimera le jeu ou le tournoi en cours"
				// remove rights access to the game or tournament
			);
			if (isConfirm) {
				if (localStorage.getItem("canAccessGame"))
					localStorage.removeItem("canAccessGame");
				if (localStorage.getItem("canAccessTournament"))
					localStorage.removeItem("canAccessTournament");
				navigate("/accueil");
			} else {
				return;
			}
		} else {
			navigate("/accueil");
		}
	};

	const navigateToChat = () => {
		if (checkIfGame() || checkIfTournament()) {
			const isConfirm = window.confirm(
				"Êtes-vous sûr de vouloir quitter le jeu ou le tournoi ? Cette action supprimera le jeu ou le tournoi en cours"
				// remove rights access to the game or tournament
			);
			if (isConfirm) {
				if (localStorage.getItem("canAccessGame"))
					localStorage.removeItem("canAccessGame");
				if (localStorage.getItem("canAccessTournament"))
					localStorage.removeItem("canAccessTournament");
				navigate("/chat");
				setUnreadChat(false);
			} else {
				return;
			}
		} else {
			navigate("/chat");
			setUnreadChat(false);
		}
	};

	const navigateToTournaments = () => {
		if (checkIfGame() || checkIfTournament()) {
			const isConfirm = window.confirm(
				"Êtes-vous sûr de vouloir quitter le jeu ou le tournoi ? Cette action supprimera le jeu ou le tournoi en cours"
				// remove rights access to the game or tournament
			);
			if (isConfirm) {
				if (localStorage.getItem("canAccessGame"))
					localStorage.removeItem("canAccessGame");
				if (localStorage.getItem("canAccessTournament"))
					localStorage.removeItem("canAccessTournament");
				navigate("/tournaments");
			} else {
				return;
			}
		} else {
			navigate("/tournaments");
		}
	};
	const navigateToUsers = () => {
		if (checkIfGame() || checkIfTournament()) {
			const isConfirm = window.confirm(
				"Êtes-vous sûr de vouloir quitter le jeu ou le tournoi ? Cette action supprimera le jeu ou le tournoi en cours"
				// remove rights access to the game or tournament
			);
			if (isConfirm) {
				// remove tournanment delete api/tounament/name
				if (localStorage.getItem("canAccessGame"))
					localStorage.removeItem("canAccessGame");
				if (localStorage.getItem("canAccessTournament"))
					localStorage.removeItem("canAccessTournament");
				navigate("/users");
			} else {
				return;
			}
		} else {
			navigate("/users");
		}
	};

	const showNotificationPanel = async () => {
		setUnreadNotif(false);
		setNotifModal(!notifModal);
		// const response = await axios.get('api/notifications');
		// setNumberOfNotifs(response.data.length);
		// console.log("number of notifications = ", response.data.length);
	};

	const url = window.location.href;
	const urlSegments = url.split("/");
	let idURL: string | any = urlSegments[urlSegments.length - 1];

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

// import {
// 	BellAlertIcon,
// 	ChatBubbleBottomCenterIcon,
// 	TrophyIcon,
// 	UserCircleIcon,
// 	UserGroupIcon,
// } from "@heroicons/react/24/outline";
// import { useNotificationContext } from "../contexts/NotificationContext";
// import { useUserContext } from "../contexts/UserContext";
// import IconButton from "./IconButton";
// import MenuDropdown from "./MenuDropdown";
// import NotificationPanel from "./NotificationPanel";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ButtonIcon from "./ArchivedComponent/ButtonIcon";

// const Navbar = () => {
// 	const { user, loadingUser } = useUserContext();
// 	const {
// 		unreadNotif,
// 		notifModal,
// 		setUnreadNotif,
// 		setNotifModal,
// 		unreadChat,
// 		setUnreadChat,
// 	} = useNotificationContext();
// 	const navigate = useNavigate();
// 	const [shouldNavigate, setShouldNavigate] = useState(false);

// 	useEffect(() => {
// 		if (!loadingUser) return;
// 	}, [user]);

// 	const profilLinks = [
// 		{ title: "Profil", href: "/profil/" + user?.username },
// 		{ title: "Déconnexion", href: "/logout" },
// 	];

// 	const navigateToProfil = () => {
// 		if (user) {
// 			navigate(`/profil/${user.username}`);
// 		} else {
// 			setShouldNavigate(true);
// 		}
// 	};

// 	useEffect(() => {
// 		if (user && shouldNavigate) {
// 			navigate(`/profil/${user.username}`);
// 			setShouldNavigate(false); // Reset for future navigations
// 		}
// 	}, [user, shouldNavigate, navigate]);

// 	const navigateToChat = () => {
// 		navigate("/chat");
// 		setUnreadChat(false);
// 	};

// 	const navigateToTournaments = () => {
// 		window.location.href = "/tournaments";
// 		setUnreadChat(false);
// 	};

// 	const navigateToUsers = () => {
// 		navigate("/users");
// 	};

// 	const showNotificationPanel = () => {
// 		setUnreadNotif(false);
// 		setNotifModal(!notifModal);
// 	};
// 	return (
// 		<>
// 			<div className="fixed top-0 right-0 left-0 flex items-center justify-between pl-6 pr-4 h-16 z-40 bg-cyan-900">
// 				<a href="/accueil" id="logoLink" className="text-white text-lg">
// 					PONG<sup>42</sup>
// 				</a>
// 				<nav className="flex text-white">
// 					<div className="relative">
// 						<IconButton
// 							onClick={showNotificationPanel}
// 							icon={<BellAlertIcon />}
// 							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
// 						/>
// 						{unreadNotif && (
// 							<span className="bg-red-600 w-2 h-2 rounded-full absolute top-2 right-2 z-10"></span>
// 						)}
// 					</div>
// 					<div className="relative">
// 						<IconButton
// 							onClick={navigateToChat}
// 							icon={<ChatBubbleBottomCenterIcon />}
// 							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
// 						/>
// 						{unreadChat && (
// 							<span className="bg-red-600 w-2 h-2 rounded-full absolute top-2 right-2 z-10"></span>
// 						)}
// 					</div>
// 					<div className="relative">
// 						<ButtonIcon onClick={navigateToTournaments}>
// 							<TrophyIcon />
// 						</ButtonIcon>
// 					</div>
// 					<IconButton
// 						onClick={navigateToUsers}
// 						icon={<UserGroupIcon />}
// 						classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
// 					/>
// 					<MenuDropdown links={profilLinks}>
// 						<IconButton
// 							onClick={navigateToProfil}
// 							icon={<UserCircleIcon />}
// 							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-[#f67539]"
// 						/>
// 					</MenuDropdown>
// 				</nav>
// 				<NotificationPanel></NotificationPanel>
// 			</div>
// 		</>
// 	);
// };

// export default Navbar;
