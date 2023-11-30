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
  const { user, loadingUser, userRelations } = useUserContext();
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (loadingUser) return;
    const getFriends = async () => {
      setLoadingFriends(true);
      const userFriends: User[] = [];
      userRelations.forEach((relation) => {
        if (relation.status === "valider") {
          userFriends.push(relation.friend);
        }
      });
      setFriends(userFriends);
      setLoadingFriends(false);
    };
    getFriends();
  }, [loadingUser]);

  console.log("friendsList length =" + friends?.length);

  return (
    <>
      <Navbar />
      <PageLayout>
        <TabContainer>
          <div className="bg-red-600 w-full h-full rounded-xl overflow-hidden">
            <div className="bg-green-600 h-full w-full flex flex-row">
              <div className="bg-cyan-950 h-full shrink min-w-min relative z-10">
                <TabList classCustom="py-2 w-full overflow-auto flex flex-col h-full">
                  {/* <div className="w-full overflow-auto flex flex-col gap-0"> */}
                  {friends &&
                    friends.map(
                      (ami, index) =>
                        user?.username !== ami.username && (
                          <Tab index={index} key={index} classInactive=" ">
                            <FriendChatListItem ami={ami} index={index} />
                          </Tab>
                        )
                    )}
                  {/* </div> */}
                </TabList>
              </div>
              <div className="bg-neutral-800 h-full grow relative z-0">
                <div className="absolute top-10 left-8">
                  {loadingFriends ? (
                    <div className="text-2xl">Loading friends...</div>
                  ) : friends && friends.length === 1 ? (
                    <div className="text-2xl">
                      Ajoutez des amis pour discuter !
                    </div>
                  ) : (
                    <div className="text-2xl">
                      ← Sélectionnez une discussion
                    </div>
                  )}
                </div>
                <div className="relative h-full w-full">
                  {friends &&
                    friends.map(
                      (ami, index) =>
                        user?.username !== ami.username && (
                          <TabPanel
                            index={index}
                            key={index}
                            customClass="bg-neutral-800 flex flex-col p-2 h-full"
                          >
                            <Chat ami={ami}></Chat>
                          </TabPanel>
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        </TabContainer>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ChatPage;
