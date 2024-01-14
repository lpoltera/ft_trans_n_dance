import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FooterMain from "../Components/FooterMain.tsx";
import Game from "../Components/Game/SingleGame.tsx";
import HistoryMatchRow from "../Components/HistoryMatchRow.tsx";
import Navbar from "../Components/Navbar.tsx";
import PageLayout from "../Components/PageLayout.tsx";
import RankingPlayersRow from "../Components/RankingPlayerRow.tsx";
import { useNotificationContext } from "../contexts/NotificationContext.tsx";
import { RankingProps, TournamentGameProps } from "../models/Game";
import { GameUpdate, IGame } from "../models/Game.ts";



const GamePageTournament = () => {
	const navigate = useNavigate();

	let showAlert = true;
	let sendNotif = true;

	const { gameId } = useParams<{ gameId: string }>();
	// const [gameId, setSearchParams] = useSearchParams();
	// const [gameId, setGameId] = useState<string | undefined>(undefined);
	const [game, setGame] = useState<IGame | null>(null);
	const [gameFinished, setGameFinished] = useState<boolean>(false);
	const [updating, setUpdating] = useState(false);
	const [titleModal, settitleModal] = useState("");
	const [showEditModal, setShowEditModal] = useState(true);
	const [showEditModalEnd, setShowEditModalEnd] = useState(false);
	const { socket } = useNotificationContext();
	const [tournamentGames, setTournamentGames] = useState<
		TournamentGameProps[] | any
	>();
	const [ranking, setRanking] = useState<RankingProps[] | any>();
	const [tournamentFinished, setTournamentFinished] = useState<boolean>(false);

	// useEffect(() => {
	// 	setGameId(paramId);
	// }, [paramId]);


	console.log("gameId : ", gameId);

	const handleStats = async () => {
		console.log("Tournament : ", game?.tournament_name);
		const games = await axios.get<TournamentGameProps[]>(
			`/api/tournaments/games/` + game?.tournament_name
		);
		const tmp = await axios.get<RankingProps[]>(
			`/api/tournaments/ranking/` + game?.tournament_name
		);
		setTournamentGames(games.data);
		setRanking(tmp.data);
		for (let i in games.data) {
			if (games.data[i].status != "terminé") {
				setTournamentFinished(false);
				break;
			} else {
				localStorage.removeItem("canAccessTournament");
				setTournamentFinished(true);
			}
		}
	};

	useEffect(() => {
		if (!gameId) {
			return;
		}

		console.log("gameId in useEffect : ", gameId);
		const checkAccess = () => {
			const canAccessTournament = localStorage.getItem("canAccessTournament");

			console.log("canAccessTournament : ", canAccessTournament)
			if (!canAccessTournament && showAlert) {
				// localStorage.removeItem("canAccessTournament");
				showAlert = false;
				alert(
					"Vous n'avez pas accès à cette partie via l'URL. Veuillez passer par l'interface."
				);
				navigate("/accueil");
			}
			fetchGame();
		};

		const checkId = async () => {
			await axios
				.get("https://localhost:8000/api/game/check/" + gameId)
				.then((response) => {
					console.log("response check ", response.data);
					// setReponseCheck(response.data);
					if (response.data === false || response.data === "false") {
						console.log("GAME NOT FOUND");
						navigate("/404");
					} else {
						checkAccess();
					}
				});
		};

		const fetchGame = async () => {
			await axios
				.get("https://localhost:8000/api/game/" + gameId)
				.then((response) => {
					console.log("response GAME ", response);
					settitleModal(
						`${response.data.name_p1} contre ${response.data.name_p2}`
					);
					setGame(response.data);
					if (sendNotif) {
						sendNotif = false;
						sendNotifToParticipants(response.data);
					}
					// console.log("response data", response.data);
				})
				.catch(() => {
					navigate("/404");
				});
		};
		checkId();
	}, [gameId]);

	const handleGameUpdate = async (updatedGame: GameUpdate, gameId: string) => {
		if (updating && gameFinished && tournamentFinished) return;

		console.log("handleGameUpdate called")
		setUpdating(true);
		try {
			setGameFinished(true);
			await axios.patch(
				"https://localhost:8000/api/game/update-score/" + gameId,
				updatedGame
			);
			checkWinner();
			setShowEditModalEnd(true);
		} catch (error) {
		} finally {
			setUpdating(false);
		}
	};

	const navigateToNextGame = async () => {
		const nextId = await axios.get(
			"https://localhost:8000/api/tournaments/next_game/" +
			game?.tournament_name
		);
		setShowEditModalEnd(false);
		setShowEditModal(true);
		// gameId = nextId.data;
		// console.log("nextId : ", nextId);
		// console.log("gameId : ", gameId);
		setGameFinished(false);

		navigate("/tournaments/" + nextId.data);
	};

	const navigateToTournamentPage = async () => {
		// setShowEditModalEnd(false);
		// setShowEditModal(true);
		// setGameFinished(false);

		navigate("/tournaments");
	}

	const checkWinner = () => {
		handleStats();
		if (game) {
			if (game?.score_p1 > game?.score_p2) {
				settitleModal(`${game?.name_p1} a gagné la partie`);
			} else {
				settitleModal(`${game?.name_p2} a gagné la partie`);
			}
		}
	};

	const sendNotifToParticipants = async (
		tournamentGames: TournamentGameProps
	) => {
		// console.log("tournamentGames : ", tournamentGames);
		// console.log("socket : ", socket);
		// console.log(`tournamentGames.name_p1 : `, tournamentGames.name_p1);
		// console.log(`tournamentGames.name_p2 : `, tournamentGames.name_p2);
		const message1 = {
			sender: tournamentGames.tournament_creator,
			receiver: tournamentGames.name_p1,
			text: `On t'attend pour ton match contre ${tournamentGames.name_p2} !`,
		};
		if (tournamentGames.name_p1 !== tournamentGames.tournament_creator) {
			console.log("message envoyé à ", tournamentGames.name_p1)
			socket?.emit("sendMessage", message1);
		}
		const message2 = {
			sender: tournamentGames.tournament_creator,
			receiver: tournamentGames.name_p2,
			text: `On t'attend pour ton match contre ${tournamentGames.name_p1} !`,
		};
		if (tournamentGames.name_p2 !== tournamentGames.tournament_creator) {
			console.log("message envoyé à ", tournamentGames.name_p2)
			socket?.emit("sendMessage", message2);
		}
	};



	return (
		<>
			<Navbar />
			<PageLayout>
				{showEditModal && game && (
					<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
						<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">
							<div className="flex flex-col space-y-4">
								<h3 className="text-2xl font-semibold text-center mb-4">
									La prochaine rencontre opposera :
									<br />
									<br />
									{titleModal}
								</h3>
								<div className="flex justify-center">
									<span style={{ fontSize: "50px" }}>🏓</span>
								</div>
								<div className="flex justify-around mt-7">
									<div className="flex justify-end gap-4 text-sm">
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
											onClick={() => setShowEditModal(false)}
										>
											Etes-vous prêt ?
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<div>
					{!gameFinished && game && !showEditModal ? (
						<Game game={game} onFinish={handleGameUpdate} />
					) : (
						<div></div>
					)}
				</div>
				{showEditModalEnd && game && (
					<div className="fixed inset-0 overflow-y-auto z-50 flex flex-col items-center justify-center bg-black/60">
						<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800 overflow-y-auto">
							<div className="flex flex-col space-y-4">
								<h3 className="text-2xl font-semibold text-center mb-4">
									{!tournamentFinished
										? titleModal
										: `Le tournoi est terminé ! Le vainqueur est ${ranking[0]?.name}`}
								</h3>
								<div
									className={`flex justify-center ${!tournamentFinished ? " animate-bounce" : "animate-none"
										}`}
								>
									<span style={{ fontSize: "100px" }}>
										{!tournamentFinished ? "🥳" : "🏆"}
									</span>
								</div>
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
										V : Victoires - D : Défaites - BM : Buts marqués - BE : Buts
										encaissés
									</p>
								</div>

								<div className="flex justify-around mt-7">
									<div className="flex justify-end gap-4 text-sm">
										{!tournamentFinished ? (
											<button
												type="button"
												className="mt-5 py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
												onClick={() => navigateToNextGame()}
											>
												Prochaine rencontre
											</button>
										) : (
											<button
												type="button"
												className="mt-5 py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
												onClick={() => navigateToTournamentPage()}
											>
												Retour à la page tournoi
											</button>
										)}
										{/* <button
                      type="button"
                      className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
                      onClick={() => revengeGame()}
                    >
                      Revanche
                    </button> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default GamePageTournament;
