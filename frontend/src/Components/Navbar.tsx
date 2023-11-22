// Charger et écouter la Table "notifications"
// Si une nouvelle notif apparait, ajouter un pin rouge aux Notifications.
// reprendre l'id de l'utilisateur connecté pour créer un lien dynamique vers son profil dans le menu du boutton profil

import {
	BellAlertIcon,
	ChatBubbleBottomCenterIcon,
	UserCircleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import ButtonIcon from "./ButtonIcon";
import MenuDropdown from "./MenuDropdown";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { io } from "socket.io-client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface Notifs {
	sender: string;
	receiver: string;
	message: string;
	status: string;
}

const Navbar = () => {
	const [unreadNotif, setUnreadNotif] = useState(false);
	const [notifModal, setNotifModal] = useState(false);
	const [socket, setSocket] = useState<any>(null);
	const [currentUserName, setcurrentUserName] = useState<string>("");

	useEffect(() => {
		axios
			.get<string>("/api/my-name")
			.then((response) => setcurrentUserName(response.data));
		console.log(`Current User Name in Navbar.tsx = ${currentUserName}`);
		const newSocket = io("http://localhost:8000");
		setSocket(newSocket);
		return () => {
			//     // if (newSocket) newSocket.disconnect();
		};
	}, [currentUserName]);

	useEffect(() => {
		if (!socket) {
			console.log("socket :", socket);
			return;
		}
		socket.on("myNotifs", (message: Notifs) => {
			// setNewNotif("Veux-tu être mon ami");
			console.log("message sent : ", message.message);
			if (message.receiver === currentUserName) {
				setUnreadNotif(true);
				toast("Tu as reçu une nouvelle notification");
				console.log("unreadNotif true");
				// console.log("LOG : ", socket.request.session);
				// console.dir(socket.request.session);

				console.log("message in condition : ", message.message);
			}
		});

		return () => {
			socket.off("myNotifs");
		};
	}, [socket]);

	const profilLinks = [
		{ title: "Profil", href: "/profil" },
		{ title: "Déconnexion", href: "/logout" },
	];

	const navigateToProfil = () => {
		window.location.href = "/profil";
	};

	const navigateToChat = () => {
		window.location.href = "/chat";
	};

	const navigateToUsers = () => {
		window.location.href = "/users";
	};

	const showNotificationPanel = () => {
		setUnreadNotif(false);
		setNotifModal(!notifModal);
		console.log("showing notification panel");
	};

	return (
		<>
			<div className="fixed bg-cyan-900 top-0 right-0 left-0 flex items-center justify-between pl-6 pr-4 h-16">
				<a href="/accueil" id="logoLink" className="text-white text-lg">
					PONG<sup>42</sup>
				</a>
				<nav className="flex text-white">
					<div className="relative">
						<ButtonIcon onClick={showNotificationPanel}>
							<BellAlertIcon />
						</ButtonIcon>
						{unreadNotif && (
							<span className="bg-red-600 w-2 h-2 rounded-full absolute -bottom-1 right-1/2 translate-x-1/2 z-10"></span>
						)}
					</div>
					<ButtonIcon onClick={navigateToChat}>
						<ChatBubbleBottomCenterIcon />
					</ButtonIcon>
					<ButtonIcon onClick={navigateToUsers}>
						<UserGroupIcon />
					</ButtonIcon>
					<MenuDropdown links={profilLinks}>
						<ButtonIcon onClick={navigateToProfil}>
							<UserCircleIcon />
						</ButtonIcon>
					</MenuDropdown>
				</nav>
				<Modal visibility={notifModal}>Test</Modal>
				<button id="openModal">Open the modal</button>

				<dialog id="modal" className="modal">
					<button id="closeModal" className="modal-close-btn">Close</button>
					<p>...</p>
				</dialog>
			</div>
		</>
	);
};

export default Navbar;


