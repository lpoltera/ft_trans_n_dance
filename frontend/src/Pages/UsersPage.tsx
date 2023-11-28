import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BlockedProfilRow from "../Components/BlockedProfilRow";
import FooterMain from "../Components/FooterMain";
import InfosUsersRow from "../Components/InfosUsersRow";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import { useUserContext } from "../contexts/UserContext";
import { User } from "../models/User";

const UsersPage = () => {
  const [blocked, setBlocked] = useState<User[] | null>(null);
  const [users, setAllUser] = useState<User[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user, loading } = useUserContext();

  const handleStatsButtonClick = (ami: User) => {
    setSelectedUser((prevUser) => (prevUser === ami ? null : ami));
  };

  const notify = () => {
    console.log("notify function called");
    toast("Demande d'ami envoyée !");
  };

  useEffect(() => {
    if (loading) return;
    async function fetchUserAndBlocked() {
      const name = user?.username;
      if (name) {
        try {
          const [blockedResponse, usersResponse] = await Promise.all([
            axios.get<User[]>("api/friends/blocked/" + name),
            axios.get<User[]>("/api/all"),
          ]);
          setAllUser(usersResponse.data);
          if (blockedResponse) setBlocked(blockedResponse.data);
          else setBlocked(null);
        } catch (err) {
          console.error("Error fetching blocked users:", err);
        }
      }
    }
    fetchUserAndBlocked();
  }, [loading]);

  // const Stats = [
  //   { title: "Score", score: selectedUser?.totalXP },
  //   { title: "Parties jouées", score: selectedUser?.totalGame },
  //   { title: "Victoires", score: selectedUser?.win },
  //   { title: "Défaites", score: selectedUser?.loss },
  //   { title: "Matchs nuls", score: selectedUser?.draw },
  // ];

  return (
    <>
      <Navbar />
      <PageLayout>
        {selectedUser && (
          <div className="w-full h-full grow flex flex-col gap-8 pb-12">
            <div id="section-title" className="flex shrink py-10">
              <div className="flex items-center gap-2">
                <img
                  src={selectedUser?.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full mr-2"
                />
                <h1 className="text-3xl leading-none">
                  {selectedUser?.username}
                </h1>
                <button
                  type="button"
                  className="w-5 h-5 mt-1 opacity-50 hover:opacity-100"
                >
                  <PencilSquareIcon />
                </button>
              </div>
            </div>
            <div
              id="section-stats"
              className="grid grid-flow-col grid-cols-6 gap-4"
            >
              {/* {Stats.map((stat, index) => (
                <StatBloc
                  key={index}
                  title={stat.title}
                  score={!stat.score ? 0 : stat.score}
                />
              ))} */}
            </div>
          </div>
        )}
        <div
          id="section-more"
          className="grid grid-flow-col grid-cols-2 gap-8 mt-10"
        >
          <div className="h-full overflow-auto">
            <h2 className="text-xl mb-4">Liste de tous les joueurs</h2>
            <div className="grid grid-flow-row gap-2">
              {user &&
                users?.map(
                  (ami, index) =>
                    user?.username !== ami.username && (
                      <InfosUsersRow
                        key={index}
                        ami={ami}
                        handleStatsButtonClick={handleStatsButtonClick}
                        currentUser={user}
                        displayToast={notify}
                      />
                    )
                )}
            </div>
          </div>
          <div>
            <h2 className="text-xl mb-4">Joueurs bloqués</h2>
            <div className="grid grid-flow-row gap-2">
              {blocked?.map(
                (ami, index) =>
                  user?.username !== ami.username && (
                    <BlockedProfilRow key={index} ami={ami} />
                  )
              )}
            </div>
          </div>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default UsersPage;
