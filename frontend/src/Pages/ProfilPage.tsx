import {
	CheckIcon,
	NoSymbolIcon,
	PencilSquareIcon,
	UserMinusIcon,
	UserPlusIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FooterMain from "../Components/FooterMain";
import HistoryMatchRow from "../Components/HistoryMatchRow";
import IconButton from "../Components/IconButton";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import StatRow from "../Components/StatRow";
import Tab from "../Components/Tab/Tab";
import TabContainer from "../Components/Tab/TabContainer";
import TabList from "../Components/Tab/TabList";
import TabPanel from "../Components/Tab/TabPanel";
import UserRow from "../Components/UserRow";
import { useUserContext } from "../contexts/UserContext";
import { GameStatsProps, Parties } from "../models/Game";
import { User, UserRelation } from "../models/User";
import { useNotificationContext } from "../contexts/NotificationContext";
import { toast } from "react-toastify";
import AvatarRadioSelect from "../Components/AvatarRadioSelect";

interface Form {
	avatar: string;
	username: string | null;
	password: string | null;
}

const ProfilPage = () => {
	const { userRelations, user } = useUserContext();
	const [passwordConfirmed, setPasswordConfirmed] = useState(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userGames, setUserGames] = useState<Parties[] | null>(null);
	const [userFriends, setUserFriends] = useState<User[] | null>(null);
	const [relationStatus, setRelationStatus] = useState<string>("none");
	const [userStats, setUserStats] = useState<GameStatsProps[]>([]); // TODO: type this
	const navigate = useNavigate();
	const [isMyProfile, setIsMyProfile] = useState(false);
	const [isMyFriend, setIsMyFriend] = useState(false);
	const [showEditAccountModal, setEditAccountModal] = useState(false);
	const [update, setUpdate] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [form, setForm] = useState<Form>({
		avatar: "",
		username: null,
		password: null,
	});
	const { socket } = useNotificationContext();

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const img = event.target.files[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setForm({ ...form, avatar: result });
				console.log("imgs = ", result);
			};

			reader.readAsDataURL(img);
		}
	};

	const url = window.location.href; // Obtient l'URL actuelle
	const urlSegments = url.split("/"); // Divise l'URL en segments
	let idURL: string | any = urlSegments[urlSegments.length - 1];
	console.log("idURL = ", idURL);

	useEffect(() => {
		async function fetchCurrent() {
			try {
				const friends = await axios.get<UserRelation[]>(
					"/api/friends/relations"
				);
				const response = await axios.get<User>("/api/my-name");
				console.log("my name = ", response.data.username);
				if (idURL === "profil" || idURL === "") {
					idURL = response.data.username;
					setIsMyProfile(true);
				} else {
					const friend = friends.data.find(
						(relation) => relation.friend.username === idURL
					);
					if (friend) {
						setRelationStatus(friend.status);
						setIsMyFriend(true);
						setIsMyProfile(false);
						console.log("friend found");
					} else {
						console.log("friend not found");
						setIsMyFriend(false);
					}
				}
				console.log("idURL = ", idURL);
				return idURL;
			} catch (err) {
				console.error(err);
				return null;
			}
		}

		async function fetchUserAndFriend() {
			let name = await fetchCurrent();
			console.log("name in fetchUserAndFriend =", name);
			if (name) {
				try {
					console.log("name before api request : ", name);
					const [userResponse, friendResponse, gamesResponse] =
						await Promise.all([
							axios.get<User>("/api/" + name),
							axios.get<User[]>("/api/friends/all/" + name),
							axios.get<Parties[]>("/api/game/user-history/" + name),
						]);
					setCurrentUser(userResponse.data);
					setUserFriends(friendResponse.data);
					setUserGames(gamesResponse.data);
					name = null;
				} catch (err) {
					navigate("/404");
				}
			}
		}
		fetchUserAndFriend();
	}, [idURL, update]);

	const updateAccountSettings = async () => {
		console.log("password = ", form.password);
		if (form.password !== null && passwordConfirmed === false) {
			return alert("Les mots de passe ne correspondent pas");
		}
		if (update === false) setUpdate(true);
		else setUpdate(false);
		// useEffect(() => {
		console.log("form.username : " + form.username);
		console.log("form.password : " + form.password);
		console.log("form.avatar : " + form.avatar);
		// await axios.patch('api/' + user?.username, form, {

		await axios
			.patch("api/" + currentUser?.username, form, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Cache-Control": "no-cache",
				},
			})
			.then((response) => {
				setForm({
					avatar: "",
					username: null,
					password: null,
				});
				setEditAccountModal(false);
				setCurrentUser(response.data);
				console.log("response : " + response.data);
			})
			.catch((err) => {
				if (err.response && err.response.data && err.response.data.message) {
					const errorMessage = err.response.data.message;
					return alert("Error: " + errorMessage);
				} else {
					return alert("Error: " + err.message);
				}
			});
		// }, [user?.username]);
	};

	const editProfil = () => {
		setEditAccountModal(true);
	}; // TODO modal -> axios.patch update

	const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.name === "avatar") {
			setForm({ ...form, avatar: event.target.value });
		}
		if (event.target.name === "username") {
			setForm({ ...form, username: event.target.value });
			if (event.target.value === "") {
				setForm({ ...form, username: null });
			}
		}
		if (event.target.name === "password") {
			setForm({ ...form, password: event.target.value });
			if (event.target.value === "") {
				setForm({ ...form, password: null });
			}
			console.log(form.password)
		} if (event.target.name === "confirmPassword") {
			if (event.target.value === form.password) {
				setPasswordConfirmed(true);
			} else {
				setPasswordConfirmed(false);
			}
		}
	};

	const deleteAccount = async () => {
		if (window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
			await axios.delete("/api/" + currentUser?.username);
			navigate("/login");
		}
	};

	const clearForm = () => {
		setForm({
			avatar: "",
			username: null,
			password: null,
		});
		setEditAccountModal(false);
	};

	const handleBlockedListChange = async () => { // -> handleChange
		if (update) {
			setUpdate(false)
		} else {
			setUpdate(true)
		}
	}


	const addFriend = async () => {
		console.log("send notif");
		if (socket) {
			socket.emit("sendFriendNotif", {
				sender: user?.username,
				receiver: currentUser?.username,
				message: `Tu as reçu une demande d'ami de ${user?.username}`,
			});
		}
		toast("Demande d'ami envoyée !");
	};

	const removeFriend = async () => {
		try {
			await axios.delete('api/friends/' + currentUser?.username)
		} catch (error) {
			console.log("Erreur lors de la suppression de l'ami")
		}
	}



	const unblockUser = async () => {
		await axios.patch("https://localhost:8000/api/friends/" + currentUser?.username, { status: "valider" });
		handleBlockedListChange();
	};

	const blockUser = async () => {
		const isConfirmed = window.confirm(
			"Êtes-vous sûr de vouloir bloquer cet utilisateur?"
		);
		if (isConfirmed) {
			await axios.patch("https://localhost:8000/api/friends/" + currentUser?.username, { status: "blocked" });
			// setIsBlocked(true);
		}
	};

	const handleAvatarChange = (avatar: string) => {
		setForm({
			...form,
			avatar,
		});
	};

	return (
		<>
			<Navbar />
			<PageLayout>
				<div className="w-full h-full grow flex flex-col gap-12">
					<div className="flex w-full gap-10 justify-start items-center">
						<div className="flex shrink gap-4 items-center">
							<img
								src={currentUser?.avatar}
								alt="Profile picture"
								className="w-16 h-16 rounded-full"
							/>
							<div className="flex flex-col gap-1 pt-1">
								<h1 className="text-3xl leading-none">
									{currentUser?.username}
								</h1>
								<span className="text-neutral-400 text-md">
									{currentUser?.connected}
								</span>
							</div>
						</div>
						<div className="flex gap-0 items-center">
							{isMyProfile ? (
								<IconButton
									onClick={editProfil}
									icon={<PencilSquareIcon />}
									classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
									tooltip="Modifier le profil"
									tooltipId="editProfil"
								/>
							) : (
								<>
									{isMyFriend ? (
										<IconButton
											icon={<UserMinusIcon />}
											classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
											onClick={removeFriend}
											tooltip="Supprimer de la liste d'amis"
											tooltipId="removeFriend"
										/>
									) : (
										<IconButton
											icon={<UserPlusIcon />}
											classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
											onClick={addFriend}
											tooltip="Ajouter en ami"
											tooltipId="addFriend"
										/>
									)}
									{isMyFriend &&
										(relationStatus === "blocked" ? (
											<IconButton
												icon={<CheckIcon />}
												classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
												onClick={unblockUser}
												tooltip="Débloquer"
												tooltipId="unblockUser"
											/>
										) : (
											<IconButton
												onClick={blockUser}
												icon={<NoSymbolIcon />}
												classCustom="w-10 h-10 p-2 rounded-md hover:bg-neutral-800"
												tooltip="Bloquer"
												tooltipId="blockUser"
											/>
										))}
								</>
							)}
						</div>
					</div>

					{/* [Main Modal] Update Profile Page */}
					{showEditAccountModal && (
						<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
							<div className="relative p-8  rounded-md shadow-lg bg-neutral-800">
								<h3 className="text-2xl font-semibold text-center">
									Editer le profil
								</h3>
								<form
									name="createTournamentForm"
									className="flex flex-col items-center"
								>
									{/* <div className="relative group w-16 h-16 flex items-center m-5">
										<img
											src={form.avatar ? form.avatar : currentUser?.avatar}
											alt="Profile picture to update"
											className="rounded-full absolute"
										/>
									</div> */}
									<div className="flex flex-row gap-4 mb-10 mt-10">
										<AvatarRadioSelect
											onChange={handleAvatarChange}
										></AvatarRadioSelect>
									</div>
									{/* <div> */}
									{/* <span
											className="block w-full text-sm text-white-500 bg-cyan-700 py-2 px-4 rounded-md hover:bg-[#f67539] 
												file:mr-4 file:py-2 file:px-4
												file:rounded-full file:border-0
												file:text-sm file:font-semibold
												file:bg-violet-50 file:text-violet-700
												hover:file:bg-violet-100
												cursor-pointer"
											onClick={() => {
												// Déclenchez un clic sur l'élément d'entrée lorsque le span est cliqué
												fileInputRef.current?.click();
											}}
										>
											Modifier
										</span> */}
									{/* <input
											type="file"
											className="hidden"
											onChange={handleImageUpload}
											ref={fileInputRef}
										/> */}
									{/* </div> */}

									<label>
										{/* <span className="block text-sm font-medium text-slate-400">
											Pseudo
										</span> */}
										<input
											type="text"
											className=" border-2 border-[#f67539] bg-transparent rounded-md mt-1 mb-3 custom-input"
											id="username"
											name="username"
											placeholder="Pseudo"
											onChange={handleFormChange}
										/>
									</label>

									<label>
										{/* <span className="block text-sm font-medium text-slate-400">
											Mot de passe
										</span> */}
										<input
											type="password"
											className="border-2 border-[#f67539] bg-transparent rounded-md mt-1 mb-3 custom-input"
											id="password"
											name="password"
											placeholder="Mot de passe"
											onChange={handleFormChange}
										/>
									</label>

									<label>
										{/* <span className="block text-sm font-medium text-slate-400">
											Confirmer le mot de passe
										</span> */}
										<input
											type="password"
											className={`border-2 border-[#f67539] bg-transparent rounded-md mt-1 mb-3 custom-input ${passwordConfirmed ? "text-white border-[#f67539]" : "custom-input-confirm"}`}
											id="confirmPassword"
											name="confirmPassword"
											placeholder="Confirmer le mot de passe"
											onChange={handleFormChange}
										/>
									</label>

									<div className="flex flex-col text-sm">
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-cyan-700 text-white rounded-md hover:bg-[#f67539] cursor-pointer"
											onClick={() => updateAccountSettings()}
										>
											Enregistrer les modifications
										</button>
										<button
											type="button"
											className="mt-3 py-2 px-4 bg-gray-400  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
											onClick={() => clearForm()}
										>
											Annuler
										</button>
										<div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-4">
										</div>
										<button
											type="button"
											className=" mt-8 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-800 cursor-pointer"
											onClick={() => deleteAccount()}
										>
											Supprimer le compte
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
					{/* End Modal */}

					<div className="grow">
						{relationStatus === "blocked" && !isMyProfile ? (
							<div>Débloquez le joueur pour voir son profil</div>
						) : (
							<TabContainer>
								<TabList classCustom="pb-4 mb-8 flex gap-6 border border-neutral-400 border-r-0 border-l-0 border-t-0 overflow-auto whitespace-nowrap">
									<Tab
										index={0}
										classActive="text-xl text-white"
										classInactive="text-xl text-neutral-400 hover:text-white"
									>
										Statistiques
									</Tab>
									<>
										<Tab
											index={1}
											classActive="text-xl text-white"
											classInactive="text-xl text-neutral-400 hover:text-white"
										>
											Historiques de parties
										</Tab>
										<Tab
											index={2}
											classActive="text-xl text-white"
											classInactive="text-xl text-neutral-400 hover:text-white"
										>
											Amis
										</Tab>
									</>
									{/* )} */}
									{isMyProfile && (
										<>
											<Tab
												index={3}
												classActive="text-xl text-white"
												classInactive="text-xl text-neutral-400 hover:text-white"
											>
												Invitations
											</Tab>
											<Tab
												index={4}
												classActive="text-xl text-white"
												classInactive="text-xl text-neutral-400 hover:text-white"
											>
												Bloqués
											</Tab>
										</>
									)}
								</TabList>
								<TabPanel index={0}>
									<div className="flex flex-col gap-6">
										{userStats?.map((stat, index) => (
											<StatRow
												key={index}
												title={stat.title}
												value={stat.value || 0}
											/>
										))}
									</div>
								</TabPanel>
								<>
									<TabPanel index={1}>
										{!(userGames === undefined || userGames?.length === 0) ? (
											<>
												<div className="overflow-hidden border border-cyan-700 rounded-xl">
													<div className="grid grid-flow-col grid-cols-5 text-md text-center sticky py-2 border border-t-0 border-r-0 border-l-0 border-cyan-700 bg-cyan-700">
														<div className="pl-4">Joueur 1</div>
														<div className="pl-4">Joueur 2</div>
														<div className="pl-4">Score</div>
														<div className="pl-4">Date</div>
														<div className="pl-4">Status</div>
													</div>
													{userGames &&
														userGames.map((partie, index) => (
															<HistoryMatchRow key={index} partie={partie} />
														))}
												</div>
											</>
										) : (
											<div>{`Aucune partie joué pour le moment.`}</div>
										)}
									</TabPanel>
									<TabPanel index={2}>
										{isMyProfile ? (
											<div className="flex flex-col gap-1">
												{userRelations?.map(
													(relation, index) =>
														relation.status === "valider" && (
															<UserRow
																key={index}
																selectedUser={relation.friend}
																isMyProfile={true}
																relationStatus={relation.status}
																handleBlockedListChange={handleBlockedListChange}
															/>
														)
												)}
											</div>
										) : (
											<div className="flex flex-col gap-1">
												{userFriends?.map((relation, index) => (
													<UserRow
														key={index}
														selectedUser={relation}
														isMyProfile={false}
														relationStatus={null}
														handleBlockedListChange={handleBlockedListChange}
													/>
												))}
											</div>
										)}
									</TabPanel>
								</>
								{/* )} */}
								{isMyProfile && (
									<>
										<TabPanel index={3}>
											<div className="flex flex-col gap-1">
												<div className="ml-2 mb-4">Reçues</div>
												{userRelations?.map(
													(relation, index) =>
														relation.status === "pending" &&
														relation.sender !== currentUser?.username && (
															<UserRow
																key={index}
																selectedUser={relation.friend}
																isMyProfile={true}
																relationStatus={relation.status}
																handleBlockedListChange={handleBlockedListChange}
															/>
														)
												)}
												<div className="ml-2 my-4">Envoyées</div>
												{userRelations?.map(
													(relation, index) =>
														relation.status === "pending" &&
														relation.sender === currentUser?.username && (
															<UserRow
																key={index}
																selectedUser={relation.friend}
																isMyProfile={true}
																relationStatus={relation.status}
																handleBlockedListChange={handleBlockedListChange}
															/>
														)
												)}
											</div>
										</TabPanel>
										<TabPanel index={4}>
											<div className="flex flex-col gap-1">
												{userRelations?.map(
													(relation, index) =>
														relation.status === "blocked" && (
															<UserRow
																key={index}
																selectedUser={relation.friend}
																isMyProfile={true}
																relationStatus={relation.status}
																handleBlockedListChange={handleBlockedListChange}
															/>
														)
												)}
											</div>
										</TabPanel>
									</>
								)}
							</TabContainer>
						)}
					</div>
				</div>
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default ProfilPage;
