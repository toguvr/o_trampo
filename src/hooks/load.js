import React, { createContext, useContext, useCallback, useState } from "react";
import LoaderWhole from "../components/LoaderWhole";

export const LoadContext = createContext();

export const LoadProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const start = useCallback(() => {
    setLoading(true);
  }, []);

  const stop = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <LoadContext.Provider value={{ start, stop }}>
      {loading && <LoaderWhole />}
      {children}
    </LoadContext.Provider>
  );
};

export function useLoading() {
  const context = useContext(LoadContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
