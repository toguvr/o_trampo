import styles from "../../styles/player.module.scss";

import { RiHeartLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { User } from "../../dtos";

interface PlayerProps {
  vidas: number;
  moedas: number;
  nome: string;
  avatar: string;
  answer: boolean;
  selected: boolean;
  myRound: boolean;

  onClick(): void;
}

export default function Player({
  vidas,
  moedas,
  nome,
  avatar,
  onClick,
  selected,
  answer,
  myRound,
}: PlayerProps) {
  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${selected ? styles.selected : ""}`}
    >
      <h1>{nome}</h1>
      <aside>
        <img
          className={myRound ? styles.myRound : styles.notMyRound}
          src={
            avatar ||
            "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png"
          }
          alt="Avatar"
        />
        <div className={`${answer ? styles.answer : styles.notAnswer}`}></div>
      </aside>
      <div className={styles.cardFooter}>
        <RiHeartLine />
        <p>{vidas}</p>
        <RiMoneyDollarCircleLine />
        <p>{moedas}</p>
      </div>
    </div>
  );
}
