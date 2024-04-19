"use strict";
// import { Client } from "pg";
// import dotenv from "dotenv";
// import * as bcrypt from "bcrypt";
// import { UsersService } from "./services/usersServices";
// import { verifyToken } from "./conections/authorization";
// import express from "express";
// export const SECRET = process.env.SECRET;
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = exports.db = exports.SECRET = void 0;
// import cors from "cors"; // Importing cors as ES module
// dotenv.config();
// const app = express();
// const port = 3000;
// app.use(express.json());
// app.use(cors());
// export const db = new Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: 5433,
// });
// db.connect();
// const usersService = new UsersService(db);
// export const jwt = require("jsonwebtoken"); // You may leave this line as is if using CommonJS require syntax
// const bodyParser = require("body-parser"); // You may leave this line as is if using CommonJS require syntax
// app.post("/login", async (req, res, next) => {
//   try {
//     const { usuario, senha } = req.body;
//     const foundUser = await usersService.getByUsername(usuario);
//     if (foundUser) {
//       const correctPassword = await bcrypt.compare(senha, foundUser.senha);
//       if (correctPassword) {
//         const token = jwt.sign({ usuario: foundUser.usuario }, SECRET, {
//           expiresIn: 300, // expires in 5 minutes
//         });
//         return res.json({ auth: true, token: token });
//       }
//     }
//     res.status(401).json({ auth: false, message: "Credenciais inválidas." });
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao tentar fazer login." });
//   }
// });
// app.get("/usuarios", verifyToken, async (req, res) => {
//   try {
//     const usuarios = await usersService.getAll();
//     res.json(usuarios);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.get("/usuarios/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await usersService.find(id);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.post("/usuarios", async (req, res) => {
//   try {
//     const user = await usersService.create(req.body);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.put("/usuarios/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userDataToUpdate = req.body;
//     const existingUser = await usersService.find(id);
//     if (!existingUser) {
//       return res.status(404).json({ message: "Usuário não encontrado" });
//     }
//     const updatedUser = await usersService.update(id, userDataToUpdate);
//     res.json({ message: "Usuário atualizado com sucesso", user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.delete("/usuarios/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await usersService.delete(id);
//     res.json({ message: "Usuário excluído com sucesso" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.post("/check-email", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await usersService.getByEmail(email);
//     if (user) {
//       res.json({ message: "Um link de recuperação foi enviado para o seu email.. Sucesso!" });
//     } else {
//       res.status(200).json({ message: "Email não encontrado" });
//     }
//   } catch (error) {
//     console.error("Erro na verificação de email:", error);
//     res.status(500).json({ error: "Erro interno do servidor" });
//   }
// });
// app.listen(port, () => {
//   console.log("server run", port);
// });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt = __importStar(require("bcrypt"));
const usersServices_1 = require("./services/usersServices");
const authorization_1 = require("./conections/authorization");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Importando cors como módulo ES
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
// Configurando o CORS com opções específicas
const corsOptions = {
    origin: "*", // Permitindo solicitações de qualquer origem. Você pode especificar origens específicas aqui.
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Permitindo os métodos HTTP especificados.
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
exports.SECRET = process.env.SECRET;
exports.db = new pg_1.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5433,
});
exports.db.connect();
const usersService = new usersServices_1.UsersService(exports.db);
exports.jwt = require("jsonwebtoken"); // Você pode deixar esta linha como está se estiver usando a sintaxe require comum
app.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, senha } = req.body;
        const foundUser = yield usersService.getByUsername(usuario);
        if (foundUser) {
            const correctPassword = yield bcrypt.compare(senha, foundUser.senha);
            if (correctPassword) {
                const token = exports.jwt.sign({ usuario: foundUser.usuario }, exports.SECRET, {
                    expiresIn: 300, // expires in 5 minutes
                });
                return res.json({ auth: true, token: token });
            }
        }
        res.status(401).json({ auth: false, message: "Credenciais inválidas." });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao tentar fazer login." });
    }
}));
app.get("/usuarios", authorization_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield usersService.getAll();
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/usuarios/:id", authorization_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield usersService.find(id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post("/usuarios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersService.create(req.body);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.put("/usuarios/:id", authorization_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userDataToUpdate = req.body;
        const existingUser = yield usersService.find(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        const updatedUser = yield usersService.update(id, userDataToUpdate);
        res.json({ message: "Usuário atualizado com sucesso", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.delete("/usuarios/:id", authorization_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield usersService.delete(id);
        res.json({ message: "Usuário excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post("/check-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield usersService.getByEmail(email);
        if (user) {
            res.json({ message: "Um link de recuperação foi enviado para o seu email.. Sucesso!" });
        }
        else {
            res.status(200).json({ message: "Email não encontrado" });
        }
    }
    catch (error) {
        console.error("Erro na verificação de email:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}));
app.listen(port, () => {
    console.log("server run", port);
});
