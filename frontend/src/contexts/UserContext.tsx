import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../models/User";
import { Parties } from "../models/Game";
import axios from "axios";

type UserContextType = {
  user: User | null;
  loading: boolean;
  fetchUserFriends: () => Promise<User[] | null>;
  fetchUserGames: () => Promise<Parties[] | null>;
  fetchUserBlocked: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFriends = async () => {
    try {
      const response = await axios.get<User[]>(
        "/api/friends/all/" + user?.username
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user friends:", error);
      setLoading(false);
      return null;
    }
  };

  const fetchUserGames = async () => {
    try {
      const response = await axios.get<Parties[]>(
        "/api/game/user-history/" + user?.username
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user games:", error);
      return null;
    }
  };
  const fetchUserBlocked = async () => {}; // TODO

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/my-name");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        fetchUserFriends,
        fetchUserBlocked,
        fetchUserGames,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
}
