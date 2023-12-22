import {
  NoSymbolIcon,
  PencilSquareIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FooterMain from "../../Components/FooterMain";
import HistoryMatchRow from "../../Components/HistoryMatchRow";
import IconButton from "../../Components/IconButton";
import Navbar from "../../Components/Navbar";
import PageLayout from "../../Components/PageLayout";
import StatRow from "../../Components/StatRow";
import Tab from "../../Components/Tab/Tab";
import TabContainer from "../../Components/Tab/TabContainer";
import TabList from "../../Components/Tab/TabList";
import TabPanel from "../../Components/Tab/TabPanel";
import UserRow from "../../Components/UserRow";
import { useUserContext } from "../../contexts/UserContext";
import { GameStatsProps, Parties } from "../../models/Game";
import { User } from "../../models/User";
import { toast } from "react-toastify";

const ProfilPage = () => {
  const { user, loading, userRelations } = useUserContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userGames, setUserGames] = useState<Parties[] | null>(null);
  const [userFriends, setUserFriends] = useState<User[] | null>(null);
  const [isMe, setIsMe] = useState(false);
  const [relationStatus, setRelationStatus] = useState<string>("none");
  const [userStats, setUserStats] = useState<GameStatsProps[]>([]); // TODO: type this
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  // Finding out who's profile we're on
  useEffect(() => {
    if (loading) return;
    if (id === user?.username) {
      setIsMe(true);
      setCurrentUser(user);
    } else {
      const relation = userRelations?.find(
        (relation) => relation.friend.username === id
      );
      if (relation) {
        setRelationStatus(relation.status);
        setCurrentUser(relation.friend);
      } else {
        const fetchProfileUser = async () => {
          try {
            const response = await axios.get<User>("/api/" + id);
            setCurrentUser(response.data);
          } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
              navigate("/404");
            } else {
              toast.error("An error occurred while fetching the user");
            }
          }
        };
        fetchProfileUser();
      }
    }
  }, [loading]);

  // fetch user games
  useEffect(() => {
    if (!currentUser) return;
    const Stats = [
      { title: "Score", value: currentUser?.totalXP },
      { title: "Parties jouées", value: currentUser?.totalGame },
      { title: "Victoires", value: currentUser?.win },
      { title: "Défaites", value: currentUser?.loss },
      { title: "Matchs nuls", value: currentUser?.draw },
    ];
    setUserStats(Stats);
    const fetchProfileUserGames = async () => {
      try {
        const response = await axios.get<Parties[]>(
          "/api/game/user-history/" + id
        );
        setUserGames(response.data);
      } catch (err) {
        toast.error("An error occurred while fetching the user games");
      }
    };
    fetchProfileUserGames();
  }, [currentUser]);

  // fetch user friend
  useEffect(() => {
    if (!currentUser || isMe || relationStatus === "none") return;
    const fetchProfileUserFriends = async () => {
      try {
        const response = await axios.get<User[]>("/api/friends/all/" + id);
        setUserFriends(response.data);
      } catch (error) {
        toast.error("An error occurred while fetching user friends");
      }
    };
    fetchProfileUserFriends();
  }, [currentUser, isMe, relationStatus]);

  // useEffect(() => {
  //   if (loading) return;
  //   if (id === user?.username) {
  //     setIsMe(true);
  //     setCurrentUser(user);
  //   }

  //   const fetchProfileUser = async () => {
  //     try {
  //       const response = await axios.get<User>("/api/" + id);
  //       setCurrentUser(response.data);
  //     } catch (err) {
  //       if (axios.isAxiosError(err) && err.response?.status === 404) {
  //         // Handle 404 error;
  //         navigate("/404");
  //         return;
  //       }
  //       // Handle other errors
  //       toast.error("An error occurred while fetching the user");
  //     }
  //   };

  //   const fetchProfileUserGames = async () => {
  //     try {
  //       const response = await axios.get<Parties[]>(
  //         "/api/game/user-history/" + id
  //       );
  //       setUserGames(response.data);
  //     } catch (err) {
  //       toast.error("An error occurred while fetching the user games");
  //     }
  //   };

  //   const fetchProfileUserFriends = async () => {
  //     try {
  //       const response = await axios.get<User[]>("/api/friends/all/" + id);
  //       setUserFriends(response.data);
  //     } catch (error) {
  //       toast.error("An error occurred while fetching user friends");
  //     }
  //   };

  //   const fetchProfileData = async () => {
  //     setLoadingData(true);
  //     await Promise.all([
  //       fetchProfileUser(),
  //       fetchProfileUserGames(),
  //       fetchProfileUserFriends(),
  //     ]);
  //     setLoadingData(false);
  //   };
  //   if (!isMe) {
  //     const relation = userRelations?.find(
  //       (relation) => relation.friend.username === id
  //     );
  //     if (relation) {
  //       setRelationStatus(relation.status);
  //       fetchProfileData();
  //     } else {
  //       fetchProfileUser();
  //     }
  //   } else {
  //     fetchProfileUserGames();
  //   }
  // }, [loading, user, id]);

  const editProfil = () => {};
  const addFriend = () => {};
  const removeFriend = () => {};
  const blockUser = () => {};

  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col gap-12">
          <div className="flex w-full gap-10 justify-start items-center">
            <div className="flex shrink gap-4 items-center">
              <img
                src={currentUser?.avatar}
                alt="Profile picture"
                className="w-16 h-16 rounded-full"
              />
              <div className="flex flex-col gap-1 pt-1">
                <h1 className="text-3xl leading-none">
                  {currentUser?.username}
                </h1>
                <span className="text-neutral-400 text-md">
                  {currentUser?.connected}
                </span>
              </div>
            </div>
            <div className="flex gap-0 items-center">
              {isMe ? (
                <IconButton
                  onClick={editProfil}
                  icon={<PencilSquareIcon />}
                  classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
                  tooltip="Modifier le profil"
                  tooltipId="editProfil"
                />
              ) : (
                <>
                  {relationStatus === "valider" ? (
                    <IconButton
                      icon={<UserMinusIcon />}
                      classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
                      onClick={removeFriend}
                      tooltip="Supprimer de la liste d'amis"
                      tooltipId="removeFriend"
                    />
                  ) : (
                    <IconButton
                      icon={<UserPlusIcon />}
                      classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
                      onClick={addFriend}
                      tooltip="Ajouter en ami"
                      tooltipId="addFriend"
                    />
                  )}
                  <IconButton
                    onClick={blockUser}
                    icon={<NoSymbolIcon />}
                    classCustom="w-10 h-10 p-2 rounded-md hover:bg-[#f67539]"
                    tooltip="Bloquer"
                    tooltipId="blockUser"
                  />
                </>
              )}
            </div>
          </div>
          <div className="grow">
            {relationStatus === "blocked" ? (
              <div>Débloquez le joueur pour voir son profil</div>
            ) : (
              <TabContainer>
                <TabList classCustom="pb-4 mb-8 flex gap-6 border border-neutral-400 border-r-0 border-l-0 border-t-0 overflow-auto whitespace-nowrap">
                  <Tab
                    index={0}
                    classActive="text-xl text-white"
                    classInactive="text-xl text-neutral-400 hover:text-white"
                  >
                    Statistiques
                  </Tab>
                  {(relationStatus === "valider" || isMe) && (
                    <>
                      <Tab
                        index={1}
                        classActive="text-xl text-white"
                        classInactive="text-xl text-neutral-400 hover:text-white"
                      >
                        Historiques de parties
                      </Tab>
                      <Tab
                        index={2}
                        classActive="text-xl text-white"
                        classInactive="text-xl text-neutral-400 hover:text-white"
                      >
                        Amis
                      </Tab>
                    </>
                  )}
                  {isMe && (
                    <>
                      <Tab
                        index={3}
                        classActive="text-xl text-white"
                        classInactive="text-xl text-neutral-400 hover:text-white"
                      >
                        Invitations
                      </Tab>
                      <Tab
                        index={4}
                        classActive="text-xl text-white"
                        classInactive="text-xl text-neutral-400 hover:text-white"
                      >
                        Bloqués
                      </Tab>
                    </>
                  )}
                </TabList>
                <TabPanel index={0}>
                  <div className="flex flex-col gap-6">
                    {userStats?.map((stat, index) => (
                      <StatRow
                        key={index}
                        title={stat.title}
                        value={stat.value || 0}
                      />
                    ))}
                  </div>
                </TabPanel>
                {(relationStatus === "valider" || isMe) && (
                  <>
                    <TabPanel index={1}>
                      {!(userGames === undefined || userGames?.length === 0) ? (
                        <>
                          <div className="overflow-hidden border border-cyan-700 rounded-xl">
                            <div className="grid grid-flow-col grid-cols-4 text-md sticky py-2 border border-t-0 border-r-0 border-l-0 border-cyan-700 bg-cyan-700">
                              <div className="pl-4">Joueur 1</div>
                              <div className="pl-4">Joueur 2</div>
                              <div className="pl-4">Score</div>
                              <div className="pl-4">Date</div>
                            </div>
                            {userGames &&
                              userGames.map((partie, index) => (
                                <HistoryMatchRow key={index} partie={partie} />
                              ))}
                          </div>
                        </>
                      ) : (
                        <div>{`Aucune partie joué pour le moment.`}</div>
                      )}
                    </TabPanel>
                    <TabPanel index={2}>
                      {isMe ? (
                        <div className="flex flex-col gap-1">
                          {userRelations?.map(
                            (relation, index) =>
                              relation.status === "valider" && (
                                <UserRow
                                  key={index}
                                  user={relation.friend}
                                  isMyProfile={isMe}
                                />
                              )
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {userFriends?.map((relation, index) => (
                            <UserRow
                              key={index}
                              user={relation}
                              isMyProfile={isMe}
                            />
                          ))}
                        </div>
                      )}
                    </TabPanel>
                  </>
                )}
                {isMe && (
                  <>
                    <TabPanel index={3}>
                      <div className="flex flex-col gap-1">
                        <div className="ml-2 mb-4">Reçues</div>
                        {userRelations?.map(
                          (relation, index) =>
                            relation.status === "pending" &&
                            relation.sender !== user?.username && (
                              <UserRow
                                key={index}
                                user={relation.friend}
                                isMyProfile={isMe}
                              />
                            )
                        )}
                        <div className="ml-2 my-4">Envoyées</div>
                        {userRelations?.map(
                          (relation, index) =>
                            relation.status === "pending" &&
                            relation.sender === user?.username && (
                              <UserRow
                                key={index}
                                user={relation.friend}
                                isMyProfile={isMe}
                              />
                            )
                        )}
                      </div>
                    </TabPanel>
                    <TabPanel index={4}>
                      <div className="flex flex-col gap-1">
                        {userRelations?.map(
                          (relation, index) =>
                            relation.status === "blocked" && (
                              <UserRow
                                key={index}
                                user={relation.friend}
                                isMyProfile={isMe}
                              />
                            )
                        )}
                      </div>
                    </TabPanel>
                  </>
                )}
              </TabContainer>
            )}
          </div>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ProfilPage;
