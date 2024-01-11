import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Postlogout = () => {
	const navigate = useNavigate();

	axios.post("/api/logout")
		.then((res) => {
			console.log(res);
			navigate("/");
		})


	return (
		<div>
			{/* <Navigate to="/" replace={true} /> */}
		</div>
	);
};

export default Postlogout;
