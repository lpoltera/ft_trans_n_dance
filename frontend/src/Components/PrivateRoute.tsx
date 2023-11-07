import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

type PrivateRouteProps = {
  children: React.ReactNode;
};

let showAlert = true;

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  console.log("PrivateRoute called");
  const [connected, setConnected] = useState<null | boolean>(null);

  useEffect(() => {
    axios
      .get("/api/connected")
      .then((response) => setConnected(response.data))
      .catch((err) => {
        console.error(err);
        setConnected(false);
      });
  }, []);

  if (connected === null) {
    return null;
  }
  console.log("show alert = " + showAlert);
  console.log("connection status = " + connected);

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
