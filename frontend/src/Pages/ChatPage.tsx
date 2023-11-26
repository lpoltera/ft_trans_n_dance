import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import Chat from "../Components/Chat/Chat";
import FriendChatListItem from "../Components/Chat/FriendChatListItem";
import FooterMain from "../Components/FooterMain";

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
  const [arrIsSelected, setArrIsSelected] = useState<{
    [key: string]: boolean;
  }>({});

  const handleChatButtonClick = (ami: User) => {
    setSelectedFriend((prevFriend) => (prevFriend === ami ? null : ami));
    setArrIsSelected((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
      [ami.username]: true,
    }));
  };

  useEffect(() => {
    async function fetchCurrent() {
      try {
        const response = await axios.get<string>("/api/my-name");
        console.log(`response ligne 29 ChatPage = ${response.data}`);
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
        <h1 className="text-xl mb-4">Conversations</h1>
        <div className="h-full flex flex-row bg-cyan-950">
          <div className="shrink p-10 w-48">
            <h2>Amis</h2>
            <div>
              {friends
                ? friends.map(
                    (ami, index) =>
                      currentUser?.username !== ami.username && (
                        <FriendChatListItem
                          key={index}
                          ami={ami}
                          handleChatButtonClick={handleChatButtonClick}
                          arrIsSelected={arrIsSelected}
                        />
                      )
                  )
                : "Vous n'avez pas d'amis :("}
            </div>
          </div>

          <div className="grow bg-red-600">
            {selectedFriend && (
              <div>
                <Chat ami={selectedFriend}></Chat>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ChatPage;
