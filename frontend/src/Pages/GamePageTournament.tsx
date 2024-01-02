import { useNavigate, useParams, useBlocker } from "react-router-dom";
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
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<IGame | null>(null);
  const [gameFinished, setGameFinished] = useState<boolean>(true);
  const [updating, setUpdating] = useState(false);
  const [titleModal, settitleModal] = useState("");
  const [showEditModal, setShowEditModal] = useState(true);
  const { socket } = useNotificationContext();
  const [invitationRefused, setInvitationRefused] = useState(false);

  console.log("gameId", gameId);
  useEffect(() => {
    if (!gameId) {
      return;
    }
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          "https://localhost:8000/api/game/" + gameId
        );
        if (response) {
          // console.log("response GAME ", response);
          settitleModal(
            "En attente de l'acceptation de " + response.data.name_p2
          );
          setGame(response.data);
          // console.log("response data", response.data);
        }
        // console.log(response.data);
      } catch (error) {
        // console.log("failed to fetch game");
      }
    };
    fetchGame();
  }, [gameId]);

  const handleGameUpdate = async (updatedGame: GameUpdate, gameId: string) => {
    if (updating) return;

    setUpdating(true);
    try {
      setGameFinished(false);
      await axios.patch(
        "https://localhost:8000/api/game/update-score/" + gameId,
        updatedGame
      );
      if (game?.tournament_name) {
        const next_game = await axios.get(
          "https://localhost:8000/api/tournaments/next_game/" +
            game?.tournament_name
        );
        if (next_game) {
          navigate("/game" + next_game.data);
        } else {
          // navigate('/podium');
        }
      } else {
        navigate("/accueil");
      }
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  const cancelGame = async () => {
    try {
      await axios.delete("https://localhost:8000/api/game/" + gameId);
      navigate("/accueil");
    } catch (error) {
      console.log("failed to cancel game");
    }
  };

  socket?.on("gameInvitationResponse", (response: GameInvitationResponse) => {
    // console.log("gameInvitationResponse", response);
    // console.log("current user = ", game?.name_p1)
    // console.log("sender = ", response.sender)
    // console.log("receiver = ", response.receiver)
    if (response.message === "en cours" && response.sender === game?.name_p1) {
      setShowEditModal(false);
    } else if (
      response.message === "refuser" &&
      response.sender === game?.name_p1
    ) {
      // console.log("GAME : ", game);
      settitleModal(`${game?.name_p2} a refusé votre invitation`);
      setInvitationRefused(true);
      // navigate("/accueil");
    }
  });

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
          {gameFinished && game ? (
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
