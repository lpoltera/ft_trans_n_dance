import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface ChatMessage {
  sender: string;
  text: string;
}

interface User {
  id?: number;
  username: string;
  status: string;
  avatar: string;
}

interface Props {
  ami: User;
}

const Chat = ({ ami }: Props) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Création de la connexion Socket.IO lors du montage du composant
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    async function fetchCurrent() {
      try {
        const response = await axios.get<string>("/api/my-name");
        console.log(`response ligne 36 Chat.tsx = ${response.data}`);
        setCurrentUser(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching my name", error);
      }
    }

    async function fetchMessages() {
      const name = await fetchCurrent();
      if (name) {
        try {
          console.log(`my name = ${name}`);
          console.log(`ami name = ${ami.username}`);
          const response = await axios.get(
            "/api/chat/all/" + name + "/" + ami.username
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    }
    fetchMessages();

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [ami]); // Dépendance vide pour s'assurer que cela n'est exécuté qu'une fois lors du montage

  useEffect(() => {
    if (!socket) {
      console.log("socket :", socket);
      return;
    }

    // Logique pour gérer les événements de la connexion Socket.IO
    socket.on("recMessage", (message: ChatMessage) => {
      // Gérer le message reçu depuis le serveur Socket.IO
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Nettoyage des événements lors du démontage du composant
    return () => {
      socket.off("recMessage");
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket) {
      socket.emit("sendMessage", {
        sender: currentUser,
        receiver: ami.username,
        text: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.sender}:</strong> {message.text}
          </li>
        ))}
      </ul>
      <div>
        {/* <input
          type="text"
          className="border border-white px-3 py-2 bg-transparent text-black rounded-md"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Your name"
        /> */}
        <input
          type="text"
          className="border border-white px-3 py-2 bg-transparent text-black rounded-md"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

