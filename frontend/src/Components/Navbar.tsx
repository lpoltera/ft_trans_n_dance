import {
  BellAlertIcon,
  ChatBubbleBottomCenterIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useUserContext } from "../contexts/UserContext";
import ButtonIcon from "./ButtonIcon";
import MenuDropdown from "./MenuDropdown";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  const { user } = useUserContext();
  const {
    unreadNotif,
    notifModal,
    setUnreadNotif,
    setNotifModal,
    unreadChat,
    setUnreadChat,
  } = useNotificationContext();

  const profilLinks = [
    { title: "Profil", href: "/profil/" + user?.username },
    { title: "Déconnexion", href: "/logout" },
  ];

  const navigateToProfil = () => {
    window.location.href = "/profil";
  };

  const navigateToChat = () => {
    window.location.href = "/chat";
    setUnreadChat(false);
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
          <div className="relative">
            <ButtonIcon onClick={navigateToChat}>
              <ChatBubbleBottomCenterIcon />
            </ButtonIcon>
            {unreadChat && (
              <span className="bg-red-600 w-2 h-2 rounded-full absolute -bottom-1 right-1/2 translate-x-1/2 z-10"></span>
            )}
          </div>
          <ButtonIcon onClick={navigateToUsers}>
            <UserGroupIcon />
          </ButtonIcon>
          <MenuDropdown links={profilLinks}>
            <ButtonIcon onClick={navigateToProfil}>
              <UserCircleIcon />
            </ButtonIcon>
          </MenuDropdown>
        </nav>
        <NotificationPanel></NotificationPanel>
      </div>
    </>
  );
};

export default Navbar;
