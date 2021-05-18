import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import { SignInButton } from "../SignInButton";

import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};

export default Header;
