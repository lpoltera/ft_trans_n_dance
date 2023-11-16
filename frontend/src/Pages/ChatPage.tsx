import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import Chat from "../Components/Chat";
import { useEffect, useState } from "react";
import axios from "axios";
import FriendChatRow from "../Components/FriendChatRow";

interface User {
  id?: number;
  username: string;
  avatar: string;
  status: string;
}

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friends, setAllFriends] = useState<User[] | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

  const handleChatButtonClick = (ami: User) => {
    setSelectedFriend((prevFriend) => (prevFriend === ami ? null : ami));
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
        <div className="h-full overflow-auto">
          <h2 className="text-xl mb-4">Amis</h2>
          <div className="grid grid-flow-row gap-2">
            {friends?.map(
              (ami, index) =>
                currentUser?.username !== ami.username && (
                  <FriendChatRow
                    key={index}
                    ami={ami}
                    handleChatButtonClick={handleChatButtonClick}
                  />
                )
            )}
          </div>
        </div>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          {selectedFriend && (
            <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
              {/* Affichez le composant Chat pour l'ami sélectionné */}
              <Chat ami={selectedFriend}></Chat>
            </div>
          )}
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ChatPage;
