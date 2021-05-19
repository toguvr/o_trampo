import Router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import styles from "../styles/home.module.scss";

export default function Home() {
  const [values, setValues] = useState({} as { [key: string]: any });

  const enterRoom = async () => {
    try {
      const response = await api.post("/sala", {
        ...values,
        avatar:
          values.avatar ||
          "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png",
      });

      Router.push(`/${response.data.sala.id}/${response.data.user}`);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <img
          src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png"
          alt="Avatar"
        />
        <label>Avatar URL</label>
        <input
          value={values.avatar}
          name="avatar"
          placeholder="Avatar"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
        ></input>
        <label>Nome de usuário</label>
        <input
          value={values.nome_usuario}
          name="nome_usuario"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
          placeholder="Usuário"
        ></input>
        <label>Nome da sala</label>
        <input
          value={values.nome_sala}
          name="nome_sala"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
          placeholder="Nome da sala"
        ></input>
        <button onClick={enterRoom}>Entrar</button>
      </div>
    </div>
  );
}
