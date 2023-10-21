import axios from "axios";
import  { Navigate } from 'react-router-dom' 


const Postlogout = () => {
	axios
	.post("http://localhost:8000/api/logout")
	return (
		<div>
		<Navigate to="/" replace={true} />
		</div>
	);
}

export default Postlogout;
