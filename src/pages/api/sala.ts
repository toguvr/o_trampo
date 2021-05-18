import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
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
      return sala.nome === nome_sala;
    });

    if (!nome_sala || !nome_usuario || !avatar) {
      return res.status(400).json({ message: "Algum dado nao enviado" });
    }

    console.log(salaIndex);

    if (salaIndex === -1) {
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
      });
    }

    const numeroDeUsuariosNaSala = db[salaIndex].usuarios.length;

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
      return res.status(200).json(db[salaIndex]);
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
