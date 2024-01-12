import React, { useState, ChangeEvent, useEffect } from "react";
import Navbar from "../Components/Navbar";
import PageLayout from "../Components/PageLayout";
import TournamentsListItem from "../Components/Tournament/TournamentsListItem";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import FooterMain from "../Components/FooterMain";
import TabList from "../Components/Tab/TabList";
import TabPanel from "../Components/Tab/TabPanel";
import HistoryMatchRow from "../Components/HistoryMatchRow";
import { TournamentGameProps, RankingProps } from "../models/Game";
import RankingPlayersRow from "../Components/RankingPlayerRow";
import "./TournamentPage.css";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import GamePageTournament from "./GamePageTournament";

const TournamentsPage: React.FC = () => {
	const navigate = useNavigate();
	const [update, setUpdate] = useState<boolean>(false);
	const { user, userRelations } = useUserContext();
	// const { socket } = useNotificationContext();
	const [tournaments, setTournaments] = useState<string[][]>([]);
	const [showCreateTournamentModal, setCreateTournamentModal] = useState(false);
	const [selectedTournament, setSelectedTournament] = useState<string | null>(
		null
	);
	const [tournamentGames, setTournamentGames] = useState<
		TournamentGameProps[] | any
	>();
	const [form, setForm] = useState<TournamentGameProps>({
		id: 0,
		name: "",
		name_p1: "",
		name_p2: "",
		score_p1: 0,
		score_p2: 0,
		updated_at: "",
		participants: [],
		difficulty: "facile",
		mode: "1972",
		mode_value: 0,
		power_ups: false,
		tournament_creator: "",
		status: "pending",
	});
	const [ranking, setRanking] = useState<RankingProps[] | any>();

	const handleStatsButtonClick = async (tournamentName: string) => {
		console.log("Tournament selected : ", tournamentName);
		const games = await axios.get<TournamentGameProps[]>(
			`/api/tournaments/games/${tournamentName}`
		);
		const tmp = await axios.get<RankingProps[]>(
			`/api/tournaments/ranking/${tournamentName}`
		);
		setTournamentGames(games.data);
		setRanking(tmp.data);
		// setSelectedTournament((prevTournament) =>
		//   prevTournament === tournamentName ? null : tournamentName
		// );
		setSelectedTournament((prevTournament) => (prevTournament === tournamentName ? null : tournamentName));
		// setSelectedTournament(true);
		console.log("Tournament games : ", games.data);
	};

	useEffect(() => {
		const fetchTournaments = async () => {
			try {
				const response = await axios.get("/api/tournaments/all");
				setTournaments(response.data);
				console.log("response.data : ", response.data);
				console.log("Tournaments name : ", tournaments);
			} catch (error) {
				console.error("Erreur lors de la récupération des tournois :", error);
			}
		};
		fetchTournaments();
	}, [update]);

	const createTournament = async () => {
		for (let i = 0; i < tournaments.length; i++) {
			if (form.name === tournaments[i][0]) {
				window.alert(`Ce nom de tournoi est déjà utilisé`);
				console.log("Tournoi déjà existant");
				setForm({ ...form, name: "" });
				return;
			}
		}
		if (form.name.length < 3 || form.name.length > 20) {
			window.alert(`Le nom du tournoi doit contenir entre 3 et 20 caractères`);
			return;
		}
		if (form.participants.length < 2 || form.participants.length > 8) {
			window.alert(`Le nombre de participants doit être compris entre 3 et 8`);
			return;
		}
		setCreateTournamentModal(false);
		localStorage.setItem("canAccessTournament", "true");
		console.log("localStorage in Tournament Page : ", localStorage.getItem("canAccessTournament"));
		if (user) {
			const newTournament: TournamentGameProps = {
				...form,
				participants: [...form.participants, user.username],
				tournament_creator: user.username,
			};
			setTournaments([...tournaments, [newTournament.name, user.username]]);
			// console.log("Afficher name : " + newTournament.name);
			// console.log("Afficher participants : " + newTournament.participants);
			// console.log("Afficher difficulty : " + newTournament.difficulty);
			// console.log("Afficher mode : " + newTournament.mode);
			// console.log("Afficher power_ups : " + newTournament.power_ups);
			// console.log("Afficher creator : " + newTournament.tournament_creator);
			// console.log("Afficher mode_value : " + newTournament.mode_value);
			try {
				await axios.post("/api/tournaments/create", newTournament, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				const nextId = await axios.get(
					"https://localhost:8000/api/tournaments/next_game/" +
					newTournament?.name
				);

				console.log("Tournoi enregistré avec succès dans la base de données.");
				// sendNotifToParticipants(games.data);
				// return <GamePageTournament id={nextId} />;
				navigate("/tournaments/" + nextId.data);
			} catch (error) {
				console.error("Erreur lors de l'enregistrement du tournoi :", error);
			}
		}
	};

	const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
		// console.log("handleFormChange called", event.target.value)
		if (event.target.name === "name") {
			setForm({ ...form, name: event.target.value });
		} else if (event.target.name === "difficulty") {
			setForm({ ...form, difficulty: event.target.value });
		} else if (event.target.name === "mode") {
			setForm({ ...form, mode: event.target.value });
		} else if (event.target.name === "power_ups") {
			setForm({ ...form, power_ups: event.target.checked });
		} else if (event.target.name === "mode_value") {
			console.log("set mode value ", +event.target.value);
			setForm({ ...form, mode_value: +event.target.value });
		} else if (event.target.name === "participants") {
			if (event.target.checked) {
				let checkboxValue = event.target.value;
				console.log(`Participant ${checkboxValue} added`);
				setForm({
					...form,
					participants: [...form.participants, checkboxValue],
				});
			} else {
				let checkboxValue = event.target.value;
				if (checkboxValue !== user?.username) {
					console.log(`Particiapnt ${checkboxValue} removed`);
				}
				setForm({
					...form,
					participants: form.participants.filter(
						(participant) => participant !== checkboxValue
					),
				});
			}
		}
	};

	const handleTournamentListChange = async () => {
		// -> handleChange
		if (update) {
			setUpdate(false);
		} else {
			setUpdate(true);
		}
	};

	// const sendNotifToParticipants = async (tournamentGames: TournamentGameProps[]) => {
	// 	console.log("tournamentGames : ", tournamentGames);
	// 	console.log("tournamentGames length : ", tournamentGames.length);
	// 	for (let i = 0; i < tournamentGames.length; i++) {
	// 		console.log(`tournamentGames[${i}].name_p1 : `, tournamentGames[i].name_p1);
	// 		console.log(`tournamentGames[${i}].name_p2 : `, tournamentGames[i].name_p2);
	// 		// for (let j = 0; j < 2; j++) {
	// 		// 	if (j === 0) {
	// 		// user !== tournamentGames[i].name_p1
	// 		const message1 = {
	// 			sender: tournamentGames[i].tournament_creator,
	// 			receiver: tournamentGames[i].name_p1,
	// 			text: `${tournamentGames[i].name_p1} on t'attend pour ton match contre ${tournamentGames[i].name_p2} !`,
	// 		}
	// 		socket?.emit("sendMessage", message1);
	// 		// } else {
	// 		// user !== tournamentGames[i].name_p2
	// 		const message2 = {
	// 			sender: tournamentGames[i].tournament_creator,
	// 			receiver: tournamentGames[i].name_p2,
	// 			text: `${tournamentGames[i].name_p2} on t'attend pour ton match contre ${tournamentGames[i].name_p1} !`,
	// 		}
	// 		socket?.emit("sendMessage", message2);
	// 		// }
	// 	}
	// }

	const updatedUserRelations = [...userRelations, { friend: user }];

	return (
		<>
			<Navbar />
			<PageLayout>
				<h1 className="text-xl mb-4">Liste des tournois</h1>
				<main>
					<div className="w-1/3 h-250">
						<button
							className="bg-[#f67539] hover:bg-cyan-700 rounded-md p-3 mb-5"
							onClick={() => setCreateTournamentModal(true)}
						>
							Ajouter un nouveau tournois
						</button>
					</div>
				</main>
				{tournaments && tournaments.length !== 0 && user && (
					<div className="flex flex-container justify-between rounded-md items-start">
						<div className="bg-cyan-950 shrink-0 min-w-min rounded-md">
							<TabList classCustom="py-2 w-full overflow-auto flex flex-col h-full">
								{tournaments.map((tournamentName, index) => (
									<TournamentsListItem
										key={index}
										tournoi={tournamentName}
										handleStatsButtonClick={handleStatsButtonClick}
										handleTournamentListChange={handleTournamentListChange}
										username={user.username}
										selectedTournament={selectedTournament}
									/>
								))}
							</TabList>
						</div>
						<div className="w-full ml-4">
							<TabPanel index={0}>
								{selectedTournament && (
									<>
										<h2 className="text-xl mb-4">Liste des matches</h2>
										<div className="overflow-hidden border border-cyan-700 rounded-xl">
											<div className="min-w-min grid grid-flow-col grid-cols-5 text-md text-center sticky py-2 border border-t-0 border-r-0 border-l-0 border-cyan-700 bg-cyan-700">
												<div className="pl-4">Joueur 1</div>
												<div className="pl-4">Joueur 2</div>
												<div className="pl-4">Score</div>
												<div className="pl-4">Date</div>
												<div className="pl-4">Status</div>
											</div>
											{tournamentGames &&
												tournamentGames.map(
													(partie: TournamentGameProps, index: number) => (
														<HistoryMatchRow key={index} partie={partie} />
													)
												)}
										</div>
									</>
								)}
							</TabPanel>
						</div>
						<div className="w-full ml-4">
							<TabPanel index={0}>
								{selectedTournament && (
									<>
										<h2 className="text-xl mb-4">Classement du tournoi</h2>
										<div className="overflow-hidden border border-cyan-700 rounded-xl">
											<div className="min-w-min grid grid-flow-col grid-cols-6 text-md text-center sticky py-2 border border-t-0 border-r-0 border-l-0 border-cyan-700 bg-cyan-700">
												<div className="pl-4">Pos.</div>
												<div className="pl-4">Joueur</div>
												<div className="pl-4">V</div>
												<div className="pl-4">D</div>
												<div className="pl-4">BM</div>
												<div className="pl-4">BE</div>
											</div>
											{ranking &&
												ranking.map((joueur: RankingProps, index: number) => (
													<RankingPlayersRow
														key={index}
														joueur={joueur}
														id={index + 1}
													/>
												))}
										</div>
										<div className="text-sm mt-1">
											<p>
												V : Victoires - D : Défaites - BM : Buts marqués - BE :
												Buts encaissés
											</p>
										</div>
									</>
								)}
							</TabPanel>
						</div>
					</div>
				)}

				{/* [Main Modal] Create Tournament */}
				{showCreateTournamentModal && (
					<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
						<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">
							<div className="flex flex-col space-y-4">
								<h3 className="text-2xl font-semibold text-center mb-4">
									Configuration du tournoi
								</h3>
								<form name="createTournamentForm">
									<div className="flex items-center">
										<p className="font-semibold">Nom du tournoi :</p>
										<div className="relative ml-3">
											<input
												type="text"
												className="bg-transparent outline outline-1"
												id="name"
												name="name"
												placeholder="Nom"
												onChange={handleFormChange}
											/>
										</div>
									</div>

									<div className="flex justify-around mt-7">
										<div className="flex flex-col">
											<p className="font-semibold mb-3">
												Liste des Participants
											</p>
											<ul className="flex-col items-center mb-2">
												{updatedUserRelations.map(
													(relation, index) =>
														relation.friend &&
														user && (
															<li key={index}>
																<input
																	name="participants"
																	type="checkbox"
																	className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none mr-2"
																	onChange={handleFormChange}
																	value={relation.friend.username}
																	checked={
																		form.participants.includes(
																			relation.friend.username
																		) ||
																		user.username === relation.friend.username
																	}
																/>
																{relation.friend?.username}
															</li>
														)
												)}
											</ul>
										</div>
									</div>
									{/* Options */}
									<div className="flex justify-around mt-7">
										<div className="flex flex-col">
											<p className="font-semibold mb-3">Power Ups</p>
											<input
												name="power_ups"
												type="checkbox"
												className="cursor-pointer bg-slate-200 border-none checked:bg-emerald-500 checked:outline-none focus:outline-none"
												onChange={handleFormChange}
											/>
										</div>
										<div onChange={handleFormChange} className="flex flex-col">
											<p className="font-semibold mb-3">Mode</p>
											<select
												name="mode"
												required
												className="w-full bg-transparent border-white rounded-sm"
											>
												<option className="bg-neutral-800" value="1972">
													1972
												</option>
												<option className="bg-neutral-800" value="points">
													Points
												</option>
												<option className="bg-neutral-800" value="time">
													Time
												</option>
											</select>
										</div>
										{(form.mode === "points" || form.mode === "time") && (
											<div
												onChange={handleFormChange}
												className="flex flex-col"
											>
												<p className="font-semibold mb-3">Value</p>
												<input
													name="mode_value"
													type="number"
													className="w-full bg-transparent border-white rounded-sm"
												/>
											</div>
										)}
										<div onChange={handleFormChange} className="flex flex-col">
											<p className="font-semibold mb-3">Difficulté</p>
											<select
												name="difficulty"
												required
												className="w-full bg-transparent border-white rounded-sm"
											>
												<option className="bg-neutral-800" value="facile">
													Facile
												</option>
												<option className="bg-neutral-800" value="moyen">
													Moyen
												</option>
												<option className="bg-neutral-800" value="difficile">
													Difficile
												</option>
											</select>
										</div>
									</div>

									<div className="flex justify-end gap-4 text-sm">
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-800 cursor-pointer"
											onClick={() => createTournament()}
										>
											Créer tournoi
										</button>
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
											onClick={() => setCreateTournamentModal(false)}
										>
											Annuler
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default TournamentsPage;
