import { useEffect, useState } from "react";
import Chat from "../Components/Chat/Chat";
import FriendChatListItem from "../Components/Chat/FriendChatListItem";
import FooterMain from "../Components/FooterMain";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import Tab from "../Components/Tab/Tab";
import TabContainer from "../Components/Tab/TabContainer";
import TabList from "../Components/Tab/TabList";
import TabPanel from "../Components/Tab/TabPanel";
import { useUserContext } from "../contexts/UserContext";
import { User } from "../models/User";

const ChatPage = () => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const { user, loading, fetchUserFriends } = useUserContext();

  useEffect(() => {
    if (loading) return;
    const getFriends = async () => {
      const userFriends = await fetchUserFriends();
      setFriends(userFriends);
    };
    getFriends();
  }, [loading]);

  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full max-h-full grow flex flex-col pb-12">
          <h1 className="text-3xl mb-4 pl-1">Conversations</h1>
          <TabContainer>
            <div className="grow rounded-lg overflow-hidden max-h-full flex flex-row bg-cyan-950">
              <TabList classCustom="shrink py-2 w-min-content overflow-auto flex-col">
                <div className="w-full overflow-auto flex flex-col gap-0">
                  {friends
                    ? friends.map(
                        (ami, index) =>
                          user?.username !== ami.username && (
                            <Tab index={index} key={index} classInactive=" ">
                              <FriendChatListItem ami={ami} index={index} />
                            </Tab>
                          )
                      )
                    : "Vous n'avez pas d'amis :("}
                </div>
              </TabList>
              <div className="relative grow flex flex-col h-full">
                <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center text-white">
                  <span className="text-2xl block absolute top-10 left-6">
                    ← Sélectionnez une discussion
                  </span>
                </div>
                {friends &&
                  friends.map(
                    (ami, index) =>
                      user?.username !== ami.username && (
                        <TabPanel
                          index={index}
                          key={index}
                          customClass="grow bg-cyan-800 flex flex-col p-1 gap-2 relativ z-10"
                        >
                          <Chat ami={ami}></Chat>
                        </TabPanel>
                      )
                  )}
              </div>
            </div>
          </TabContainer>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ChatPage;
