import { User } from "./User";

export interface GameProps {
  difficulty: number | undefined;
  withPowerUps: boolean | false;
  victoryCondition: {
    type: "points" | "time" | "1972";
    value: number | undefined;
  };
  player1: User | null;
  player2: User | null;
}

export interface GameFormProps {
  difficulty: number;
  withPowerUps: boolean;
  victoryCondition: "points" | "1972" | "time";
  victoryValue?: number;
  player1: string;
  player2: string;
}

export interface GameHistoryProps {
  id: number;
  name_p1: string;
  name_p2: string;
  score_p1: number;
  score_p2: number;
  updated_at: string;
}

export interface GameStatsProps {
  title: string;
  value: number | undefined;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

export interface Paddle {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  score: number;
  speed: number;
}

export interface Parties {
  id: number;
  name_p1: string;
  name_p2: string;
  score_p1: number;
  score_p2: number;
  updated_at: string;
}
