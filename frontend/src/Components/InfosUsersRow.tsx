import {
  InformationCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface User {
  username: string;
  avatar: string;
  connected: string;
  win: number;
  loss: number;
  draw: number;
  totalXP: number;
  totalGame: number;
}

interface Props {
  ami: User;
  handleStatsButtonClick: (ami: User) => void;
  currentUser: User;
  displayToast: () => void;
}

const InfosUsersRow = ({
  ami,
  handleStatsButtonClick,
  currentUser,
  displayToast,
}: Props) => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      //     // if (newSocket) newSocket.disconnect();
    };
  }, []);

  //   const addFriend = () => {
  //     // await axios
  //     //   .post("/api/friends/add/" + ami.username)
  //     //   .then(() => {
  //     displayToast();
  //     changeFriendshipStatus();
  //     //   })
  //     //   .catch((err) => {
  //     //     if (err.response && err.response.data && err.response.data.message) {
  //     //       const errorMessage = err.response.data.message;
  //     //       return alert("Error: " + errorMessage);
  //     //     } else {
  //     //       return alert("Error: " + err.message);
  //     //     }
  //     //   });
  //   };

  const changeFriendshipStatus = async () => {
    console.log("send notif");
    if (socket) {
      socket.emit("sendFriendNotif", {
        sender: currentUser.username,
        receiver: ami.username,
        message: `Tu as reçu une demande d'ami de ${currentUser.username}`,
      });
    }
    displayToast();
    // addFriend();
  };

  return (
    <>
      <div className="flex justify-between items-center pr-4 hover:bg-neutral-800 rounded-md">
        <a href={"/profil/" + ami.username} className="py-4 px-4">
          <div className="flex justify-center gap-4">
            <img
              src={ami.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col justify-start">
              <div className="text-xl">{ami.username}</div>
              <div className="text-sm text-gray-400">{ami.connected}</div>
            </div>
          </div>
          <div className="text-xl flex justify-end items-center"></div>
        </a>
        <div className="grid grid-flow-col grid-cols-3 gap-2">
          <button
            type="button"
            className="w-6 h-6 opacity-100 hover:opacity-100"
            onClick={() => changeFriendshipStatus()}
          >
            <UserPlusIcon />
          </button>
          <button
            type="button"
            className="w-6 h-6 opacity-100 hover:opacity-100"
            onClick={() => handleStatsButtonClick(ami)}
          >
            <InformationCircleIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default InfosUsersRow;
