import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarRadioSelect from "./AvatarRadioSelect";

const FormSignin = () => {
  const navigate = useNavigate();
  const [qrLink, setQrLink] = useState<string | undefined>(undefined);
  const [user, setUser] = useState({
    username: "",
    password: "",
    avatar: "",
    twoFaEnable: false,
  });

  useEffect(() => {
    const getQRCode = async () => {
      await axios
        .get<string>("/api/qrcode")
        .then((response) => setQrLink(response.data))
        .finally(() => console.log(`QR CODE = ${qrLink}`));
    };
    getQRCode();
  }, [qrLink]);

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
          twoFaEnable: false,
        });
        console.log("response : " + response);
        console.log(`User Created + tfa: ${user.twoFaEnable}`);

        if (user.twoFaEnable) navigate("/twofa-verify");
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
      console.log("username state : " + user.username);
    } else if (e.target.name === "password") {
      setUser({ ...user, password: e.target.value });
    } else if (e.target.name === "avatar") {
      setUser({ ...user, avatar: e.target.value });
    } else if (e.target.name === "twoFaEnable") {
      setUser({ ...user, twoFaEnable: e.target.checked });
    }
  };

  // const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
  // 	console.log(`target.checked = ${e.target.checked}`)
  // 	// console.log(`target.value = ${e.target.value}`)
  // 	// console.log(`value check = ${check}`)
  // 	setUser({ ...user, twoFaEnable: e.target.checked });
  // 	console.log(`twoFaEnable: = ${user.twoFaEnable}`)
  // };

  return (
    <>
      <form className="min-w-fit w-96 flex flex-col" name="loginForm">
        {
          <>
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
              />
              <input
                type="password"
                name="password"
                className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
                placeholder="Mot de passe"
                onChange={(e) => onChangeForm(e)}
              />
              <div className="flex gap-3 items-center py-6">
                <input
                  type="checkbox"
                  id="twoFaEnable"
                  name="twoFaEnable"
                  onChange={(e) => onChangeForm(e)}
                />
                <label htmlFor="twoFaEnable" className="ml-2">
                  Activer la double authentification
                </label>
              </div>
              {user.twoFaEnable && (
                <div className="flex justify-center items-center py-6">
                  <img
                    src={qrLink}
                    alt="QR Code for Two-Factor Authentication"
                  />
                </div>
              )}
            </div>
          </>
        }
        <div className="flex flex-row mt-4 justify-between items-center">
          {
            <button
              type="button"
              onClick={() => createUser()}
              className="bg-white text-black py-2 px-4 rounded-md border border-white"
            >
              Terminer l'inscription
            </button>
          }
          <a href="/login" className="text-gray-400 hover:text-white">
            J'ai déjà un compte !
          </a>
        </div>
      </form>
    </>
  );
};

export default FormSignin;
