import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const PostLogin = () => {
  const oauthLogin = () => {
    window.location.href = "/api/auth/school42";
  };
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const loginUser = async () => {
    await axios
      .post("http://localhost:8000/api/login", login, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setLogin({
          username: "",
          password: "",
        });
        console.log(response);
        navigate("/home");
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
    <div>
      <div>
        <div>
          <h1>Login</h1>
          <form>
            <div>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={login.username}
                  onChange={(e) => onChangeForm(e)}
                  name="username"
                  id="username"
                  placeholder="Username"
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={login.password}
                  onChange={(e) => onChangeForm(e)}
                  name="password"
                  id="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <button type="button" onClick={() => loginUser()}>
              Login
            </button>
          </form>
        </div>
        <div>
          <a href="http://localhost:8000/signup"> Créer un compte </a>
        </div>
        <div>
          <div>
            <button type="button" onClick={() => oauthLogin()}>
              Login 42
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLogin;
