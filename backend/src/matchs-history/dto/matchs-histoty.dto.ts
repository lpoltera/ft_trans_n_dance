export class MatchsHistoryDto {
  id: number;
  player1: string;
  player2: string;
  status: string;
  scorePlayer1: number;
  scorePlayer2: number;
  difficulty: string;
  duration: number;
  mode: string;
  mode_value: number;
  powerUps: string;
  tournament: string;
  createdAt: Date;
  updatedAt: Date;
}
