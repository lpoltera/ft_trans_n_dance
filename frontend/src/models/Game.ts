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
