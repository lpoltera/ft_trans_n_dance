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
import { useState } from "react";
import Modal from "./Modal";


const Navbar = () => {
  const profilLinks = [
    { title: "Profil", href: "/profil"},
    { title: "Déconnexion", href: "/logout" },
  ];

  const [unreadNotif, setUnreadNotif] = useState(true);
  const [notifModal, setNotifModal] = useState(false);

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
      <div className="fixed top-0 right-0 left-0 flex items-center justify-between pl-6 pr-4 h-16">
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
      </div>
    </>
  );
};

export default Navbar;
