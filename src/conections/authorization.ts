const jwt = require('jsonwebtoken');
import { SECRET } from "../index";

require('dotenv').config();

export const verifyToken = (req, res, next) => {
  const token = req.headers["x-api-key"]; 

  if (!token) {
    return res.status(401).json({ auth: false, message: "Nenhum token fornecido." });
  }

  try {
    const decoded = jwt.verify(token, SECRET, { algorithms: ['HS256'] });

    // Adiciona informações decodificadas para uso posterior
    req.decoded = decoded;

    
    const now = Math.floor(Date.now() / 1000); 
    if (decoded.exp - now < 30) {
      const renewedToken = jwt.sign({}, SECRET, { expiresIn: '1h' });
      res.setHeader('Authorization', renewedToken);
    }

    next();
  } catch (err) {
   
    return res.status(401).json({ auth: false, message: "Token inválido." });
  }
};
