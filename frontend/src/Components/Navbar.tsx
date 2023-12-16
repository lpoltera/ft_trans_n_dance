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
import { useNavigate } from "react-router-dom";
import ButtonIcon from "./ArchivedComponent/ButtonIcon";

const Navbar = () => {
	const {
		unreadNotif,
		notifModal,
		setUnreadNotif,
		setNotifModal,
		unreadChat,
		setUnreadChat,
	} = useNotificationContext();
	const navigate = useNavigate();

	const profilLinks = [
		{ title: "Profil", href: "/profil/" },
		{ title: "Déconnexion", href: "/logout" },
	];

	const navigateToProfil = () => {
		navigate(`/profil/`);
	};

	const navigateToChat = () => {
		navigate("/chat");
		setUnreadChat(false);
	};

	const navigateToTournaments = () => {
		window.location.href = "/tournaments";
		setUnreadChat(false);
	};

	const navigateToUsers = () => {
		navigate("/users");
	};

	const showNotificationPanel = () => {
		setUnreadNotif(false);
		setNotifModal(!notifModal);
	};

	return (
		<>
			<div className="fixed top-0 right-0 left-0 flex items-center justify-between pl-6 pr-4 h-16 z-40 bg-cyan-900">
				<a href="/accueil" id="logoLink" className="text-white text-lg">
					PONG<sup>42</sup>
				</a>
				<nav className="flex text-white">
					<div className="relative">
						<IconButton
							onClick={showNotificationPanel}
							icon={<BellAlertIcon />}
							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
						/>
						{unreadNotif && (
							<span className="bg-red-600 w-2 h-2 rounded-full absolute top-2 right-2 z-10"></span>
						)}
					</div>
					<div className="relative">
						<IconButton
							onClick={navigateToChat}
							icon={<ChatBubbleBottomCenterIcon />}
							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
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
						classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
					/>
					<MenuDropdown links={profilLinks}>
						<IconButton
							onClick={navigateToProfil}
							icon={<UserCircleIcon />}
							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
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
// 							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
// 						/>
// 						{unreadNotif && (
// 							<span className="bg-red-600 w-2 h-2 rounded-full absolute top-2 right-2 z-10"></span>
// 						)}
// 					</div>
// 					<div className="relative">
// 						<IconButton
// 							onClick={navigateToChat}
// 							icon={<ChatBubbleBottomCenterIcon />}
// 							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
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
// 						classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
// 					/>
// 					<MenuDropdown links={profilLinks}>
// 						<IconButton
// 							onClick={navigateToProfil}
// 							icon={<UserCircleIcon />}
// 							classCustom="w-10 h-10 p-2 rounded-lg hover:bg-neutral-800"
// 						/>
// 					</MenuDropdown>
// 				</nav>
// 				<NotificationPanel></NotificationPanel>
// 			</div>
// 		</>
// 	);
// };

// export default Navbar;
