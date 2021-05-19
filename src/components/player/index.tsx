import styles from "../../styles/player.module.scss";

import { RiHeartLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

export default function Player() {
  return (
    <div className={styles.card}>
        <h1>Nome</h1>
        <img src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png" alt="Avatar" />
        <div className={styles.cardFooter}>
          <RiHeartLine/>
          <p>1</p>
          <RiMoneyDollarCircleLine />
          <p>1</p>
        </div>                        
    </div>
  )
 }
