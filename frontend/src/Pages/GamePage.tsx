import { useNavigate, useParams } from "react-router-dom";
import { IGame, GameUpdate } from "../models/Game.ts";
import { useEffect, useState } from "react";
import Game from "../Components/Game/SingleGame.tsx";
import Navbar from "../Components/Navbar.tsx";
import PageLayout from "../Components/PageLayout.tsx";
import FooterMain from "../Components/FooterMain.tsx";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { useNotificationContext } from "../contexts/NotificationContext.tsx";

interface GameInvitationResponse {
	// move to models
	message: string;
	sender: string;
	receiver: string;
}

const GamePage = () => {
	const navigate = useNavigate();

	let showAlert = true;

	let { gameId } = useParams<{ gameId: string }>();
	const [game, setGame] = useState<IGame | null>(null);
	const [gameFinished, setGameFinished] = useState<boolean>(false);
	const [updating, setUpdating] = useState(false);
	const [titleModal, settitleModal] = useState("");
	const [showEditModal, setShowEditModal] = useState(true);
	const [showEditModalEnd, setShowEditModalEnd] = useState(false);
	const { socket } = useNotificationContext();
	const [invitationRefused, setInvitationRefused] = useState(false);

	useEffect(() => {
		const handleUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", handleUnload);
		return () => {
			window.removeEventListener("beforeunload", handleUnload);
		};
	}, []);

	useEffect(() => {
		if (!gameId) {
			return;
		}

		const checkAccess = async () => {
			const canAccessGame = localStorage.getItem("canAccessGame");

			if (!canAccessGame && showAlert) {
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
					if (response.data === false || response.data === "false") {
						console.log("GAME NOT FOUND");
						navigate("/404");
					} else {
						checkAccess();
					}
				});
		};

		const fetchGame = async () => {
			try {
				const response = await axios.get(
					"https://localhost:8000/api/game/" + gameId
				);
				if (response && !response.data.name_p2)
					setShowEditModal(false)
				if (response) {
					settitleModal(
						"En attente de l'acceptation de " + response.data.name_p2
					);
					setGame(response.data);
				}
			} catch (error) {
				navigate("/404");
			}
		};
		checkId();
	}, [gameId]);

	const handleGameUpdate = async (updatedGame: GameUpdate, gameId: string) => {
		if (updating && gameFinished) return;

		setUpdating(true);
		try {
			setGameFinished(true);
			console.log("update game called - gamedId = ", gameId);
			console.log("name p2 = ", updatedGame.name_p2)
			if (!updatedGame.name_p2) {
				await axios.delete("https://localhost:8000/api/game/" + gameId);
			} else {
				await axios.patch(
					"https://localhost:8000/api/game/update-score/" + gameId, updatedGame);
			}
			checkWinner();
			localStorage.removeItem("canAccessGame");
			setShowEditModalEnd(true);
		} catch (error) {
		} finally {
			setUpdating(false);
		}
	};

	const navigateToHome = () => {
		navigate("/accueil");
	};
	const cancelGame = async () => {
		try {
			await axios.delete("https://localhost:8000/api/game/" + gameId);
			navigate("/accueil");
		} catch (error) {
			console.log("failed to cancel game");
		}
	};

	const revengeGame = async () => {
		try {
			const newGameId = await axios.post(
				"https://localhost:8000/api/game/revenge",
				{
					id: gameId,
				}
			);
			if (newGameId) {
				localStorage.setItem("canAccessGame", "true");
				setShowEditModalEnd(false);
				setGameFinished(false);
				gameId = newGameId.data;
				navigate("/game/" + newGameId.data);
			}
		} catch (error) {
			console.log("failed to cancel game");
		}
	};

	socket?.on("gameInvitationResponse", (response: GameInvitationResponse) => {
		if (response.message === "en cours" && response.sender === game?.name_p1) {
			setShowEditModal(false);
		} else if (
			response.message === "refuser" &&
			response.sender === game?.name_p1
		) {
			settitleModal(`${game?.name_p2} a refusé votre invitation`);
			setInvitationRefused(true);
		}
	});

	const checkWinner = () => {
		if (game) {
			if (game?.score_p1 > game?.score_p2) {
				settitleModal(`${game?.name_p1} a gagné la partie`);
			} else {
				settitleModal(`${game?.name_p2 ? game.name_p2 : "Bot (AI)"} a gagné la partie`);
			}
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
									{titleModal}
								</h3>
								<div className="flex justify-center">
									{invitationRefused ? (
										<span style={{ fontSize: "50px" }}>😢</span>
									) : (
										<SyncLoader color="#36d7b7" />
									)}
								</div>
								<div className="flex justify-around mt-7">
									<div className="flex justify-end gap-4 text-sm">
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
											onClick={() => cancelGame()}
										>
											Annuler
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
					<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
						<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">
							<div className="flex flex-col space-y-4">
								<h3 className="text-2xl font-semibold text-center mb-4">
									{titleModal}
								</h3>
								<div className="flex justify-center animate-bounce">
									<span style={{ fontSize: "100px" }}>🥳</span>
								</div>
								<div className="flex justify-around mt-7">
									<div className="flex justify-end gap-4 text-sm">
										<button
											type="button"
											className="mt-5 py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
											onClick={() => navigateToHome()}
										>
											Quitter
										</button>
										{game?.name_p2 && (
											<button
												type="button"
												className="mt-5 py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
												onClick={() => revengeGame()}
											>
												Revanche
											</button>
										)}
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

export default GamePage;
