import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {

    console.log("PublicRoute called");
    const [connected, setConnected] = useState<null | boolean>(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/connected")
      .then((response) => setConnected(response.data))
      .catch((err) => {
        console.error(err);
        setConnected(false);
      });
  }, []);

  if (connected === null) {
    return null;
  }

  if (connected) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

export default PublicRoute;