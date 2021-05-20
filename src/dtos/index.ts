export interface User {
  id: number;
  nome: string;
  avatar: string;
  cartas: {
    id: number;
    carta: string;
  }[];
  duvido: boolean;
  passou: boolean;
  moedas: number;
}

export interface Room {
  id: number;
  nome: string;
  espera: boolean;
  adminId: number;
  baralho: {
    id: number;
    carta: string;
  }[];
  rodada: number;
  usuarios: User[];
  me: User;
}
