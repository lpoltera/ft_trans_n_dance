import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../contexts/UserContext";

type PrivateRouteProps = {
	children: React.ReactNode;
};

let showAlert = true;

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const [connected, setConnected] = useState<null | boolean>(null);
	const { loadingUser } = useUserContext();

	useEffect(() => {
		axios
			.get("/api/connected")
			.then((response) => setConnected(response.data))
			.catch((err) => {
				toast.error(err);
				setConnected(false);
			});
	}, []);

	if (connected === null && loadingUser) {
		return null;
	}

	if (!connected && showAlert) {
		showAlert = false;
		alert("Sorry, you are not allowed to access this page");
		return <Navigate to="/" />;
	}
	if (!connected && !showAlert) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default PrivateRoute;
