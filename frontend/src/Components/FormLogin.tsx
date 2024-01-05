import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const FormLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const loginUser = async (e: FormEvent) => {
    e?.preventDefault();
    await axios
      .post("/api/login", login, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const twoFaEnable = response.data.usertwoFA;
        console.log("session.twoFaEnable = ", response.data.usertwoFA);
        if (twoFaEnable === true) navigate("/twofa-verify");
        else {
          navigate("/accueil");
        }
      })
      .catch((err) => {
        setLogin({
          username: login.username,
          password: "",
        });
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
      <form
        className="min-w-fit w-96 flex flex-col border border-white rounded-md p-20 gap-4"
        name="loginForm"
        onSubmit={(e) => loginUser(e)}
      >
        <div>
          <h1 className="text-xl flex flex-col items-center pb-15">
            CONNEXION
          </h1>
        </div>
        <div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-10">
          <input
            type="text"
            id="username"
            value={login.username}
            name="username"
            className="border border-[#f67539] px-3 py-2 bg-transparent text-white rounded-md"
            placeholder="Pseudo"
            onChange={(e) => onChangeForm(e)}
          />
          <input
            type="password"
            value={login.password}
            name="password"
            id="password"
            className="border border-[#f67539] px-3 py-2 bg-transparent text-white rounded-md"
            placeholder="Mot de passe"
            onChange={(e) => onChangeForm(e)}
          />
        </div>
        <div className="flex flex-col mt-5 justify-between items-center">
          <button
            type="submit"
            className="py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539]"
          >
            Se connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default FormLogin;
