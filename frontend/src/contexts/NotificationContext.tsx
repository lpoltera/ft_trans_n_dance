import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Socket, io } from "socket.io-client";
import { useUserContext } from "./UserContext";
import { ChatMessage, Notifs } from "../models/Notifications";
import { toast } from "react-toastify";
import axios from "axios";

interface NotificationContextProps {
  socket: Socket | null;
  notifsList: Notifs[] | null;
  unreadNotif: boolean;
  notifModal: boolean;
  unreadChat: boolean;
  socketLoading: boolean;
  setUnreadNotif: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifsList: React.Dispatch<React.SetStateAction<Notifs[] | null>>;
  setNotifModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUnreadChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifsList, setNotifsList] = useState<Notifs[] | null>(null);
  const [unreadNotif, setUnreadNotif] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [unreadChat, setUnreadChat] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserContext();
  const [socketLoading, setSocketLoading] = useState(true);
  const [length, setLength] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSocketLoading(true);
    const newSocket = io("https://localhost:8000");
    setSocket(newSocket);
    setSocketLoading(false);
    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("myNotifs", (message: Notifs) => {
      if (message.receiver === user?.username) {
        setUnreadNotif(true);
        toast.info(`Nouvelle notification:\n ${message.message}`);
      }
    });

    socket.on("recMessage", (message: ChatMessage) => {
      if (message.receiver === user?.username) {
        setUnreadChat(true);
        toast(`Nouveau message de ${message.sender}:\n ${message.text}`);
      }
    });

    socket.on("recGameNotifs", (response: any) => {
      if (response[1].receiver === user?.username) {
        setUnreadNotif(true);
        toast(`${response[1].sender} t'invite à une partie`);
      }
    });
    socket.on("gameInvitationResponse", (response: any) => {
      console.log("gameinvit : ", response);
      if (response.receiver === user?.username) {
        setUnreadNotif(false);
        setLength(true);
      }
    });

    return () => {
      socket.off("myNotifs");
      socket.off("recMessage");
      socket.off("recGameNotifs");
      socket.off("gameInvitationResponse");
    };
  }, [socket, user]);

  useEffect(() => {
    if (!user || !socket) return;
    const fetchUnreadNotifs = async () => {
      try {
        const response = await axios.get("/api/notifications/my");
        setNotifsList(response.data);
      } catch (error) {
        toast.error("Failed to fetch unread notifications:\n" + error);
      }
    };
    fetchUnreadNotifs();
  }, [user, socket, unreadNotif, length]);

  return (
    <NotificationContext.Provider
      value={{
        socketLoading,
        socket,
        notifsList,
        unreadNotif,
        notifModal,
        unreadChat,
        setUnreadNotif,
        setNotifModal,
        setNotifsList,
        setUnreadChat,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
