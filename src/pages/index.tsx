import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import { api } from "../services/api";
import styles from "../styles/home.module.scss";

export default function Home() {
  const [values, setValues] = useState({} as { [key: string]: any });
  const [loading, setLoading] = useState(false);

  const enterRoom = async () => {
    setLoading(true);
    try {
      const response = await api.post("/sala", {
        ...values,
        avatar:
          values.avatar ||
          "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png",
      });

      Router.push(`/${response.data.room.id}/${response.data.user.id}`);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Criação dos dados da sala falhou"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>A Corte | Entrar</title>
        <meta name="description" content="login a corte" />
      </Head>
      <div className={styles.board}>
        <img
          src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png"
          alt="Avatar"
        />
        <label>Avatar URL</label>
        <input
          value={values?.avatar}
          name="avatar"
          placeholder="Avatar"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
        ></input>
        <label>Nome de usuário</label>
        <input
          value={values?.nome_usuario}
          name="nome_usuario"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
          placeholder="Usuário"
        ></input>
        <label>Nome da sala</label>
        <input
          value={values?.nome_sala}
          name="nome_sala"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
          placeholder="Nome da sala"
        ></input>
        <button onClick={enterRoom}>
          {loading ? (
            <Loader type="Circles" color="#fff" height={14} width={14} />
          ) : (
            "Entrar"
          )}
        </button>
      </div>
    </div>
  );
}
