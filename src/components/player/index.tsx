import styles from "../../styles/player.module.scss";

import { RiHeartLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { User } from "../../dtos";

interface PlayerProps {
  vidas: number;
  moedas: number;
  nome: string;
  avatar: string;

  onClick(): void;
}

export default function Player({
  vidas,
  moedas,
  nome,
  avatar,
  onClick,
}: PlayerProps) {
  return (
    <div onClick={onClick} className={styles.card}>
      <h1>{nome}</h1>
      <img
        src={
          avatar ||
          "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png"
        }
        alt="Avatar"
      />
      <div className={styles.cardFooter}>
        <RiHeartLine />
        <p>{vidas}</p>
        <RiMoneyDollarCircleLine />
        <p>{moedas}</p>
      </div>
    </div>
  );
}
