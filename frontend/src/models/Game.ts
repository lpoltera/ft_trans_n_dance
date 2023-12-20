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
  status: string;
  difficulty: string;
  mode: string;
  power_ups: boolean;
}

export interface TournamentGameProps {
  id: number;
  name: string;
  name_p1: string;
  name_p2: string;
  score_p1: number;
  score_p2: number;
  updated_at: string;
  participants: string[];
  difficulty: string;
  mode: string;
  power_ups: boolean;
  tournament_creator: string | undefined;
  status: string;
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
  acceleration: number;
}

export interface Parties {
  id: number;
  name_p1: string;
  name_p2: string;
  score_p1: number;
  score_p2: number;
  updated_at: string;
  status: string;
  difficulty: string;
  mode: string;
  power_ups: boolean;
}

export interface RankingProps {
  id: number;
  name: string;
  wins: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  point_difference: number;
}

export enum GameType {
  POINTS = "points",
  TIME = "time",
  ORIGINAL = "1972",
}

export enum GameStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

export type GameCreation = {
  creatorId: string;
  opponentId?: string;
  gameType: GameType;
  value?: number;
  powerUps?: boolean;
  tournament?: boolean;
  difficulty?: number;
};

export type GameUpdate = {
  gameId: string;
  scorePlayer1?: number;
  scorePlayer2?: number;
  winner?: string;
  duration?: number;
  status: GameStatus;
};

export type IGame = {
  id: string;
  player1: string;
  player2: string | null;
  scorePlayer1: number;
  scorePlayer2: number;
  difficulty: number;
  winner: string | undefined;
  duration: number;
  status: GameStatus;
  gameType: GameType;
  value: number;
  powerUps: boolean;
  tournament: boolean;
  updatedAt: Date;
  createdAt: Date;
};
