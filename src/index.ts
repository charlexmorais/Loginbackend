
import { Client } from "pg";
import dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import { UsersService } from "./services/usersServices";
import { verifyToken} from "./conections/authorization"
import express from "express";
export const SECRET = process.env.SECRET;

const cors = require('cors');


dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

export const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5433,
});

db.connect();

const usersService = new UsersService(db);

export const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");



app.post("/login", async (req, res, next) => {
  try {
    const { usuario, senha } = req.body;
    const foundUser = await usersService.getByUsername(usuario);

    if (foundUser) {
      const correctPassword = await bcrypt.compare(senha, foundUser.senha);

      if (correctPassword) {
        const token = jwt.sign({ usuario: foundUser.usuario }, SECRET, {
          expiresIn: 300, // expires in 5 minutes
        });
        return res.json({ auth: true, token: token });
      }
    }

    res.status(401).json({ auth: false, message: "Credenciais inválidas." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao tentar fazer login." });
  }
});
app.get("/usuarios",verifyToken,async (req, res) => {
  try {
    const usuarios = await usersService.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/usuarios/:id",verifyToken,async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.find(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const user = await usersService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/usuarios/:id",verifyToken,async (req, res) => {
  try {
    const { id } = req.params;
    const userDataToUpdate = req.body;

   
    const existingUser = await usersService.find(id);

    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }


    const updatedUser = await usersService.update(id, userDataToUpdate);

    res.json({ message: "Usuário atualizado com sucesso", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete("/usuarios/:id",verifyToken, async (req, res) => {

  try {
    const { id } = req.params;
    await usersService.delete(id);
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersService.getByEmail(email);

    if (user) {
      res.json({ message: "Um link de recuperação foi enviado para o seu email.. Sucesso!" });
    } else {
      res.status(200).json({ message: "Email não encontrado" });
    }
  } catch (error) {
    console.error("Erro na verificação de email:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


app.listen(port, () => {
  console.log("server run", port);
  
});
