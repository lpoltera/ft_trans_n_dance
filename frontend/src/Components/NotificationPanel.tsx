import axios from "axios";
import { useEffect, useState } from "react";
import { useNotificationContext } from "../contexts/NotificationContext";
import NotificationCard from "./NotificationCard";
import { Notifs } from "../models/Notifications";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notifs[] | null>(null);
  const { notifModal, setNotifModal } = useNotificationContext();

  useEffect(() => {
    async function getNotifs() {
      try {
        const response = await axios.get<Notifs[] | null>(
          "https://localhost:8000/api/notifications/my"
        );
        console.log("Response:", response);
        if (!response.data || response.data.length === 0) {
          console.log("No notifications");
          setNotifications(null);
        } else {
          console.log("Notifications:", response.data);
          console.log("Notifications length :", response.data.length);
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }

    if (notifModal) {
      getNotifs();
    }
  }, [notifModal]);

  if (!notifModal) {
    return null;
  }

  // if (!notifications) {
  // 	setUnreadNotif(false);
  // }

  return (
    <div
      onClick={() => setNotifModal(false)}
      className="fixed text-white p-4 top-16 right-0 bottom-0 left-0 flex flex-row"
    >
      <div className="w-96 grid-row-auto ml-auto">
        {notifications ? (
          notifications.map((notification, index) => (
            <div key={index} className="mb-2">
              <NotificationCard
                message={notification.message}
                sender={notification.sender}
                receiver={notification.receiver}
                status={notification.status}
                game={notification.game}
              />
            </div>
          ))
        ) : (
          <div className="mb-2">
            <div className="py-2 pl-4 pr-2 w-full rounded-lg bg-cyan-950 shadow-md">
              <div>Aucune notification</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
