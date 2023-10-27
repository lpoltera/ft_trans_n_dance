import { useState, useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import PageLayout from "./PageLayout";

type PublicRouteProps = {
  children: ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
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
    return <PageLayout>Loading…</PageLayout>;
  }

  if (connected) {
    return <Navigate to="/accueil" />;
  }

  return <>{children}</>;
};

export default PublicRoute;
