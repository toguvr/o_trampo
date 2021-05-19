import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import db from "../../../db.json";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { sala_id } = req.query;

    const salaCorreta = db.find((sala) => {
      return String(sala.id) === String(sala_id);
    });

    return res.status(200).json(salaCorreta);
  }
  if (req.method === "POST") {
    const { nome_sala, nome_usuario, avatar } = req.body;

    const salaIndex = db.findIndex((sala) => {
      return (
        String(sala.nome).toLowerCase() === String(nome_sala).toLowerCase()
      );
    });

    if (!nome_sala || !nome_usuario || !avatar) {
      return res.status(400).json({ message: "Algum dado nao enviado" });
    }

    if (salaIndex === -1) {
      console.log("entrei");

      const salaId = db.length;

      db.push({
        id: salaId,
        espera: false,
        nome: nome_sala,
        adminId: 1,
        rodada: 0,
        baralho: [],
        usuarios: [
          {
            id: 1,
            nome: nome_usuario,
            avatar: avatar,
            cartas: [],
            duvido: false,
            passou: false,
            moedas: 0,
          },
        ],
      });

      fs.writeFile("db.json", JSON.stringify(db, null, 2), function (err) {
        if (err) {
          return res.send("Erro ao gravar dados.");
        }

        return res.status(200).json({
          sala: {
            id: salaId,
            espera: false,
            nome: nome_sala,
            adminId: 1,
            rodada: 0,
            baralho: [],
            usuarios: [
              {
                id: 1,
                nome: nome_usuario,
                avatar: avatar,
                cartas: [],
                duvido: false,
                passou: false,
                moedas: 0,
              },
            ],
          },
          user: 1,
        });
      });

      return;
    }
    console.log("nao entrei");

    const numeroDeUsuariosNaSala = db[salaIndex]?.usuarios?.length;

    db[salaIndex].usuarios.push({
      id: numeroDeUsuariosNaSala + 1,
      nome: nome_usuario,
      avatar: avatar,
      cartas: [],
      duvido: false,
      passou: false,
      moedas: 0,
    });

    fs.writeFile("db.json", JSON.stringify(db, null, 2), function (err) {
      if (err) {
        return res.send("Erro ao gravar dados.");
      }
      return res
        .status(200)
        .json({ sala: db[salaIndex], user: numeroDeUsuariosNaSala + 1 });
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
