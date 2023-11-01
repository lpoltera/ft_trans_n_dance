import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  password: string;
  avatar: string;
  connected: string;
}

const AddPage: React.FC = () => {
  const [users, setAllUser] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleClick = (username: string) => {
    axios.post("/api/friends/add/" + username).catch(() => {});
  };

  useEffect(() => {
    axios
      .get<User[]>("/api/all")
      .then((response) => setAllUser(response.data))
      .catch((err) => {
        console.error(err);
      });
    axios
      .get<User>("/api/user")
      .then((response) => setCurrentUser(response.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <h1>All Users</h1>
      <a href="/logout">Déconnexion</a>
      <ul>
        {users &&
          users.map(
            (user) =>
              currentUser?.id !== user.id && (
                <li key={user.id}>
                  <h3>ID: {user.id}</h3>
                  username: {user.username} <br />
                  avatar: {user.avatar} <br />
                  connected: {user.connected} <br />
                  <button
                    type="button"
                    onClick={() => handleClick("" + user.username)}
                  >
                    {" "}
                    Ajouter {user.username}
                  </button>
                  <a href={"/profil/" + user.id}>Lien vers le profil</a>
                </li>
              )
          )}
      </ul>
    </>
  );
};

export default AddPage;
