import React from "react";

import Loader from "react-loader-spinner";
import styles from "./styles.module.scss";

const LoaderWhole = () => {
  return (
    <div className={styles.wrapper}>
      <Loader type="Circles" color="#fff" height={100} width={100} />
    </div>
  );
};

export default LoaderWhole;
