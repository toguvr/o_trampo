import styles from "../styles/home.module.scss";

export default function Home() {
 return (
   <div className={styles.container}>
     <div className={styles.board}>
       <img src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png" alt="Avatar" />
       <label>Avatar URL</label>
       <input placeholder="Avatar"></input>
       <label>Nome de usuário</label>
       <input placeholder="Usuário"></input>
       <label>Nome da sala</label>
       <input placeholder="Nome da sala"></input>
       <button>Entrar</button>
     </div>
     </div>
 )
}
