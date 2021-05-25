import { AppProps } from "next/app";

import "../styles/global.scss";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import AppProvider from "../hooks";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppProvider>
  );
}

export default MyApp;
