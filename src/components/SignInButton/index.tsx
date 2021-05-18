import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { signIn, signOut, useSession } from "next-auth/client";

export function SignInButton() {
  const [session] = useSession();

  return session ? (
    <button className={styles.signInButton} type="button">
      <FaGithub color="#84d361" />
      {session.user.name}
      <FiX
        onClick={() => signOut()}
        color="#737380"
        className={styles.closeIcon}
      />
    </button>
  ) : (
    <button
      onClick={() => signIn("github")}
      className={styles.signInButton}
      type="button"
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}
