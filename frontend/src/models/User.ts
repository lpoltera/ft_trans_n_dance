export interface User {
  id: number;
  username: string;
  avatar: string;
  connected: string;
  win: number;
  loss: number;
  draw: number;
  totalXP: number;
  totalGame: number;
}

export interface UserRelation {
  friend: User;
  status: string;
  sender: string;
}
