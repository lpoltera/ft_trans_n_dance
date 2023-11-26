/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

interface Props {
  sender: string;
  receiver: string;
  message: string;
  status: string;
  game: gameProps;
}

interface gameProps {
  id: number;
}

const NotificationCard = ({
  sender,
  receiver,
  message,
  status,
  game,
}: Props) => {
  async function HandleNotifFriend(message: string) {
    await axios.patch("api/friends/" + sender, { status: message });
  }

  async function HandleNotifGame(message: string) {
    await axios.patch("api/game/update/" + game.id, { status: message });
  }
  console.log(`game ID = ${game}`);
  console.log(`sender = ${sender}`);

  return (
    <div className="p-2 border border-white w-full rounded-lg bg-cyan-950">
      <div className="mb-1">{message}</div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-sm opacity-50">24.11.23 15:00</div>
        <div className="flex gap-2">
          <button
            className="w-4 h-4"
            onClick={
              game
                ? () => HandleNotifGame("valider")
                : () => HandleNotifFriend("valider")
            }
          >
            <CheckIcon />
          </button>
          <button
            className="w-4 h-4"
            onClick={
              game
                ? () => HandleNotifGame("refuser")
                : () => HandleNotifFriend("refuser")
            }
          >
            <XMarkIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
