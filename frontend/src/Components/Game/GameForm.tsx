import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../models/User";
import { useUserContext } from "../../contexts/UserContext";

interface GameFormProps {
  difficulty: number;
  withPowerUps: boolean;
  victoryCondition: "points" | "1972" | "time";
  victoryValue?: number;
  player1: string;
  player2: string;
}

const GameForm = () => {
  const { user, fetchUserFriends } = useUserContext();
  const [friends, setFriends] = useState<User[] | null>(null);
  const [gameDetails, setGameDetails] = useState<GameFormProps>({
    difficulty: 1,
    withPowerUps: false,
    victoryCondition: "1972",
    victoryValue: 0,
    player1: user?.username || "",
    player2: "Bot",
  });

  useEffect(() => {
    const getFriends = async () => {
      const userFriends = await fetchUserFriends();
      setFriends(userFriends);
    };
    getFriends();
  }, [fetchUserFriends]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGameDetails((prevState) => ({
      ...prevState,
      [name]: name === "victoryValue" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-96 gap-4">
      <label className="flex flex-col justify-start items-start w-full gap-2">
        Difficulté:
        <select
          name="difficulty"
          value={gameDetails.difficulty}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-white rounded-sm"
        >
          <option value={1}>Facile</option>
          <option value={2}>Moyen</option>
          <option value={3}>Difficile</option>
        </select>
      </label>
      {/* <label>
        Activé les power-ups:
        <input
          name="withPowerUps"
          type="checkbox"
          checked={gameDetails.withPowerUps}
          onChange={handleChange}
        />
      </label> */}
      <label className="flex flex-col justify-start items-start w-full gap-2">
        Sélectionner le mode de victoire:
        <select
          name="victoryCondition"
          value={gameDetails.victoryCondition}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-white rounded-sm"
        >
          <option value="points">Points</option>
          <option value="1972">1972</option>
          <option value="time">Time</option>
        </select>
      </label>
      {(gameDetails.victoryCondition === "points" ||
        gameDetails.victoryCondition === "time") && (
        <label className="flex flex-col justify-start items-start w-full gap-2">
          {gameDetails.victoryCondition === "points"
            ? "nombre de points:"
            : "durée de la partie (secondes):"}
          <input
            className="w-full bg-transparent border-white rounded-sm"
            type="number"
            name="victoryValue"
            value={gameDetails.victoryValue}
            onChange={handleChange}
            required
          />
        </label>
      )}
      <label className="flex flex-col justify-start items-start w-full gap-2">
        Contre qui souhaitez-vous jouer ?:
        <select
          name="player2"
          value={gameDetails.player2 || ""}
          onChange={handleChange}
          required
          placeholder="Choisir un ami"
          className="w-full bg-transparent border-white rounded-sm"
        >
          <option value="Bot">Bot</option>
          {friends?.map(
            (friend) =>
              friend.username !== user?.username && (
                <option key={friend.id} value={friend.username}>
                  {friend.username}
                </option>
              )
          )}
        </select>
      </label>
      <input
        className="w-full py-2 px-4 border border-white rounded-md"
        type="submit"
        value="Confirmer"
      />
    </form>
  );
};

export default GameForm;
