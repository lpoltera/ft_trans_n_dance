import axios from "axios";
import { Navigate } from "react-router-dom";

const Postlogout = () => {
  axios.post("/api/logout");
  return (
    <div>
      <Navigate to="/" replace={true} />
    </div>
  );
};

export default Postlogout;
