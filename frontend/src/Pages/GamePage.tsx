import { useParams } from "react-router-dom";
import { IGame, GameUpdate } from "../models/Game.ts";
import { useEffect, useState } from "react";
import Game from "../Components/Game/SingleGame.tsx";

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<IGame | null>(null);

  useEffect(() => {
    if (!gameId) {
      return;
    }
    const fetchGame = async () => {
      // TODO: get the game from the API
      // const response = await getGame(gameId);
      // if (response) {
      //   setGame(response);
      // }
    };
    fetchGame();
  }, [gameId]);

  const handleGameUpdate = (updatedGame: GameUpdate) => {
    // faire l'update du game avec l'api puis renvoyer vers le game suivant si c'est un tournoi, sinon renvoyer vers l'accueil
  };

  return (
    <div>
      {game ? (
        <Game game={game} onFinish={handleGameUpdate} />
      ) : (
        <div>Unable to load the game</div>
      )}
    </div>
  );
};

export default GamePage;
