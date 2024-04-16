"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcrypt = __importStar(require("bcrypt"));
class UsersService {
    constructor(db) {
        this.db = db;
    }
    createPasswordHash(senha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saltRounds = 10;
                const salt = yield bcrypt.genSalt(saltRounds);
                const passwordEncrypted = yield bcrypt.hash(senha, salt);
                return { passwordEncrypted, salt };
            }
            catch (error) {
                throw new Error("Error while hashing the password.");
            }
        });
    }
    CHECKPASSWORD(usuario, passwordUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senha, salt } = usuario;
                const result = yield bcrypt.compare(passwordUsers, senha);
                return result;
            }
            catch (error) {
                throw new Error("Error while verifying the password.");
            }
        });
    }
    getByUsername(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM usuarios WHERE usuario = $1";
            const result = yield this.db.query(query, [usuario]);
            return result.rows[0] || null;
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM usuarios WHERE email = $1";
            const result = yield this.db.query(query, [email]);
            return result.rows[0] || null;
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario, senha, email } = payload;
                const { passwordEncrypted, salt } = yield this.createPasswordHash(senha);
                const query = `
     INSERT INTO usuarios (usuario, senha, salt, email) 
      VALUES ($1, $2, $3, $4) RETURNING *;
`;
                const values = [usuario, passwordEncrypted, salt, email];
                const result = yield this.db.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                console.error("Error while creating the user:", error);
                throw new Error("Error while creating the user.");
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.query("SELECT * FROM usuarios");
            return result.rows;
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.query("SELECT * FROM usuarios WHERE id = $1", [id]);
                console.log("Result:", result);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error("Error in find function:", error);
                throw error;
            }
        });
    }
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, senha, email } = payload;
            if (senha) {
                const { passwordEncrypted, salt } = yield this.createPasswordHash(senha);
                const values = [usuario, passwordEncrypted, salt, email, id];
                const result = yield this.db.query("UPDATE usuarios SET usuario = $1, senha = $2, salt = $3, email = $4 WHERE id = $5 RETURNING *;", values);
                return result.rows[0];
            }
            else if (usuario || email) {
                // Se senha não foi fornecida, mas há alterações em usuário ou email
                const values = [usuario, email, id];
                const result = yield this.db.query("UPDATE usuarios SET usuario = $1, email = $2 WHERE id = $3 RETURNING *;", values);
                return result.rows[0];
            }
            else {
                // Lógica para o caso em que nem senha, usuário ou email são fornecidos
                throw new Error("Nenhum campo de atualização fornecido.");
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.query("DELETE FROM usuarios WHERE id = $1", [id]);
        });
    }
}
exports.UsersService = UsersService;
