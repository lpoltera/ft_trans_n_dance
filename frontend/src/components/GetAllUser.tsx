import axios from "axios";
import AlertBox from "./AlertBox";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  password: string;
  avatar: string;
}

interface AlertProps {
  message: string;
  color: string;
}

const GetAllUser: React.FC = () => {
  const [users, setAllUser] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const showAlert = () => {
    const Element = document.getElementById("alert");
    if (Element) {
      Element.style.display = "block";
      setTimeout(() => {
        Element.style.display = "none";
      }, 3000);
    }
  };

  const handleClick = (id: string) => {
    axios
      .post("http://localhost:8000/api/friends/add/" + id)
      .then((response) => {
        setAlertColor("green");
        setAlertMessage(response.data);
        showAlert();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          const errorMessage = err.response.data.message;
          setAlertColor("red");
          setAlertMessage(errorMessage);
          showAlert();
        }
      });
  };

  useEffect(() => {
    axios
      .get<User[]>("http://localhost:8000/api/all")
      .then((response) => setAllUser(response.data))
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
      <AlertBox color={alertColor} message={alertMessage} />
      <h1>All Users</h1>
      <a href="http://localhost:8000/logout">DÃ©connexion</a>
      <ul>
        {users &&
          users.map(
            (user) =>
              currentUser?.id !== user.id && (
                <li key={user.id}>
                  <h3>ID: {user.id}</h3>
                  username: {user.username} <br />
                  avatar: {user.avatar} <br />
                  <button
                    type="button"
                    onClick={() => handleClick("" + user.id)}
                  >
                    {" "}
                    Ajouter {user.username}
                  </button>
                </li>
              )
          )}
      </ul>
    </>
  );
};

export default GetAllUser;
