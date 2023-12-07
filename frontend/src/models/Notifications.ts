export interface Notifs {
  sender: string;
  receiver: string;
  message: string;
  status: string;
  game: number;
  createdAt?: string;
}

export interface ChatMessage {
  receiver: string;
  sender: string;
  text: string;
  createdAt?: string;
}
