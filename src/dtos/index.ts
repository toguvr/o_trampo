export interface UserCards {
  id: number;
  name: string;
  user_id: string;
  user: User;
}
export interface User {
  id: number;
  username: string;
  avatar: string;
  cards: UserCards[];
  doubt: boolean;
  pass: boolean;
  coins: number;
  room: Room;
}
export interface Card {
  id: number;
  name: string;
  room_id: string;
  room: Room;
}

export interface Room {
  id: number;
  name: string;
  waiting: boolean;
  cards: Card[];
  round: number;
  users: User[];
  me: User;
}
