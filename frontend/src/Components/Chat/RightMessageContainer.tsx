import './Chat.css';

interface User {
	id?: number;
	username: string;
	status: string;
	avatar: string;
}

interface ChatMessage {
	sender: string;
	text: string;
}

interface Props {
	ami: User;
	message: ChatMessage;
}

const RightMessageContainer = ({ ami, message }: Props) => {
	return (
		<div>

			{/* Message Right Container */}
			<div className="message-right message-container">
				<div className="span-left"></div>
				<div className="span-content">
						<img
							className="message-container__avatar"
							src={ami.avatar}
							alt="user'avatar profile"
						/>
						{/* <div className="text-xl">{ami.username}</div> */}
						<div>
							<p>{message.text}</p>
						</div>
					</div>
				</div>
			<div className="span-right"></div>

		</div>
	);
};

export default RightMessageContainer;