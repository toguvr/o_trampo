import React, { useEffect, useMemo, useState } from "react";
import Player from "../components/player";
import styles from "../styles/sala.module.scss";
import { RiHeartFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { CgLogOut } from "react-icons/cg";
import { api } from "../services/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Room, User } from "../dtos";
import socketio from "socket.io-client";
import { addSeconds } from "date-fns";
import { useTimer } from "react-timer-hook";
import { cartas } from "../utils";
import { useLoading } from "../hooks/load";
import Head from "next/head";

interface RoomMe extends Room {
  me: User;
  opponents: User[];
}

interface SocketReturnProps {
  sala_id: string;
  user_id: string;
  action: number;
  doubtActionType: number;
  victim: User;
  user?: User;
  username?: string;
}

export default function Sala() {
  const router = useRouter();
  const loading = useLoading();
  const sala_id = router.query.sala[0];
  const user_id = router.query.sala[1];
  // const [sala_id, user_id] = router.query.sala;
  const [room, setRoom] = useState({ users: [] } as RoomMe);
  const [yourAction, setDoAction] = useState(0);

  const [play, setPlay] = useState(<div></div>);
  const [victim, setVictim] = useState({} as User);
  const [doubtAction, setDoubtAction] = useState({} as SocketReturnProps);
  const [doubtActionType, setDoubtActionType] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (room.id) {
      const inRoom = room?.users.find(
        (usuario) => String(usuario?.id) === String(user_id)
      );

      if (!inRoom) {
        toast.error("Você foi eliminado.");
        router.push("/");
      }
    }
  }, [room]);

  useEffect(() => {
    if (room.round) {
      setVictim({} as User);
      setDoAction(0);
      setDoubtAction({} as SocketReturnProps);
    }
  }, [room?.round, room?.users?.length]);

  const playAction = (action) => {
    if (
      String(room?.users[Number(Number(room.round) - 1)]?.id) ===
      String(user_id)
    ) {
      setDoAction(action);
      setVictim({} as User);
    } else {
      if (Number(room.round) === 0) {
        return toast.warning("O Dono precisa iniciar o jogo.");
      }
      toast.warning("Não é sua vez de jogar");
    }
  };

  const doubt = async (doubt) => {
    try {
      const response = await api.post(`/sala/resposta-duvido`, {
        sala_id,
        user_id,
        doubt,
      });

      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    }
  };

  const doubtDuque = async (doubt) => {
    loading.start();
    try {
      const response = await api.post(`/sala/duvido`, {
        sala_id,
        user_id,
        victim_id: doubtAction?.user_id,
        doubt,
      });
      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const doubtDuqueAction = async (doubt) => {
    loading.start();
    try {
      const response = await api.post(`/sala/duvido/poder/duque`, {
        sala_id,
        user_id,
        victim_id: doubtAction?.user_id,
        doubt,
        doubtActionType: doubtAction?.doubtActionType,
      });
      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const doubtFirstCaptainAction = async (doubtType) => {
    loading.start();

    try {
      const response = await api.post(`/sala/duvido/poder/capitao`, {
        sala_id,
        user_id,
        victim_id: doubtAction?.victim.id,
        doubtType,
        doubtActionType: doubtAction?.doubtActionType,
      });

      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const doubtFirstAssassinAction = async (doubtType) => {
    loading.start();

    try {
      const response = await api.post(`/sala/duvido/poder/assassino`, {
        sala_id,
        user_id,
        victim_id: doubtAction?.victim?.id,
        doubtType,
        doubtActionType: doubtAction?.doubtActionType,
      });

      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const doubtFirstEmbaixadorAction = async (doubtType) => {
    loading.start();

    try {
      const response = await api.post(`/sala/duvido/poder/embaixador`, {
        sala_id,
        user_id,
        victim_id: null,
        doubtType,
        doubtActionType: doubtAction?.doubtActionType,
      });

      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const doubtSecondCaptainAction = async (doubtType) => {
    loading.start();
    try {
      const response = await api.post(`/sala/duvido/poder/capitao`, {
        sala_id,
        user_id,
        victim_id: doubtAction?.user.id,
        doubtType,
        doubtActionType: doubtAction?.doubtActionType,
      });

      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const doubtSecondAssassinAction = async (doubtType) => {
    loading.start();

    try {
      const response = await api.post(`/sala/duvido/poder/assassino`, {
        sala_id,
        user_id,
        victim_id: doubtAction?.victim?.id,
        doubtType,
        doubtActionType: doubtAction?.doubtActionType,
      });

      setDoAction(6);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Não foi possível duvidar");
    } finally {
      loading.stop();
    }
  };

  const startTimeAction = async (action, doubtActionType) => {
    if (Number(doubtActionType) === 1 && Number(action) === 3 && !victim?.id) {
      return toast.warning("Selecione uma vítima");
    }
    if (
      Number(doubtActionType) === 1 &&
      Number(action) === 3 &&
      Number(victim?.coins) < 2
    ) {
      return toast.warning("A vítima não tem 2 moedas.");
    }
    if (Number(doubtActionType) === 2 && Number(action) === 3 && !victim?.id) {
      return toast.warning("Selecione uma vítima");
    }
    if (
      Number(doubtActionType) === 2 &&
      Number(action) === 3 &&
      Number(room?.users[Number(Number(room.round) - 1)]?.coins) < 3
    ) {
      return toast.warning(
        "Você precisa de pelo menos 3 moedas para esta ação."
      );
    }
    try {
      loading.start();
      const response = await api.post(`/sala/acao-duvido-start`, {
        sala_id,
        user_id,
        action,
        doubtActionType,
        victim,
      });
      setDoAction(6);
    } catch (err) {
    } finally {
      loading.stop();
    }
  };

  const startTimeActionBlock = async (action, doubtActionType) => {
    try {
      const response = await api.post(`/sala/acao-duvido-start-block`, {
        sala_id,
        user_id,
        action,
        doubtActionType,
        victim: doubtAction?.victim,
      });
      setDoAction(6);
    } catch (err) {}
  };

  const influencerPlays = useMemo(() => {
    switch (doubtActionType) {
      case 0:
        return (
          <>
            <strong>
              <b>{cartas[doubtActionType]}</b>: Pegue 3 moedas (Não pode ser
              bloqueado)
            </strong>
            <div className={styles.movesBottom}>
              <button onClick={() => startTimeAction(3, doubtActionType)}>
                Pegar
              </button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <strong>
              <b>{cartas[doubtActionType]}</b>: Pegue 2 moedas de outro jogador
              (pode ser bloqueado pelo {cartas[1]} ou {cartas[4]})
            </strong>
            <div className={styles.movesBottom}>
              <button onClick={() => startTimeAction(3, doubtActionType)}>
                Extorquir {victim?.username}
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <strong>
              <b>{cartas[doubtActionType]}</b>: Pague 3 moedas. Escolha um
              jogador para perder uma vida e uma carta. (pode ser bloqueado pela{" "}
              {cartas[3]})
            </strong>
            <div className={styles.movesBottom}>
              <button onClick={() => startTimeAction(3, doubtActionType)}>
                Matar {victim?.username}
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <strong>
              <b>{cartas[doubtActionType]}</b>: Bloqueia o assassino. (Não pode
              ser bloqueada)
            </strong>
          </>
        );
      case 4:
        return (
          <>
            <strong>
              <b>{cartas[doubtActionType]}</b>: Troque todas suas cartas com o
              baralho. (Não pode ser bloqueado)
              {/* Compre 2 cartas e em seguida
              devolva 2 cartas para o baralho da corte. */}
            </strong>
            <div className={styles.movesBottom}>
              <button onClick={() => startTimeAction(3, doubtActionType)}>
                Trocar
              </button>
            </div>
          </>
        );
      default:
        return (
          <>
            <strong>
              <b>Duque</b>: Pegue 3 moedas (Não pode ser bloqueado)
            </strong>
            <div className={styles.movesBottom}>
              <button>Passar</button>
              <button>Duvidar</button>
            </div>
          </>
        );
    }
  }, [doubtActionType, victim, doubtAction]);

  const plays = () => {
    if (
      Number(room?.users[Number(Number(room.round) - 1)]?.coins) >= 10 &&
      yourAction !== 4
    ) {
      return toast.warning(
        'Você precisa usar "matar" por ter 10 moedas ou mais.'
      );
    }
    switch (yourAction) {
      case 1:
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Renda</b>: Pegue 1 moeda (Não pode ser bloqueado).
              </strong>
              <div className={styles.movesBottom}>
                <button onClick={() => doAction(1)}>Confirmar</button>
              </div>
            </div>
          </>
        );
      case 2:
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Renda Extra</b>: Pegue 2 moedas (Pode ser bloqueado pelo
                duque).
              </strong>
              <div className={styles.movesBottom}>
                <button onClick={() => startTimeAction(2, null)}>
                  Confirmar
                </button>
              </div>
            </div>
          </>
        );
      case 3:
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <div className={styles.movesTop}>
                <h1
                  className={
                    Number(doubtActionType) === 0
                      ? styles.selected
                      : styles.notSelected
                  }
                  onClick={() => setDoubtActionType(0)}
                >
                  Duque
                </h1>
                <h1
                  className={
                    Number(doubtActionType) === 1
                      ? styles.selected
                      : styles.notSelected
                  }
                  onClick={() => setDoubtActionType(1)}
                >
                  Capitão
                </h1>
                <h1
                  className={
                    Number(doubtActionType) === 2
                      ? styles.selected
                      : styles.notSelected
                  }
                  onClick={() => setDoubtActionType(2)}
                >
                  Assassino
                </h1>
                <h1
                  className={
                    Number(doubtActionType) === 3
                      ? styles.selected
                      : styles.notSelected
                  }
                  onClick={() => setDoubtActionType(3)}
                >
                  Condessa
                </h1>
                <h1
                  className={
                    Number(doubtActionType) === 4
                      ? styles.selected
                      : styles.notSelected
                  }
                  onClick={() => setDoubtActionType(4)}
                >
                  Embaixador
                </h1>
              </div>
              {influencerPlays}
            </div>
          </>
        );
      case 4:
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Matar</b>: Pague 7 moedas e escolha algúem para perder uma
                carta e consequentemente 1 vida (Não pode ser bloqueado)
              </strong>
              <div className={styles.movesBottom}>
                <button onClick={() => doAction(4)}>
                  Matar {victim?.username}
                </button>
              </div>
            </div>
          </>
        );

      case 5:
        if (
          String(room?.users[Number(Number(room.round) - 1)]?.id) ===
          String(user_id)
        ) {
          return setPlay(
            <>
              <h1>Jogada :</h1>
              <div className={styles.movesContent}>
                <strong>
                  <b>Duvidar:</b> Esperando os jogadores se pronunciarem sobre a
                  jogada.
                </strong>
              </div>
            </>
          );
        }
        if (Number(doubtAction?.action) === 2) {
          return setPlay(
            <>
              <h1>Jogada :</h1>
              <div className={styles.movesContent}>
                <strong>
                  <b>Duvidar</b>: O Jogador{" "}
                  {String(
                    room?.users[Number(Number(room.round) - 1)]?.username
                  )}{" "}
                  fez a jogada "Renda Extra", você pode bloquear se usar o
                  "Duque". (Se você não for o Duque e ele duvidar de você, você
                  perde uma vida e uma carta)
                </strong>

                <div className={styles.movesBottom}>
                  <button onClick={() => doubt(false)}>Passar</button>
                  <button onClick={() => doubt(true)}>Usar o Duque</button>
                </div>
              </div>
            </>
          );
        }
        if (Number(doubtAction?.action) === 3) {
          if (Number(doubtAction?.doubtActionType) === 0) {
            return setPlay(
              <>
                <h1>Jogada :</h1>
                <div className={styles.movesContent}>
                  <strong>
                    <b>Duvidar</b>: O Jogador{" "}
                    {String(
                      room?.users[Number(Number(room.round) - 1)]?.username
                    )}{" "}
                    fez a jogada {cartas[doubtAction?.doubtActionType]},
                    gostaria de duvidar que ele tem esta carta?. (Se ele
                    realmente for {cartas[doubtAction?.doubtActionType]}, você
                    perde uma vida e uma carta, se não, ele perde uma vida e uma
                    carta.)
                  </strong>

                  <div className={styles.movesBottom}>
                    <button onClick={() => doubtDuqueAction(false)}>
                      Passar
                    </button>
                    <button onClick={() => doubtDuqueAction(true)}>
                      Duvidar
                    </button>
                  </div>
                </div>
              </>
            );
          }
          if (Number(doubtAction?.doubtActionType) === 1) {
            return setPlay(
              <>
                <h1>Jogada :</h1>
                <div className={styles.movesContent}>
                  <strong>
                    <b>Duvidar</b>: O Jogador{" "}
                    {String(
                      room?.users[Number(Number(room.round) - 1)]?.username
                    )}{" "}
                    fez a jogada {cartas[doubtAction?.doubtActionType]} e pegará
                    2 moedas de {doubtAction?.victim?.username}. Você pode
                    duvidar que ele seja {cartas[doubtAction?.doubtActionType]}{" "}
                    {String(doubtAction?.victim?.id) === String(user_id) &&
                      ` ou dizer que você tem ${cartas[1]} ou ${cartas[4]} para bloquear a ação dele`}
                    . (Se um duvidar do outro, quem mentir perde uma vida e uma
                    carta).
                  </strong>

                  <div className={styles.movesBottom}>
                    <button onClick={() => doubtFirstCaptainAction("pass")}>
                      Passar
                    </button>
                    <button onClick={() => doubtFirstCaptainAction("doubt")}>
                      Duvidar
                    </button>
                    {String(doubtAction?.victim?.id) === String(user_id) && (
                      <button onClick={() => startTimeActionBlock(3, 12)}>
                        Bloquear
                      </button>
                    )}
                  </div>
                </div>
              </>
            );
          }
          if (Number(doubtAction?.doubtActionType) === 2) {
            return setPlay(
              <>
                <h1>Jogada :</h1>
                <div className={styles.movesContent}>
                  <strong>
                    <b>Assassinar</b>: O Jogador{" "}
                    {String(
                      room?.users[Number(Number(room.round) - 1)]?.username
                    )}{" "}
                    fez a jogada {cartas[doubtAction?.doubtActionType]} e pagará
                    3 moedas para assassinar uma carta/vida de{" "}
                    {doubtAction?.victim?.username}. Você pode duvidar que ele
                    seja {cartas[doubtAction?.doubtActionType]},{" "}
                    {String(user_id) === String(doubtAction?.victim?.id) &&
                      "ou dizer que voce tem a carta " +
                        cartas[3] +
                        " para cancelar a jogada dele"}
                    . (Se um duvidar do outro, quem mentir perde uma vida e uma
                    carta).
                  </strong>

                  <div className={styles.movesBottom}>
                    <button onClick={() => doubtFirstAssassinAction("pass")}>
                      Passar
                    </button>
                    <button onClick={() => doubtFirstAssassinAction("doubt")}>
                      Duvidar
                    </button>
                    {String(user_id) === String(doubtAction?.victim?.id) && (
                      <button onClick={() => startTimeActionBlock(3, 22)}>
                        Bloquear
                      </button>
                    )}
                  </div>
                </div>
              </>
            );
          }
          if (Number(doubtAction?.doubtActionType) === 4) {
            return setPlay(
              <>
                <h1>Jogada :</h1>
                <div className={styles.movesContent}>
                  <strong>
                    <b>Trocar</b>: O Jogador{" "}
                    {String(
                      room?.users[Number(Number(room.round) - 1)]?.username
                    )}{" "}
                    fez a jogada {cartas[doubtAction?.doubtActionType]} e
                    trocará toda suas cartas por novas. Você pode duvidar que
                    ele seja {cartas[doubtAction?.doubtActionType]} ou apenas
                    passar. (Se um duvidar do outro, quem mentir perde uma vida
                    e uma carta).
                  </strong>

                  <div className={styles.movesBottom}>
                    <button onClick={() => doubtFirstEmbaixadorAction("pass")}>
                      Passar
                    </button>
                    <button onClick={() => doubtFirstEmbaixadorAction("doubt")}>
                      Duvidar
                    </button>
                  </div>
                </div>
              </>
            );
          }
        }

        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Duvidar</b>: O Jogador fez a jogada x, você pode duvidar e se
                ele estiver mentindo ele perde uma vida, mas se for verdade,
                você perde.
              </strong>

              <div className={styles.movesBottom}>
                <button>Passar</button>
                <button>Duvidar</button>
              </div>
            </div>
          </>
        );
      case 6:
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Duvidar:</b> Esperando os jogadores se pronunciarem sobre a
                jogada.
              </strong>
            </div>
          </>
        );
      case 7:
        if (doubtAction?.action === 7) {
          return setPlay(
            <>
              <h1>Jogada :</h1>
              <div className={styles.movesContent}>
                <strong>
                  <b>Duvidar</b>: O Jogador {doubtAction?.username} fez a jogada
                  "Usar Duque", você pode duvidas que ele tenha o "Duque". (Se
                  ele não for o Duque ele perde uma vida e uma carta, se for,
                  você perde.)
                </strong>

                <div className={styles.movesBottom}>
                  <button onClick={() => doubtDuque(false)}>Passar</button>
                  <button onClick={() => doubtDuque(true)}>
                    Duvidar que tenha Duque
                  </button>
                </div>
              </div>
            </>
          );
        }
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Duvidar:</b> Esperando os jogadores se pronunciarem sobre a
                jogada.
              </strong>
            </div>
          </>
        );
      case 8:
        if (Number(doubtAction?.doubtActionType) === 12) {
          if (String(doubtAction?.user?.id) === String(user_id)) {
            return setPlay(
              <>
                <h1>Jogada :</h1>
                <div className={styles.movesContent}>
                  <strong>
                    <b>Bloquear:</b> Esperando os jogadores se pronunciarem
                    sobre a jogada.
                  </strong>
                </div>
              </>
            );
          }
          return setPlay(
            <>
              <h1>Jogada :</h1>
              <div className={styles.movesContent}>
                <strong>
                  <b>Bloquear</b>: O Jogador {doubtAction?.user?.username} fez a
                  jogada "Bloquear", dizendo ser {cartas[1]} ou {cartas[4]} e
                  cancelará a jogada de{" "}
                  {room?.users[Number(Number(room.round) - 1)]?.username}. Você
                  pode duvidar que ele tenha alguma destas cartas ou apenas
                  passar. (Se um duvidar do outro, quem mentir perde uma vida e
                  uma carta).
                </strong>

                <div className={styles.movesBottom}>
                  <button onClick={() => doubtSecondCaptainAction("blockPass")}>
                    Passar
                  </button>
                  <button onClick={() => doubtSecondCaptainAction("block")}>
                    Duvidar
                  </button>
                </div>
              </div>
            </>
          );
        }

        if (Number(doubtAction?.doubtActionType) === 22) {
          if (
            String(room?.users[Number(Number(room.round) - 1)]?.id) ===
            String(user_id)
          ) {
            return setPlay(
              <>
                <h1>Jogada :</h1>
                <div className={styles.movesContent}>
                  <strong>
                    <b>Bloquear</b>: O Jogador {doubtAction?.user?.username} fez
                    a jogada "Bloquear", dizendo ser {cartas[3]} e cancelará a
                    jogada de{" "}
                    {room?.users[Number(Number(room.round) - 1)]?.username}.
                    Você pode duvidar que ele tenha {cartas[3]} ou apenas
                    passar. (Se um duvidar do outro, quem mentir perde uma vida
                    e uma carta).
                  </strong>

                  <div className={styles.movesBottom}>
                    <button
                      onClick={() => doubtSecondAssassinAction("blockPass")}
                    >
                      Passar
                    </button>
                    <button onClick={() => doubtSecondAssassinAction("block")}>
                      Duvidar
                    </button>
                  </div>
                </div>
              </>
            );
          }
          return setPlay(
            <>
              <h1>Jogada :</h1>
              <div className={styles.movesContent}>
                <strong>
                  <b>Bloquear:</b> Esperando os jogadores se pronunciarem sobre
                  a jogada.
                </strong>
              </div>
            </>
          );
        }
        return setPlay(
          <>
            <h1>Jogada :</h1>
            <div className={styles.movesContent}>
              <strong>
                <b>Duvidar:</b> Esperando os jogadores se pronunciarem sobre a
                jogada.
              </strong>
            </div>
          </>
        );
      default:
        if (
          String(room?.users[Number(Number(room.round) - 1)]?.id) ===
          String(user_id)
        ) {
          return setPlay(
            <h1>
              Sua vez: Escolha uma jogada para realizar na coluna da direita.
            </h1>
          );
        }
        return setPlay(
          <h1>
            Vez de: {room?.users[Number(Number(room.round) - 1)]?.username}
          </h1>
        );
    }
  };

  useEffect(() => {
    plays();
  }, [yourAction, room.round, victim?.id, doubtAction, doubtActionType]);

  const startGame = async () => {
    loading.start();

    try {
      const response = await api.post(`/sala/iniciar`, {
        sala_id,
        user_id,
      });

      const me = response.data.users.find((usuario) => {
        return String(usuario.id) === String(user_id);
      });

      const opponents = response.data.users.filter((usuario) => {
        return String(usuario.id) !== String(user_id);
      });

      setRoom({ ...response.data, me, opponents });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Start da sala falhou");
    } finally {
      loading.stop();
    }
  };

  const doAction = async (action) => {
    if (isLoading) {
      return toast.warning("Espere sua jogada terminar");
    }
    if (action === 4 && !victim?.id) {
      return toast.warning("Selecione uma vitima");
    }
    try {
      setLoading(true);
      const response = await api.post(`/sala/action`, {
        sala_id,
        user_id,
        action,
        victim_id: victim?.id,
      });

      const me = response.data.users.find((usuario) => {
        return String(usuario.id) === String(user_id);
      });

      const opponents = response.data.users.filter((usuario) => {
        return String(usuario.id) !== String(user_id);
      });

      setRoom({ ...response.data, me, opponents });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Start da sala falhou");
    } finally {
      setLoading(false);
    }
  };

  const getRoom = async () => {
    loading.start();

    try {
      const response = await api.get(`/sala/${sala_id}`);

      const me = response.data.users.find((usuario) => {
        return String(usuario.id) === String(user_id);
      });

      const opponents = response.data.users.filter((usuario) => {
        return String(usuario.id) !== String(user_id);
      });

      setRoom({ ...response.data, me, opponents });
    } catch (err) {
    } finally {
      loading.stop();
    }
  };

  const socket = useMemo(() => {
    if (user_id) {
      return socketio(process.env.NEXT_PUBLIC_API as string, {
        transports: ["websocket"],
        query: {
          user_id,
        },
      });
    }
  }, [user_id]);

  useEffect(() => {
    if (sala_id) {
      socket.emit(`newRoom`, sala_id);

      socket.on(`joinRoom`, () => {
        getRoom();
      });

      socket.on(`passOnly`, () => {
        getRoom();
      });

      socket.on(`startRoom`, () => {
        getRoom();
      });

      socket.on(`actionDoubt`, (msg) => {
        getRoom();
        setDoAction(5);
        setDoubtAction(msg);
      });

      socket.on(`actionDoubtBlock`, (msg) => {
        getRoom();
        setDoAction(8);
        setDoubtAction(msg);
      });

      socket.on(`2DoubtDuque`, (msg) => {
        getRoom();
        setDoAction(7);
        setDoubtAction(msg);
      });

      socket.on(`actionDid`, () => {
        getRoom();
        setDoAction(0);
      });

      socket.on(`passRound`, () => {
        getRoom();
        setDoAction(0);
      });

      socket.on(`AnyleaveRoom`, () => {
        getRoom();
      });
    }
  }, [socket]);

  useEffect(() => {
    getRoom();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>A Corte | Sala {room?.name}</title>
        <meta name="description" content="login a corte" />
      </Head>
      <div className={styles.roomHeader}>
        <h1>Jogadores :</h1>
        <button onClick={() => router.push("/")}>
          <CgLogOut size={28} color="#c92828" cursor="pointer" />
          Sair
        </button>
      </div>
      <div className={styles.main}>
        {room.me && (
          <Player
            myRound={
              String(room?.users[Number(room?.round) - 1]?.id) ===
              String(room.me.id)
            }
            answer={room.me.pass || room.me.doubt}
            selected={false}
            onClick={() => {}}
            vidas={room.me.cards.length}
            moedas={room.me.coins}
            nome={room.me.username}
            me
            avatar={room.me.avatar}
            key={room.me.id}
          />
        )}
        {room?.opponents?.map((user) => {
          return (
            <Player
              myRound={
                String(room?.users[Number(room?.round) - 1]?.id) ===
                String(user.id)
              }
              answer={user.pass || user.doubt}
              selected={user.id === victim.id}
              onClick={() => setVictim(user)}
              vidas={user.cards.length}
              moedas={user.coins}
              nome={user.username}
              avatar={user.avatar}
              key={user.id}
            />
          );
        })}
      </div>
      <div className={styles.movesBoard}>
        <div
          className={`${styles.movesInBoard} ${
            String(room?.users[Number(room?.round) - 1]?.id) === String(user_id)
              ? styles.myRound
              : styles.notMyRound
          }`}
        >
          {play}
          <div className={styles.movesFooter}>
            <h2>Seus dados: {room?.me?.username}</h2>
            <div className={styles.datas}>
              <div className={styles.personalData}>
                {room?.me?.cards?.map((card) => {
                  return <button key={card.id}>{card.name}</button>;
                })}
              </div>
              <div className={styles.personaStars}>
                <RiHeartFill size={25} color={"var(--gray-900)"} />

                <p>{room.me?.cards.length}</p>
                <RiMoneyDollarCircleFill size={25} color={"var(--gray-900)"} />

                <p>{room.me?.coins}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.movesOutBoard}>
          <h1
            className={
              Number(yourAction) === 1 ? styles.selected : styles.notSelected
            }
            onClick={() => playAction(1)}
          >
            Renda
          </h1>
          <h1
            className={
              Number(yourAction) === 2 ? styles.selected : styles.notSelected
            }
            onClick={() => playAction(2)}
          >
            Renda Extra
          </h1>
          <h1
            className={
              Number(yourAction) === 3 ? styles.selected : styles.notSelected
            }
            onClick={() => playAction(3)}
          >
            Poder
          </h1>
          <h1
            className={
              Number(yourAction) === 4 ? styles.selected : styles.notSelected
            }
            onClick={() => playAction(4)}
          >
            Matar
          </h1>
          <h1 className={styles.notSelected}>Regra</h1>
          <h1 className={styles.notSelected} onClick={startGame}>
            New
          </h1>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
