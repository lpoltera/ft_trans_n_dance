import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarRadioSelect from "./AvatarRadioSelect";

const FormSignin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    avatar: "",
    twoFaEnable: "",
  });
  const createUser = async () => {
    await axios
      .post("http://localhost:8000/api/signup", user, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setUser({
          username: "",
          password: "",
          avatar: "",
          twoFaEnable: "",
        });
        console.log(response);
        console.log(`User Created + tfa: ${user.twoFaEnable}`);

        if (user.twoFaEnable === 'true')
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
      setUser({ ...user, username: e.target.value });
    } else if (e.target.name === "password") {
      setUser({ ...user, password: e.target.value });
    } else if (e.target.name === "avatar") {
      setUser({ ...user, avatar: e.target.value });
    } else if (e.target.name === "twoFaEnable") {
      setUser({ ...user, twoFaEnable: e.target.value });
    }
  };

  // const [logginSuccess, setLogginSuccess] = useState(true);
  
//   const auth42 = () => {
// 	window.location.href = "/api/auth/school42";
//   }

  return (
    <>
      <form className="min-w-fit w-96 flex flex-col" name="loginForm">
        {/* <div>
          <h1 className="text-xl">INSCRIPTION</h1>
        </div>
        <div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-4">
          <button
            type="button"
            className="py-4 px-6 border border-white flex flex-row justify-between items-center rounded-md"
			onClick={() => setLogginSuccess(!logginSuccess)}
            //  onClick={() => auth42()}
          >
            <span>Se connecter via 42</span>
            {logginSuccess ? (
              <span className="w-4 text-green-600">
                <CheckIcon />
              </span>
            ) : (
              <span className="w-4">
                <ArrowTopRightOnSquareIcon />
              </span>
            )}
          </button>
        </div> */}
        {/* {logginSuccess && ( */}
		{(
          <>
            {/* <div className="flex flex-col gap-6 border border-x-0 border-t-0 border-gray-400 py-4">
              <input
                type="text"
                name="username"
                className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
                placeholder="Pseudo"
              /> */}
              <div className="flex flex-row gap-4">
                <AvatarRadioSelect></AvatarRadioSelect>
              </div>
              <div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-4">
                <input
                  type="text"
                  name="username"
                  className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
                  placeholder="Pseudo"
                  onChange={(e) => onChangeForm(e)}
                  value={user.username}
                />
                <input
                  type="password"
                  name="password"
                  className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
                  placeholder="Mot de passe"
                  onChange={(e) => onChangeForm(e)}
                  value={user.password}
                />
                <div className="flex gap-3 items-center pt-4">
                  <input type="radio" id="twoFaEnable" name="twoFaEnable"onChange={(e) => onChangeForm(e)} value='true'/>
                  <label htmlFor="twoFaEnable">Activer la double authentification</label>
                </div>
              </div>
            {/* </div> */}
          </>
        )}
        <div className="flex flex-row mt-4 justify-between items-center">
          {/* {logginSuccess && ( */}
		  {(
            <button
              type="button"
              onClick={() => createUser()}
              className="bg-white text-black py-2 px-4 rounded-md border border-white"
            >
              Terminer l'inscription
            </button>
          )}
          <a href="/login" className="text-gray-400 hover:text-white">
            J'ai déjà un compte !
          </a>
        </div>
      </form>
    </>
  );
};

export default FormSignin;
