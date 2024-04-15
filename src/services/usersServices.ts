import { InterfaceCrud } from "./interfaces";
import * as bcrypt from "bcrypt";

interface UsersModel {
  usuario: string;
  senha: string;
  salt: string;
  email: string;
}

export class UsersService implements InterfaceCrud<UsersModel> {
  db: any; // Conexão com o banco de dados.

  constructor(db: any) {
    this.db = db;
  }

  private async createPasswordHash(
    senha: string
  ): Promise<{ passwordEncrypted: string; salt: string }> {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordEncrypted = await bcrypt.hash(senha, salt);

      return { passwordEncrypted, salt };
    } catch (error) {
      throw new Error("Error while hashing the password.");
    }
  }

  async CHECKPASSWORD(
    usuario: UsersModel,
    passwordUsers: string
  ): Promise<boolean> {
    try {
      const { senha, salt } = usuario;
      const result = await bcrypt.compare(passwordUsers, senha);
      return result;
    } catch (error) {
      throw new Error("Error while verifying the password.");
    }
  }

  async getByUsername(usuario: string): Promise<UsersModel | null> {
    const query = "SELECT * FROM usuarios WHERE usuario = $1";
    const result = await this.db.query(query, [usuario]);
    return result.rows[0] || null;
  }
  async getByEmail(email: string): Promise<UsersModel | null> {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const result = await this.db.query(query, [email]);
    return result.rows[0] || null;
  }

  async create(payload: Omit<UsersModel, "id">): Promise<UsersModel> {
    try {
      const { usuario, senha, email } = payload;
      const { passwordEncrypted, salt } = await this.createPasswordHash(senha);

      const query = `
     INSERT INTO usuarios (usuario, senha, salt, email) 
      VALUES ($1, $2, $3, $4) RETURNING *;
`;
      const values = [usuario, passwordEncrypted, salt, email];
      const result = await this.db.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error while creating the user:", error);
      throw new Error("Error while creating the user.");
    }
  }

  async getAll(): Promise<UsersModel[]> {
    const result = await this.db.query("SELECT * FROM usuarios");
    return result.rows as UsersModel[];
  }

  async find(id: string): Promise<UsersModel | null> {
    try {
      const result = await this.db.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [id]
      );
      console.log("Result:", result);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in find function:", error);
      throw error;
    }
  }
  async update(id: string, payload: Partial<UsersModel>): Promise<UsersModel> {
    const { usuario, senha, email } = payload;
  
    if (senha) {
      const { passwordEncrypted, salt } = await this.createPasswordHash(senha);
      const values = [usuario, passwordEncrypted, salt, email, id];
  
      const result = await this.db.query(
        "UPDATE usuarios SET usuario = $1, senha = $2, salt = $3, email = $4 WHERE id = $5 RETURNING *;",
        values
      );
  
      return result.rows[0];
    } else if (usuario || email) {
      // Se senha não foi fornecida, mas há alterações em usuário ou email
      const values = [usuario, email, id];
  
      const result = await this.db.query(
        "UPDATE usuarios SET usuario = $1, email = $2 WHERE id = $3 RETURNING *;",
        values
      );
  
      return result.rows[0];
    } else {
      // Lógica para o caso em que nem senha, usuário ou email são fornecidos
      throw new Error("Nenhum campo de atualização fornecido.");
    }
  }
  

  async delete(id: string): Promise<void> {
    await this.db.query("DELETE FROM usuarios WHERE id = $1", [id]);
  }
}
