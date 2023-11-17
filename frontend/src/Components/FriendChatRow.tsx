import {
	ChatBubbleBottomCenterTextIcon,
	NoSymbolIcon,
	UserMinusIcon,
  } from "@heroicons/react/24/outline";

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

  const FriendProfilRow = ({ ami, handleChatButtonClick }: Props) => {

	return (
	  <>
		<div className="flex justify-between items-center pr-4 hover:bg-neutral-800 rounded-md cursor-pointer" onClick={() => handleChatButtonClick(ami)}>
		  <a href='#' className="py-4 px-4">
			<div className="flex justify-center gap-4">
			  <img
				src={ami.avatar}
				alt=""
				className="w-12 h-12 rounded-full object-cover"
			  />
			  <div className="flex flex-col justify-start">
				<div className="text-xl">{ami.username}</div>
				<div className="text-sm text-gray-400">{ami.status}</div>
			  </div>
			</div>
			<div className="text-xl flex justify-end items-center"></div>
		  </a>
		  <div className="grid grid-flow-col grid-cols-3 gap-2">
			<button
			  type="button"
			  className="w-6 h-6 opacity-50 hover:opacity-100"
			>
			  <NoSymbolIcon />
			</button>
			<button
			  type="button"
			  className="w-6 h-6 opacity-50 hover:opacity-100"
			  onClick={() => handleChatButtonClick(ami)}
			>
			  <ChatBubbleBottomCenterTextIcon />
			</button>
			<button
			  type="button"
			  className="w-6 h-6 opacity-50 hover:opacity-100"
			>
			  <UserMinusIcon />
			</button>
		  </div>
		</div>
	  </>
	);
  };

  export default FriendProfilRow;