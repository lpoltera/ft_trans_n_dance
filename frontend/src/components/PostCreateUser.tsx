import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';


const PostUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
      username: '',
      password: '',
      avatar: '',
    })
    const createUser = async () => {
      await axios
      .post("http://localhost:8000/api/signup", 
      user,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        setUser({      
			username: '',
			password: '',
			avatar: '',
        })
        console.log(response)
        alert("User Created ");
        navigate('/');
        })
      .catch((err) => {
	  	if (err.response && err.response.data && err.response.data.message) {
		  const errorMessage = err.response.data.message;
		  return alert("Error: " + errorMessage);
		} else {
		  return alert("Error: " + err.message);
		}
      });
    }
    const onChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === 'username') {
        setUser({...user, username: e.target.value});
      } else if (e.target.name === 'password') {
        setUser({...user, password: e.target.value});
      } else if (e.target.name === 'avatar') {
        setUser({...user, avatar: e.target.value});
      }
  }
    return (
      <div >
          <div>
              <div>
              <h1>Create User</h1>
              <form>
                  <div>
                    <div>
                        <label>Username</label>
                        <input 
                          type="text" 
                          value={user.username}
                          onChange={(e) => onChangeForm(e)} 
                          name="username" 
                          id="username" 
                          placeholder="Username" 
                        />
                    </div>
          					<div>
          					  <label >Password</label>
          					  <input 
          						    type="password" 
          						    value={user.password}
          						    onChange={(e) => onChangeForm(e)} 
          						    name="password" id="password" 
          						    placeholder="Password" 
          						  />
          					</div>
          					<div>
          					  <label >Avatar</label>
          					  <input 
          						    type="text" 
          						    value={user.avatar}
          						    onChange={(e) => onChangeForm(e)} 
          						    name="avatar" id="avatar" 
          						    placeholder="Avatar" 
          						  />
          					</div>
                  </div>
                  <button type="button" onClick= {()=>createUser()}>Create</button>
              </form>
              </div>
          </div>
      </div>
      );
  };
  
  export default PostUser;