import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import FooterMain from "../Components/FooterMain";
import FriendProfilRow from "../Components/FriendProfilRow";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import PartieProfilRow from "../Components/PartieProfilRow";
import StatBloc from "../Components/StatBloc";

interface User {
  id: number;
  username: string;
  avatar: string;
  status: string;
}

const ProfilPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friends, setAllFriends] = useState<User[] | null>(null);
  const [current, setCurrent] = useState<User | null>(null);

  const Stats = [
    { title: "Score", score: 2300 },
    { title: "Parties jouées", score: 125 },
    { title: "Victoires", score: 100 },
    { title: "Défaites", score: 20 },
    { title: "Matchs nuls", score: 5 },
  ];

  const url = window.location.href; // Obtient l'URL actuelle
  const urlSegments = url.split("/"); // Divise l'URL en segments
  let idURL: string | undefined = urlSegments[urlSegments.length - 1];

  useEffect(() => {
    async function fetchCurrent() {
      await axios
        .get<User>("/api/user")
        .then((response) => setCurrent(response.data))
        .catch((err) => {
          console.error(err);
        });
    }
    async function fetchUser() {
      if (idURL === "profil") idURL = current?.username;
	  console.log("username = ", idURL);
      await axios
        .get<User>("/api/" + idURL)
        .then((response) => setCurrentUser(response.data))
        .catch((err) => {
          console.error(err);
        });
    }
    async function fetchFriend() {
      await axios
        .get<User[]>("/api/friends/all/" + currentUser?.id)
        .then((response) => setAllFriends(response.data))
        .catch((err) => {
          console.error(err);
        });
    }
    fetchCurrent();
    fetchUser();
    fetchFriend();
  }, [idURL]); // Or [] if effect doesn't need props or state

  const Parties = [
    {
      id: 1,
      player1: "rricol",
      player2: "lpoltera",
      score: "5-1",
      date: "11-02-23",
    },
    {
      id: 2,
      player1: "rricol",
      player2: "Laurent",
      score: "5-3",
      date: "10-02-23",
    },
    {
      id: 3,
      player1: "rricol",
      player2: "Tito",
      score: "3-5",
      date: "8-01-23",
    },
  ];
  return (
    <>
      <Navbar />
      <PageLayout>
        <div className="w-full h-full grow flex flex-col gap-8 pb-12">
          <div id="section-title" className="flex shrink py-10">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar}
                alt=""
                className="w-16 h-16 rounded-full mr-2"
              />
              <h1 className="text-3xl leading-none">{currentUser?.username}</h1>
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
            {Stats.map((stat, index) => (
              <StatBloc key={index} title={stat.title} score={stat.score} />
            ))}
          </div>
          <div
            id="section-more"
            className="grid grid-flow-col grid-cols-2 gap-8 mt-10"
          >
            <div className="h-full overflow-auto">
              <h2 className="text-xl mb-4">Amis</h2>
              <div className="grid grid-flow-row gap-2">
                {friends?.map(
                  (ami, index) =>
                    currentUser?.username !== ami.username && (
                      <FriendProfilRow key={index} ami={ami} />
                    )
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl mb-4">Historique des parties</h2>
              <div className="grid grid-flow-row gap-2">
                {Parties.map((partie, index) => (
                  <PartieProfilRow key={index} partie={partie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default ProfilPage;
