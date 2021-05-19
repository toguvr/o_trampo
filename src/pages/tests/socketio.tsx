import { useEffect } from "react";
import io from "socket.io-client";
import { api } from "../../services/api";
import db from "../../../db.json";

export default () => {
  useEffect(() => {
    console.log(db);
  }, [db]);

  // useEffect(() => {
  //   fetch("/api/socketio").finally(() => {
  //     const socket = io({
  //       query: {
  //         user_id: 5,
  //       },
  //     });

  //     socket.on("connect", () => {
  //       console.log("connect");
  //       socket.emit("hello", "ta");
  //     });

  //     socket.on("hello", (data) => {
  //       console.log("oie", data);
  //     });

  //     socket.on("a user connected", () => {
  //       console.log("entrou um");
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("disconnect");
  //     });
  //   });
  // });

  const startRoom = async () => {
    try {
      const response = await api.post("/iniciar", {
        sala_id: 1,
        user_id: 1,
      });

      console.log(response.data);
    } catch (err) {}
  };

  const getRoom = async () => {
    try {
      const response = await api.get("/sala?sala_id=1");

      console.log(response.data);
    } catch (err) {}
  };

  return (
    <>
      <h1>Socket.io</h1>
      <button onClick={startRoom}>Mostrar</button>
      {/* {show && <h1>Testando</h1>} */}
    </>
  );
};
