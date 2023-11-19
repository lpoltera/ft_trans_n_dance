import {
	NoSymbolIcon,
	UserIcon,
  } from "@heroicons/react/24/outline";
import './Chat.css';



  interface User {
	id?: number;
	username: string;
	status: string;
	avatar: string;
  }

  interface Props {
	ami: User;
	handleChatButtonClick: (ami: User) => void;
  }

  const FriendChatListItem = ({ ami, handleChatButtonClick }: Props) => {

	return (
	  <>
		<button className="user-list__item hover:bg-neutral-800 rounded-md" onClick={() => handleChatButtonClick(ami)}>
			<div className="user-list__item__avatar">
			  <img
				src={ami.avatar}
				alt="user'avatar profile"
				className="w-12 h-12 rounded-full object-cover"
			  />
			  <div className="user-list__item__infos">
				<div className="text-xl">{ami.username}</div>
				<div className="text-sm text-gray-400">{ami.status}</div>
				<button
					type="button"
					className="w-6 h-6 opacity-50 hover:opacity-100">
					<NoSymbolIcon />
				</button>
				<button
					type="button"
					className="w-6 h-6 opacity-50 hover:opacity-100">
					<UserIcon />
				</button>
			  </div>
			</div>
		</button>
	  </>
	);
  };

  export default FriendChatListItem;