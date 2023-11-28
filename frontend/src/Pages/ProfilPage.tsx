import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import FooterMain from "../Components/FooterMain";
import FriendProfilRow from "../Components/FriendProfilRow";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import PartieProfilRow from "../Components/PartieProfilRow";
import StatBloc from "../Components/StatBloc";
import Tab from "../Components/Tab/Tab";
import TabContainer from "../Components/Tab/TabContainer";
import TabList from "../Components/Tab/TabList";
import TabPanel from "../Components/Tab/TabPanel";
import { useUserContext } from "../contexts/UserContext";
import { Parties } from "../models/Game";
import { User } from "../models/User";
import { useNavigate } from "react-router-dom";

const ProfilPage = () => {
  const { user, loading } = useUserContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friends, setAllFriends] = useState<User[] | null>(null);
  const [Parties, setGames] = useState<Parties[] | null>(null);
  //const [blocked, setBlocked] = useState<User[] | null>(null);
  const [IsMyProfile, setIsMyProfile] = useState(false);
  const navigate = useNavigate();

  const url = window.location.href; // Obtient l'URL actuelle
  const urlSegments = url.split("/"); // Divise l'URL en segments
  let idURL: string | undefined = urlSegments[urlSegments.length - 1];

  useEffect(() => {
    if (loading) return;
    console.log("user = ", user);
    if (idURL === "profil" || idURL === "" || idURL === user?.username) {
      setIsMyProfile(true);
      idURL = user?.username;
    }
    async function fetchUserAndFriend() {
      const name = idURL;
      console.log("name in fetchUserAndFriend =", name);
      if (name) {
        try {
          const [userResponse, friendResponse, gamesResponse] =
            await Promise.all([
              axios.get<User>("/api/" + name),
              axios.get<User[]>("/api/friends/all/" + name),
              axios.get<Parties[]>("/api/game/user-history/" + name),
            ]);
          setCurrentUser(userResponse.data);
          setAllFriends(friendResponse.data);
          setGames(gamesResponse.data);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            // Handle 404 error;
            navigate("/404");
            return;
          }
          // Handle other errors
          console.error("An error occurred while fetching the user");
        }
      }
    }
    fetchUserAndFriend();
    console.log("currentUser = ", currentUser);
  }, [loading, user, idURL]);

  const Stats = [
    { title: "Score", score: 0 },
    { title: "Parties jouées", score: 0 },
    { title: "Victoires", score: 0 },
    { title: "Défaites", score: 0 },
    { title: "Matchs nuls", score: 0 },
  ];
  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col gap-8 pb-12">
          <div className="flex w-full justify-between items-center">
            <div id="section-title" className="flex shrink py-10">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser?.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full mr-2"
                />
                <h1 className="text-3xl leading-none">
                  {currentUser?.username}
                </h1>
                <button
                  type="button"
                  className="w-5 h-5 mt-1 opacity-50 hover:opacity-100"
                >
                  {IsMyProfile && <PencilSquareIcon />}
                </button>
              </div>
            </div>
            <div
              id="section-stats"
              className="grid grid-flow-col shrink grid-cols-5 gap-4"
            >
              {Stats.map((stat, index) => (
                <StatBloc
                  key={index}
                  title={stat.title}
                  score={!stat.score ? 0 : stat.score}
                />
              ))}
            </div>
          </div>
          <div>
            <TabContainer>
              <TabList>
                <Tab index={0}>Amis</Tab>
                {IsMyProfile && <Tab index={1}>Demandes</Tab>}
                <Tab index={2}>Historique</Tab>
              </TabList>
              <TabPanel index={0}>
                <div className="grid grid-flow-row gap-2">
                  {friends?.map(
                    (ami, index) =>
                      currentUser?.username !== ami.username && (
                        <FriendProfilRow
                          key={index}
                          ami={ami}
                          IsMyProfile={IsMyProfile}
                        />
                      )
                  )}
                </div>
              </TabPanel>
              {IsMyProfile && (
                <TabPanel index={1}>
                  <div className="grid grid-flow-row gap-2">
                    liste des demandes en attentes
                  </div>
                </TabPanel>
              )}
              <TabPanel index={2}>
                <div className="grid grid-flow-row gap-2">
                  {Parties &&
                    Parties.map((partie, index) => (
                      <PartieProfilRow key={index} partie={partie} />
                    ))}
                </div>
              </TabPanel>
            </TabContainer>
          </div>
          {/* <div
            id="section-more"
            className="grid grid-flow-col grid-cols-2 gap-8 mt-10"
          >
            <div className="h-full overflow-auto">
              <h2 className="text-xl mb-4">Amis</h2>
              <div className="grid grid-flow-row gap-2">
                {friends?.map(
                  (ami, index) =>
                    currentUser?.username !== ami.username && (
                      <FriendProfilRow
                        key={index}
                        ami={ami}
                        IsMyProfile={IsMyProfile}
                      />
                    )
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl mb-4">Historique des parties</h2>
              <div className="grid grid-flow-row gap-2">
                {Parties &&
                  Parties.map((partie, index) => (
                    <PartieProfilRow key={index} partie={partie} />
                  ))}
              </div>
            </div>
          </div> */}
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ProfilPage;
