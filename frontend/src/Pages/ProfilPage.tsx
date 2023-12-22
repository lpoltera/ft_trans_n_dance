import {
	CheckIcon,
	NoSymbolIcon,
	PencilSquareIcon,
	UserMinusIcon,
	UserPlusIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
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

const ProfilPage = () => {
	const { user, userRelations } = useUserContext();
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userGames, setUserGames] = useState<Parties[] | null>(null);
	const [userFriends, setUserFriends] = useState<User[] | null>(null);
	const [relationStatus, setRelationStatus] = useState<string>("none");
	const [userStats, setUserStats] = useState<GameStatsProps[]>([]); // TODO: type this
	const navigate = useNavigate();
	const [isMyProfile, setIsMyProfile] = useState(false);
	const [isMyFriend, setIsMyFriend] = useState(false);
	const [showEditAccountModal, setEditAccountModal] = useState(false);
	const [form, setForm] = useState({
		id: 0,
		username: "",
		avatar: "",
		password: ""
	});

	const url = window.location.href; // Obtient l'URL actuelle
	const urlSegments = url.split("/"); // Divise l'URL en segments
	let idURL: string | any = urlSegments[urlSegments.length - 1];

	useEffect(() => {
		async function fetchCurrent() {
			try {
				const friends = await axios.get<UserRelation[]>("/api/friends/relations");
				const response = await axios.get<User>("/api/my-name");
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
						console.log("friend found")
					} else {
						console.log("friend not found")
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
			const name = await fetchCurrent();
			console.log("name in fetchUserAndFriend =", name);
			if (name) {
				try {
					const [userResponse, friendResponse, gamesResponse] =
						await Promise.all([
							axios.get<User>("/api/" + name),
							axios.get<User[]>("/api/friends/all/" + name),
							axios.get<Parties[]>("/api/game/user-history/" + name),
						]);
					setCurrentUser(userResponse.data);
					setUserFriends(friendResponse.data);
					setUserGames(gamesResponse.data);
				} catch (err) { }
			}
		}
		fetchUserAndFriend();
	}, [idURL]);


	// try to update fields
	const updateAccountSettings = async () => {
		console.log("Profil mis à jour avec succès :");
	  };
	  
	// const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	// console.log("handleFormChange called", event.target.value)
	// 	if (event.target.name === "name") {
	// 		setForm({ ...form, name: event.target.value });
	// 	} else if (event.target.name === "difficulty") {
	// 		setForm({ ...form, difficulty: event.target.value });
	// 	} else if (event.target.name === "mode") {
	// 		setForm({ ...form, mode: event.target.value });
	// 	} else if (event.target.name === "power_ups") {
	// 		setForm({ ...form, power_ups: event.target.checked });
	// 	} else if (event.target.name === "participants") {
	// 		if (event.target.checked) {
	// 			let checkboxValue = event.target.value;
	// 			console.log(`Participant ${checkboxValue} added`);
	// 			setForm({ ...form, participants: [...form.participants, checkboxValue] });
	// 		} else {
	// 			let checkboxValue = event.target.value;
	// 			if (checkboxValue !== user?.username) {
	// 				console.log(`Particiapnt ${checkboxValue} removed`);
	// 			}
	// 			setForm({ ...form, participants: form.participants.filter((participant) => participant !== checkboxValue) });
	// 		}
	// 	}
	// };

	const editProfil = () => {
		setEditAccountModal(true)
	};		// TODO modal -> axios.patch update
	const addFriend = () => { };		// TODO à copier
	const removeFriend = () => { };	// TODO à créer ?
	const blockUser = () => { };		// TODO à copier
	const unblockUser = () => { };	// TODO à copier

	return (
		<>
			<Navbar />
			<PageLayout>
				<div className="w-full h-full grow flex flex-col gap-12">
					<div className="flex w-full gap-10 justify-start items-center bg-red-500">
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
									{isMyFriend && (
										relationStatus === "blocked" ? (
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
										)
									)}
								</>
							)}
						</div>
					</div>

					{/* [Main Modal] Update Profile Page */}
					{showEditAccountModal && (
										<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
											<div className="relative p-8 bg-grey w-full max-w-md mx-auto rounded-md shadow-lg bg-neutral-800">
												<div className="flex flex-col space-y-4">
													<h3 className="text-2xl font-semibold text-center mb-4">Editer le profil</h3>
													<form name="createTournamentForm" className="flex flex-col items-center">
														<div className="cursor-pointer flex flex-wrap justify-center items-center content-center">
															<img
																src={currentUser?.avatar}
																alt="Profile picture to update"
																className="relative w-16 h-16 rounded-full hover:opacity-30 transition"
															/>
															<div className="transition text-xs ">John Doe</div>
														</div>

														<label>
															<span className="block text-sm font-medium text-slate-400">Pseudo</span>
															<input
																type="text"
																className="bg-transparent rounded-md mt-1 mb-3"
																id="username"
																name="username"
																placeholder="Pseudo"
																// onChange={handleFormChange}
															/>
														</label>

														<label>
															<span className="block text-sm font-medium text-slate-400">Mot de passe</span>
															<input
																type="text"
																className="bg-transparent rounded-md mt-1 mb-3"
																id="password"
																name="password"
																placeholder="Mot de passe"
																// onChange={handleFormChange}
															/>
														</label>

														<div className="flex gap-4 text-sm">
															<button
																type="button"
																className="mt-5 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-800 cursor-pointer"
																onClick={() => updateAccountSettings()}
															>
																Enregistrer les modifications
															</button>
															<button
																type="button"
																className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
																onClick={() => setEditAccountModal(false)}
															>
																Annuler
															</button>
															<button
																type="button"
																className="mt-5 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-800 cursor-pointer"
																onClick={() => deleteAccount()}
															>
																Supprimer le compte
															</button>
														</div>
													</form>
												</div>
											</div>
										</div>
									)}
									{/* End Modal */}



					<div className="grow">
						{relationStatus === "blocked" ? (
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
																user={relation.friend}
																isMyProfile={true}
															/>
														)
												)}
											</div>
										) : (
											<div className="flex flex-col gap-1">
												{userFriends?.map((relation, index) => (
													<UserRow
														key={index}
														user={relation}
														isMyProfile={false}
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
														relation.sender !== user?.username && (
															<UserRow
																key={index}
																user={relation.friend}
																isMyProfile={true}
															/>
														)
												)}
												<div className="ml-2 my-4">Envoyées</div>
												{userRelations?.map(
													(relation, index) =>
														relation.status === "pending" &&
														relation.sender === user?.username && (
															<UserRow
																key={index}
																user={relation.friend}
																isMyProfile={true}
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
																user={relation.friend}
																isMyProfile={true}
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
