import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import db from "../../../db.json";

function montarBaralho(jogadores) {
  let cartas = ["Caixa", "RH", "CEO", "Jurídico", "Novato"];
  let baralho = [];
  if (jogadores >= 3 && jogadores <= 6) {
    cartas.map((carta, index) => {
      let i = 0;
      while (i < 3) {
        baralho.push({ id: index + i + 1, carta });
        i++;
      }

      return baralho;
    });
  } else if (jogadores === 7 || jogadores === 8) {
    cartas.map((carta) => {
      let i = 0;
      while (i < 4) {
        baralho.push(carta);
        i++;
      }

      return baralho;
    });
  } else if (jogadores === 9 || jogadores === 10) {
    cartas.map((carta) => {
      let i = 0;
      while (i < 5) {
        baralho.push(carta);
        i++;
      }

      return baralho;
    });
  } else {
    return baralho;
  }

  return baralho;
}

function embaralhar(cartasParaEmbaralhar) {
  for (
    var j, x, i = cartasParaEmbaralhar.length;
    i;
    j = Math.floor(Math.random() * i),
      x = cartasParaEmbaralhar[--i],
      cartasParaEmbaralhar[i] = cartasParaEmbaralhar[j],
      cartasParaEmbaralhar[j] = x
  );
  return cartasParaEmbaralhar;
}

function comprar(baralhoAtual, qtd) {
  return baralhoAtual.slice(0, qtd);
}

function devolver(baralhoAtual, cartaParaDevolver) {
  return baralhoAtual.push(cartaParaDevolver);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
  }
  if (req.method === "POST") {
    const { sala_id, user_id } = req.body;

    const salaCorreta = db.find((sala) => {
      return String(sala.id) === String(sala_id);
    });

    const salaIndex = db.findIndex((sala) => {
      return String(sala.id) === String(sala_id);
    });

    if (String(salaCorreta.adminId) !== String(user_id)) {
      return res
        .status(401)
        .json({ message: "Apenas o admin pode iniciar a partida" });
    }

    const cartas = montarBaralho(5);

    embaralhar(cartas);

    const usuariosResetados = salaCorreta.usuarios.map((usuario) => {
      return {
        ...usuario,
        duvido: false,
        passou: false,
        moedas: 0,
        cartas: comprar(cartas, 2),
      };
    });

    salaCorreta.usuarios = usuariosResetados;
    salaCorreta.baralho = cartas;
    salaCorreta.espera = false;
    salaCorreta.rodada = 1;

    db[salaIndex] = salaCorreta;

    console.log(db);

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
