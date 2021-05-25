import React from "react";
import { LoadProvider } from "./load";

const AppProvider = ({ children }) => {
  return <LoadProvider>{children}</LoadProvider>;
};

export default AppProvider;
