import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useUserContext } from "../../contexts/UserContext";
import { User } from "../../models/User";
import LeftMessageContainer from "./LeftMessageContainer";
import RightMessageContainer from "./RightMessageContainer";
import { ChatMessage } from "../../models/Notifications";

interface Props {
  ami: User;
}

const Chat = ({ ami }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { socket, socketLoading } = useNotificationContext();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user, loading } = useUserContext();
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (loading) return;
    if (socketLoading) return;
    console.log("socket :", socket);

    async function fetchMessages() {
      const name = user?.username;
      if (name) {
        try {
          const response = await axios.get(
            "/api/chat/all/" + name + "/" + ami.username
          );
          console.log("response.data :", response.data);
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    }
    fetchMessages();

    return () => {
      if (socket) socket.off("recMessage");
    };
  }, [loading]);

  useEffect(() => {
    if (socket && user?.username && ami.username) {
      if (!socket.hasListeners("recMessage")) {
        socket.on("recMessage", (message) => {
          if (message.sender !== user.username) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        });
      }
    }

    return () => {
      if (socket) {
        socket.off("recMessage");
      }
    };
  }, [socket, user?.username, ami.username]);

  // Update messages state when a message is sent
  const sendMessage = (e: FormEvent, messageContent: string) => {
    e.preventDefault();
    if (user?.username) {
      const message = {
        sender: user.username,
        receiver: ami.username,
        text: messageContent,
      };

      socket?.emit("sendMessage", message);

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    }
  };

  return (
    <>
      <div className="flex h-full w-full grow overflow-auto">
        <ul className="pt-6 space-y-1 w-full flex flex-col">
          {messages.map((message, index) => (
            <li key={index}>
              {message.sender === user?.username ? (
                <RightMessageContainer user={ami} message={message} />
              ) : (
                <LeftMessageContainer user={ami} message={message} />
              )}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="shrink w-full">
        <form onSubmit={(e) => sendMessage(e, newMessage)}>
          <input
            type="text"
            className="border-white rounded-md px-3 py-2 bg-transparent w-full focus:border-cyan-500 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ecrivez un message..."
          />
          <input type="submit" className="hidden" />
        </form>
      </div>
    </>
  );
};

export default Chat;
