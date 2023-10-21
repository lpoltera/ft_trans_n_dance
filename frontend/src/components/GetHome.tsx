import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  password: string;
  avatar: string;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user")
      .then((response) => setUser(response.data))
      .catch((err) => {
        console.error(err);
        // Redirection vers la page "/"
        navigate("/");
      });
  }, []);
  
	return (
	  <div>
		{<h1>Home {user?.username}</h1>}
		<a href="http://localhost:8000/logout">Déconnexion</a>
		<a href="http://localhost:8000/get">Liste d'utilisateurs</a>
	  </div>
	);
  };
  
export default Home;
