"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt = require('jsonwebtoken');
const index_1 = require("../index");
require('dotenv').config();
const verifyToken = (req, res, next) => {
    const token = req.headers["x-api-key"];
    if (!token) {
        return res.status(401).json({ auth: false, message: "Nenhum token fornecido." });
    }
    try {
        const decoded = jwt.verify(token, index_1.SECRET, { algorithms: ['HS256'] });
        // Adiciona informações decodificadas para uso posterior
        req.decoded = decoded;
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp - now < 30) {
            const renewedToken = jwt.sign({}, index_1.SECRET, { expiresIn: '1h' });
            res.setHeader('Authorization', renewedToken);
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ auth: false, message: "Token inválido." });
    }
};
exports.verifyToken = verifyToken;
