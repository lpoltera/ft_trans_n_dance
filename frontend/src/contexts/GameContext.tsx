import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./UserContext";
import { GameProps } from "../models/Game";

interface GameProviderProps {
  children: ReactNode;
}

export const GameContext = createContext<
  | {
      gameDetails: GameProps | null;
      setGameDetails: React.Dispatch<React.SetStateAction<GameProps | null>>;
    }
  | undefined
>(undefined);

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameDetails, setGameDetails] = useState<GameProps | null>(null);
  const { user } = useUserContext();

  useEffect(() => {
    const newGameDetails: GameProps = {
      difficulty: 1,
      withPowerUps: false,
      victoryCondition: { type: "1972", value: 5 },
      player1: user,
      player2: null,
    };

    setGameDetails(newGameDetails);
  }, [user]);

  return (
    <GameContext.Provider value={{ gameDetails, setGameDetails }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGameContext() {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return context;
}
