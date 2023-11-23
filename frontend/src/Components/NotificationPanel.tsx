import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationCard from "./NotificationCard";

interface NotificationPanelProps {
  visibility: boolean;
}

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

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  visibility,
}) => {
  const [notifications, setNotifications] = useState<
    NotificationProps[] | null
  >(null);

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

    if (visibility) {
      getNotifs();
    }
  }, [visibility]);

  if (!visibility) {
    return null;
  }

  return (
    <div className="w-96 text-white p-4 fixed top-16 right-0 bottom-0 grid-rows-auto">
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
          <div className="p-2 border border-white w-full rounded-lg bg-cyan-950">
            <div className="mb-1">Aucune notification</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
