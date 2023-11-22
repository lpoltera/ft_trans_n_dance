import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import Chat from "../Components/Chat/Chat";
import FriendChatListItem from "../Components/Chat/FriendChatListItem";
import FooterMain from "../Components/FooterMain";
import '../Components/Chat/Chat.css';

interface User {
	id?: number;
	username: string;
	avatar: string;
	connected: string;
}

const ChatPage = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [friends, setAllFriends] = useState<User[] | null>(null);
	const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
	const [buttonStates, setButtonStates] = useState<{ [key: string]: boolean }>({});


	const handleChatButtonClick = (ami: User) => {
		setSelectedFriend((prevFriend) => (prevFriend === ami ? null : ami));
		setButtonStates((prev) => ({
			...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
			[ami.username]: true,
		}));
	};

	useEffect(() => {
		async function fetchCurrent() {
			try {
				const response = await axios.get<string>("/api/my-name");
				console.log(`response ligne 29 ChatPage = ${response.data}`)
				return response.data;
			} catch (err) {
				console.error(err);
				return null;
			}
		}

		async function fetchUserAndFriend() {
			const name = await fetchCurrent();
			if (name) {
				try {
					const [userResponse, friendResponse] = await Promise.all([
						axios.get<User>("/api/" + name),
						axios.get<User[]>("/api/friends/all/" + name),
					]);
					setCurrentUser(userResponse.data);
					setAllFriends(friendResponse.data);
				} catch (err) {
					console.error(err);
				}
			}
		}
		fetchUserAndFriend();
	}, []);

	return (
		<>
			<Navbar />
			<PageLayout>
				<h2 className="text-xl mb-4">Amis</h2>
				<main>
					<div className="panel user-list w-tier">
						{friends?.map(
							(ami, index) =>
								currentUser?.username !== ami.username && (
									<FriendChatListItem
										key={index}
										ami={ami}
										handleChatButtonClick={handleChatButtonClick}
										buttonStates={buttonStates}
									/>
								)
						)}
					</div>

					<div className="panel chat-container">
						{selectedFriend && (
							<div>
								<Chat ami={selectedFriend}></Chat>
							</div>
						)}
					</div>
				</main>
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default ChatPage;
