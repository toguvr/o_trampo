import React, { useEffect, useState } from "react";
import Player from "../components/player";
import styles from "../styles/sala.module.scss";
import { RiHeartFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import db from "../../db.json";
import { api } from "../services/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Sala() {
  const router = useRouter();
  console.log(router.query);
  const sala_id = router.query.sala[0];
  const user_id = router.query.sala[1];
  // const [sala_id, user_id] = router.query.sala;
  const [room, setRoom] = useState({});

  const startGame = async () => {
    try {
      const response = await api.post(`/iniciar`, {
        sala_id,
        user_id,
      });

      setRoom(response.data);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const getRoom = async () => {
    try {
      const response = await api.get(`/sala?sala_id=${sala_id}`);

      const me = response.data.usuarios.find((usuario) => {
        return String(usuario.id) === String(user_id);
      });

      const usuarios = response.data.usuarios.filter((usuario) => {
        return String(usuario.id) !== String(user_id);
      });

      setRoom({ ...response.data, me, usuarios });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getRoom();
  }, [db]);

  return (
    <div className={styles.container}>
      <h1>Jogadores :</h1>
      <div className={styles.main}>
        {room?.usuarios?.map((usuario) => {
          return <Player key={usuario.id} />;
        })}
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
            <strong>
              <b>Caixa</b>: Pegue 3 moedas (Não pode ser bloqueado)
            </strong>
            <div className={styles.movesBottom}>
              <button>Passar</button>
              <button>Duvidar</button>
            </div>
          </div>

          <div className={styles.movesFooter}>
            <h2>Seus dados:</h2>
            <div className={styles.datas}>
              <div className={styles.personalData}>
                {room?.me?.cartas?.map((carta) => {
                  return <button key={carta.id}>{carta.carta}</button>;
                })}
              </div>
              <div className={styles.personaStars}>
                <RiHeartFill size={25} color={"var(--gray-900)"} />

                <p>5</p>
                <RiMoneyDollarCircleFill size={25} color={"var(--gray-900)"} />

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
          <hr />
          <h1>Regra</h1>
          <h1 onClick={startGame}>New</h1>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
