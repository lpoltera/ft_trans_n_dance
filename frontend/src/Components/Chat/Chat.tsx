import axios from "axios";
import { useEffect, useState, useRef} from "react";
import io from "socket.io-client";
import RightMessageContainer from './RightMessageContainer'
import LeftMessageContainer from './LeftMessageContainer'
import './Chat.css';

interface ChatMessage {
	sender: string;
	text: string;
}

interface User {
	id?: number;
	username: string;
	connected: string;
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
	const messagesEndRef = useRef<any>(null);
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	  };
	  useEffect(scrollToBottom, [messages]);

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

	const handleSendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key == 'Enter') {
			if (socket) {
				socket.emit("sendMessage", {
					sender: currentUser,
					receiver: ami.username,
					text: newMessage,
				});
				setNewMessage("");
			}
		}
	}

	return (
		<div>
			<div className="messages-container">
				<ul>
					{messages.map((message, index) => (
						<li key={index}>
							{message.sender === currentUser ? (
								<RightMessageContainer ami={ami} message={message} />
								) : (
								<LeftMessageContainer ami={ami} message={message} />
								)}
						{/* <strong>{message.sender}:</strong> {message.text} */}
					</li>
					))}
				</ul>
				<div ref={messagesEndRef} />
				<div className="sending-form">
					<input
						type="text"
						className="border-white px-3 py-2 bg-transparent"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={handleSendMessage}
						placeholder="Ecrivez un message..."
					/>
				</div>
			</div>
		</div>
	);
};

export default Chat;

