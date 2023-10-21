import axios from "axios";
import AlertBox from "./AlertBox";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  password: string;
  avatar: string;
}

const GetAllUser: React.FC = () => {
  const [friends, setAllFriends] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const url = window.location.href; // Obtient l'URL actuelle
  const urlSegments = url.split("/"); // Divise l'URL en segments

  const idURL = urlSegments[urlSegments.length - 1];

  //   const [alertMessage, setAlertMessage] = useState("");
  //   const [alertColor, setAlertColor] = useState("");

  //   const showAlert = () => {
  //     const Element = document.getElementById("alert");
  //     if (Element) {
  //       Element.style.display = "block";
  //       setTimeout(() => {
  //         Element.style.display = "none";
  //       }, 3000);
  //     }
  //   };

  //   const handleClick = (id: string) => {
  //     axios
  //       .post("http://localhost:8000/api/friends/add/" + id)
  //       .then((response) => {
  //         setAlertColor("green");
  //         setAlertMessage(response.data);
  //         showAlert();
  //       })
  //       .catch((err) => {
  //         if (err.response && err.response.data && err.response.data.message) {
  //           const errorMessage = err.response.data.message;
  //           setAlertColor("red");
  //           setAlertMessage(errorMessage);
  //           showAlert();
  //         }
  //       });
  //   };

  useEffect(() => {
    axios
      .get<User[]>("http://localhost:8000/api/friends/all/" + idURL)
      .then((response) => setAllFriends(response.data))
      .catch((err) => {
        console.error(err);
      });
    axios
      .get<User>("http://localhost:8000/api/user")
      .then((response) => setCurrentUser(response.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      {friends && (
        <h1>
          Profil de {friends.find((friend) => friend.id === +idURL)?.username}
        </h1>
      )}
      <a href="http://localhost:8000/logout">Déconnexion</a>
      <h2>Liste d'amis</h2>
      <div>
        {friends &&
          friends.map(
            (user) =>
              +idURL !== user.id && (
                <div>
                  {/* <h3>ID: {user.id}</h3> */}
                  {user.username} <br />
                  {user.avatar} <br />
                  {/* <button
                    type="button"
                    onClick={() => handleClick("" + user.id)}
                  >
                    {" "}
                    Ajouter {user.username}
                  </button> */}
                  <br />
                </div>
              )
          )}
      </div>
    </>
  );
};

export default GetAllUser;
