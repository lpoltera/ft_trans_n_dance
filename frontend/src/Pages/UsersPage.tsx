import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BlockedProfilRow from "../Components/BlockedProfilRow";
import FooterMain from "../Components/FooterMain";
import InfosUsersRow from "../Components/InfosUsersRow";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import { User } from "../models/User";
import StatBloc from "../Components/StatBloc";

const UsersPage = () => {
  const [blocked, setBlocked] = useState<User[] | null>(null);
  const [users, setAllUser] = useState<User[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [update, setUpdate] = useState<boolean>(false);

  const handleStatsButtonClick = (ami: User) => {
    // setSelectedUser((prevUser) => (prevUser === ami ? null : ami));
    if (selectedUser === ami) {
      setSelectedUser(null);
    } else setSelectedUser(ami);
  };

  const notify = (socket: any) => {
    console.log("notify function called");
    if (socket) {
      socket.on("error", (error: any) => {
        toast(error.error);
        socket.off("error");
        socket.off("myNotifs");
      });

      socket.on("myNotifs", () => {
        toast("Demande d'ami envoyée !");
        socket.off("error");
        socket.off("myNotifs");
      });
    }
  };

  useEffect(() => {
    async function fetchCurrent() {
      try {
        const response = await axios.get<User>("/api/my-name");
        setCurrentUser(response.data);
        console.log("my name :", response.data.username);
        return response.data.username;
      } catch (err) {
        console.error(err);
        return null;
      }
    }
    async function fetchUserAndBlocked() {
      const name = await fetchCurrent();
      console.log("name in fetchUserAndFriend =", name);
      if (name) {
        try {
          const [userResponse, blockedResponse, usersResponse] =
            await Promise.all([
              axios.get<User>("/api/" + name),
              axios.get<User[]>("api/friends/blocked/" + name),
              axios.get<User[]>("/api/all"),
            ]);
          setCurrentUser(userResponse.data);
          setAllUser(usersResponse.data);
          if (blockedResponse) setBlocked(blockedResponse.data);
          else setBlocked(null);
        } catch (err) {}
      }
    }
    fetchUserAndBlocked();
  }, [update]);

  const handleBlockedListChange = async () => {
    // -> handleChange
    if (update) {
      setUpdate(false);
    } else {
      setUpdate(true);
    }
  };

  const Stats = [
    {
      title: "Ratio",
      score:
        selectedUser?.totalGame === 0
          ? 0
          : (
              ((selectedUser?.win || 0) / (selectedUser?.totalGame || 0)) *
              100
            ).toFixed(0) + "%",
    },
    { title: "Parties jouées", score: selectedUser?.totalGame },
    { title: "Victoires", score: selectedUser?.win },
    { title: "Défaites", score: selectedUser?.loss },
    { title: "Matchs nuls", score: selectedUser?.draw },
  ];

  return (
    <>
      <Navbar />
      <PageLayout>
        {selectedUser && (
          <div className="w-full flex flex-col gap-8">
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
              </div>
            </div>
            <div
              id="section-stats"
              className="grid grid-flow-col grid-cols-5 gap-4"
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
        )}
        <div
          id="section-more"
          className="grid grid-flow-col grid-cols-2 gap-8 mt-10"
        >
          <div className="h-full overflow-auto">
            <h2 className="text-xl mb-4">Liste de tous les joueurs</h2>
            <div className="grid grid-flow-row gap-2">
              {currentUser &&
                users?.map(
                  (ami, index) =>
                    currentUser.username !== ami.username && (
                      <InfosUsersRow
                        key={index}
                        ami={ami}
                        handleStatsButtonClick={handleStatsButtonClick}
                        currentUser={currentUser}
                        displayToast={notify}
                        selectedUser={selectedUser}
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
                  currentUser?.username !== ami.username && (
                    <BlockedProfilRow
                      key={index}
                      ami={ami}
                      handleBlockedListChange={handleBlockedListChange}
                    />
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

// import { PencilSquareIcon } from "@heroicons/react/24/outline";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import BlockedProfilRow from "../Components/ArchivedComponent/BlockedProfilRow";
// import FooterMain from "../Components/FooterMain";
// import InfosUsersRow from "../Components/InfosUsersRow";
// import Navbar from "../Components/Navbar";
// import PageLayout from "../Components/PageLayout";
// import { useUserContext } from "../contexts/UserContext";
// import { User } from "../models/User";

// const UsersPage = () => {
//   const [blocked, setBlocked] = useState<User[] | null>(null);
//   const [users, setAllUser] = useState<User[] | null>(null);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const { user, loadingUser } = useUserContext();

//   const handleStatsButtonClick = (ami: User) => {
//     setSelectedUser((prevUser) => (prevUser === ami ? null : ami));
//   };

//   const notify = (socket: any) => {
//     console.log("notify function called");

//     // useEffect(() => {
//     if (socket) {
//       socket.on("error", (error: any) => {
//         toast(error.error);
//         socket.off("error");
//         socket.off("myNotifs");
//       });

//       socket.on("myNotifs", () => {
//         toast("Demande d'ami envoyée !");
//         socket.off("error");
//         socket.off("myNotifs");
//       });
//     }

//     // Supprimez les écouteurs lorsque le composant est démonté
//     // return () => {
//     //   if (socket) {
//     //     socket.off("error");
//     //     socket.off("myNotifs");
//     //   }
//     // };
//     // }, [socket]);

//     // if (!error) toast("Demande d'ami envoyée !");
//     // else toast(error);
//   };

//   useEffect(() => {
//     if (loadingUser) return;
//     async function fetchUserAndBlocked() {
//       const name = user?.username;
//       if (name) {
//         try {
//           const [blockedResponse, usersResponse] = await Promise.all([
//             axios.get<User[]>("api/friends/blocked/" + name),
//             axios.get<User[]>("/api/all"),
//           ]);
//           setAllUser(usersResponse.data);
//           if (blockedResponse) setBlocked(blockedResponse.data);
//           else setBlocked(null);
//         } catch (err) {
//           console.error("Error fetching blocked users:", err);
//         }
//       }
//     }
//     fetchUserAndBlocked();
//   }, [loadingUser]);

//   return (
//     <>
//       <Navbar />
//       <PageLayout>
//         {selectedUser && (
//           <div className="w-full h-full grow flex flex-col gap-8 pb-12">
//             <div id="section-title" className="flex shrink py-10">
//               <div className="flex items-center gap-2">
//                 <img
//                   src={selectedUser?.avatar}
//                   alt=""
//                   className="w-16 h-16 rounded-full mr-2"
//                 />
//                 <h1 className="text-3xl leading-none">
//                   {selectedUser?.username}
//                 </h1>
//                 <button
//                   type="button"
//                   className="w-5 h-5 mt-1 opacity-50 hover:opacity-100"
//                 >
//                   <PencilSquareIcon />
//                 </button>
//               </div>
//             </div>
//             <div
//               id="section-stats"
//               className="grid grid-flow-col grid-cols-6 gap-4"
//             >
//               {/* {Stats.map((stat, index) => (
//                 <StatBloc
//                   key={index}
//                   title={stat.title}
//                   score={!stat.score ? 0 : stat.score}
//                 />
//               ))} */}
//             </div>
//           </div>
//         )}
//         <div
//           id="section-more"
//           className="grid grid-flow-col grid-cols-2 gap-8 mt-10"
//         >
//           <div className="h-full overflow-auto">
//             <h2 className="text-xl mb-4">Liste de tous les joueurs</h2>
//             <div className="grid grid-flow-row gap-2">
//               {user &&
//                 users?.map(
//                   (ami, index) =>
//                     user?.username !== ami.username && (
//                       <InfosUsersRow
//                         key={index}
//                         ami={ami}
//                         handleStatsButtonClick={handleStatsButtonClick}
//                         currentUser={user}
//                         displayToast={notify}
//                       />
//                     )
//                 )}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-xl mb-4">Joueurs bloqués</h2>
//             <div className="grid grid-flow-row gap-2">
//               {blocked?.map(
//                 (ami, index) =>
//                   user?.username !== ami.username && (
//                     <BlockedProfilRow key={index} ami={ami} />
//                   )
//               )}
//             </div>
//           </div>
//         </div>
//       </PageLayout>
//       <FooterMain />
//     </>
//   );
// };

// export default UsersPage;
