import React from "react";
import Player from "../components/player";
import styles from "../styles/sala.module.scss";
import { RiHeartFill, RiMoneyDollarCircleFill } from 'react-icons/ri';


export default function Sala() {
  return (
    <div className={styles.container}>
        <h1>Jogadores :</h1>
      <div className={styles.main}>
        <Player />                
        <Player />                
        <Player />                
        <Player />                
        <Player />                
        <Player />                
        <Player />                
        <Player />                
        <Player />                
      </div>
      <div className={styles.movesBoard}>       
      <div className={styles.movesInBoard}>
        <h1>Jogada :</h1>
        <div className={styles.movesContent}>
          <div className={styles.movesTop}>
            <h1>Caixa</h1>
            <h1>RH</h1>
            <h1>CEO</h1>
            <h1>Jurídico</h1>
            <h1>Novato</h1>
          </div>
          <strong><b>Caixa</b>: Pegue 3 moedas (Não pode ser bloqueado)</strong>
          <div className={styles.movesBottom}>
            <button>
              Passar
            </button>
            <button>
              Duvidar
            </button>
          </div>
        </div>      
        
        <div className={styles.movesFooter}>
          <h2>Seus dados:</h2>
          <div className={styles.datas}>
          <div className={styles.personalData}>
            <button>
              Caixa
            </button>
            <button>
              CEO
            </button>
          </div>
          <div className={styles.personaStars}>
          <RiHeartFill size={25} color={"var(--gray-900)"}/>

          <p>5</p>
          <RiMoneyDollarCircleFill  size={25} color={"var(--gray-900)"}/>

          <p>2</p>
          </div>
          </div>
        </div>
      </div>
      <div className={styles.movesOutBoard}>
            <h1>Poder</h1>
            <h1>Extra</h1>
            <h1>Renda</h1>
            <h1>Matar</h1>
            <hr/>
            <h1>Regra</h1>
            <h1>New</h1>
      </div>
      </div>
      </div>
  )
 }
