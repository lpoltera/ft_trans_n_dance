import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface ChatMessage {
  sender: string;
  text: string;
}

const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState("");

  useEffect(() => {
    // Création de la connexion Socket.IO lors du montage du composant
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/chat/all");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // Nettoyage de la connexion lors du démontage du composant
    return () => {
      newSocket.disconnect();
    };
  }, []); // Dépendance vide pour s'assurer que cela n'est exécuté qu'une fois lors du montage

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
      socket.emit("sendMessage", { sender, text: newMessage });
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
        <input
          type="text"
          className="border border-white px-3 py-2 bg-transparent text-black rounded-md"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Your name"
        />
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
