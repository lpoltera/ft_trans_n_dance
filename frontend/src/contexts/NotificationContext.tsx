// NotificationContext.tsx
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Notification } from "../types/applicationTypes";
import { WebSocketContext } from "./WebSocketContext";

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => {}, // fonction vide par défaut
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const { socket } = useContext(WebSocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  useEffect(() => {
    if (socket) {
      socket.on("notification", addNotification);

      // Cleanup listener on unmount
      return () => {
        socket.off("notification", addNotification);
      };
    }
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
