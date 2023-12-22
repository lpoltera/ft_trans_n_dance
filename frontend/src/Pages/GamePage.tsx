import { useNavigate, useParams } from "react-router-dom";
import { IGame, GameUpdate } from "../models/Game.ts";
import { useEffect, useState } from "react";
import Game from "../Components/Game/SingleGame.tsx";
import Navbar from "../Components/Navbar.tsx";
import PageLayout from "../Components/PageLayout.tsx";
import FooterMain from "../Components/FooterMain.tsx";
import axios from "axios";

const GamePage = () => {
	const navigate = useNavigate();
	const { gameId } = useParams<{ gameId: string }>();
	const [game, setGame] = useState<IGame | null>(null);


	console.log("gameId", gameId);
	useEffect(() => {
		if (!gameId) {
			return;
		}
		const fetchGame = async () => {
			try {
				const response = await axios.get('https://localhost:8000/api/game/' + gameId);
				if (response) {
					setGame(response.data);
					console.log("response data", response.data);
				}
				console.log(response.data);
			} catch (error) {
				console.log("failed to fetch game")
			}
		};
		fetchGame();
	}, [gameId]);

	const handleGameUpdate = async (updatedGame: GameUpdate, gameId: string) => {
		try {
			await axios.patch('https://localhost:8000/api/game/update-score/' + gameId, updatedGame);
			if (game?.tournament) {
				const next_game = await axios.get('https://localhost:8000/api/tournaments/next_game/' + game?.tournament);
				if (next_game) {
					navigate('/game' + next_game.data)
				} else {
					// navigate('/podium');
				}
			} else {
				navigate('/accueil')
			}
		} catch (error) {
		}
	};

	return (
		<>
			<Navbar />
			<PageLayout>
				<div>
					{game ? (
						<Game game={game} onFinish={handleGameUpdate} />
					) : (
						<div>Unable to load the game</div>
					)}
				</div>
			</PageLayout>
			<FooterMain />
		</>
	);
};

export default GamePage;
