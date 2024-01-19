import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User, UserRelation } from "../models/User";

type UserContextType = {
	userRelations: UserRelation[];
	user: User | null;
	loadingUser: boolean;
	loadingRelations?: boolean;
	addFriend: (username: string) => void;
	// removeFriend: (username: string) => void;
	// blockUser: (username: string) => void;
	// unblockUser: (username: string) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);

interface UserProviderProps {
	children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [connected, setConnected] = useState<boolean | null>(null); // [1
	const [user, setUser] = useState<User | null>(null);
	const [userRelations, setUserRelations] = useState<UserRelation[]>([]);
	const [loadingUser, setLoadingUser] = useState(true);
	const [loadingRelations, setLoadingRelations] = useState(true);

	const addFriend = async (username: string) => {
		try {
			const response = await axios.post("/api/friends/add/" + username);
			if (response.data === "Demande d'ami envoyé") {
				toast.success(`Friend request sent to ${username}`);
			} else {
				toast.success(`Friend request accepted from ${username}`);
			}
		} catch (error) {
			toast.error(`Failed to add friend:\n ${error}`);
		}
	};

	// const removeFriend = async (username: string) => {};
	// const blockUser = async (username: string) => {};
	// const unblockUser = async (username: string) => {};

	// verify if user is connected
	useEffect(() => {
		axios
			.get("/api/connected")
			.then((response) => setConnected(response.data))
			.catch((err) => {
				toast.error(err);
				setConnected(false);
			});
	}, []);

	// fetch user
	useEffect(() => {
		if (!connected) return;
		const fetchUser = async () => {
			setLoadingUser(true);
			try {
				const response = await axios.get("/api/my-name");
				setUser(response.data);
			} catch (error) {
				toast.error(`Failed to fetch user:\n ${error}`);
			}
			setLoadingUser(false);
		};
		fetchUser();
	}, [connected]);

	// fetch user relations
	useEffect(() => {
		if (!user) {
			return;
		}
		const fetchUserRelations = async () => {
			setLoadingRelations(true);
			try {
				const response = await axios.get<UserRelation[]>(
					"/api/friends/relations"
				);
				setUserRelations(response.data);
			} catch (error) {
				toast.error(`Failed to fetch user relations:\n ${error}`);
			}
			setLoadingRelations(false);
		};

		fetchUserRelations();
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				userRelations,
				user,
				loadingUser,
				loadingRelations,
				addFriend,
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
