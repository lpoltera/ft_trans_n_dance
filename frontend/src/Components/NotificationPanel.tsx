import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationCard from "./NotificationCard";
import { useNotificationContext } from "../contexts/NotificationContext";

interface NotificationProps {
  sender: string;
  receiver: string;
  message: string;
  status: string;
  game: gameProps;
}

interface gameProps {
  id: number;
}

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<
    NotificationProps[] | null
  >(null);
  const { notifModal, setNotifModal } = useNotificationContext();

  useEffect(() => {
    async function getNotifs() {
      try {
        const response = await axios.get("api/notifications/my");

        if (response.data.length === 0) {
          setNotifications(null);
        } else {
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

  return (
    <div
      onClick={() => setNotifModal(false)}
      className="fixed text-white p-4 top-16 right-0 bottom-0 left-0 flex flex-row"
    >
      <div className="w-96 grid-row-auto ml-auto">
        {notifications ? (
          notifications?.map((notification, index) => (
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
            <div className="py-2 px-4 border border-white w-full rounded-lg bg-cyan-950">
              <div className="mb-1">Aucune notification</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
