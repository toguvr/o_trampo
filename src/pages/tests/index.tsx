import Head from "next/head";
import { useState } from "react";
import { api } from "../../services/api";
import styles from "../styles/home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  const [values, setValues] = useState({});

  const getRoom = async () => {
    try {
      const response = await api.get("/sala?sala_id=1");

      console.log(response.data);
    } catch (err) {}
  };

  const takeCard = async () => {
    try {
      const response = await api.post("/sala", values);

      console.log(response.data);
    } catch (err) {}
  };

  const startRoom = async () => {
    try {
      const response = await api.post("/iniciar", {
        sala_id: 4,
        user_id: 1,
      });

      console.log(response.data);
    } catch (err) {}
  };
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <input
            value={values.avatar}
            name="avatar"
            placeholder="Avatar"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type="text"
          />
          <input
            placeholder="Nome Usuario"
            value={values.nome_usuario}
            name="nome_usuario"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type="text"
          />
          <input
            placeholder="Nome Sala"
            value={values.nome_sala}
            name="nome_sala"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type="text"
          />
          <button onClick={takeCard}>Entrar</button>
          <button onClick={getRoom}>Ver Sala</button>
          <button onClick={startRoom}>Iniciar</button>
          <h1>
            News about the <span>React</span> world.
          </h1>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}
