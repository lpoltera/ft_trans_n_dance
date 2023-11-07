import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const FormLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const loginUser = async () => {
    await axios
      .post("/api/login", login, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setLogin({
          username: "",
          password: "",
        });
        const session = response.data.session;
        console.log("session.twoFaEnable = ", session.twoFaEnable);
        if (session.twoFaEnable === true) 
          navigate("/twofa-verify");
        else {
          navigate("/accueil");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          const errorMessage = err.response.data.message;
          return alert("Error: " + errorMessage);
        } else {
          return alert("Error: " + err.message);
        }
      });
  };
  const onChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "username") {
      setLogin({ ...login, username: e.target.value });
    } else if (e.target.name === "password") {
      setLogin({ ...login, password: e.target.value });
    }
  };
  return (
    <>
      <form className="min-w-fit w-96 flex flex-col" name="loginForm">
        <div>
          <h1 className="text-xl">CONNEXION</h1>
        </div>
        <div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-4">
          <input
            type="text"
            id="username"
            value={login.username}
            name="username"
            className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
            placeholder="Pseudo"
            onChange={(e) => onChangeForm(e)}
          />
          <input
            type="password"
            value={login.password}
            name="password"
            id="password"
            className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
            placeholder="Mot de passe"
            onChange={(e) => onChangeForm(e)}
          />
        </div>
        <div className="flex flex-row mt-4 justify-between items-center">
          <button
            type="button"
            onClick={() => loginUser()}
            className="bg-white text-black py-2 px-4 rounded-md border border-white"
          >
            Se connecter
          </button>
          <a href="/forgot-password" className="text-gray-400 hover:text-white">
            mot de passe oublié ?
          </a>
        </div>
      </form>
    </>
  );
};

export default FormLogin;
