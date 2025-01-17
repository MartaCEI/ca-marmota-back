import { JWT_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken'

// Middleware para verificar el token
export const authenticateToken = (req, res, next) => {
    // Obtener el token de la cabecera de la solicitud
    const authHeader = req.headers['authorization'];
    // Constriur la cabecera de autorización con el token
    const token = authHeader && authHeader.split(' ')[1];
    // Si no hay token, responder con un código de estado 401 (no autorizado)
    if(!token) return res.sendStatus(401);
    // Verificar el token con la llave secreta
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403); //forbidden
        // Si el token es correcto, añadir el usuario a la solicitud
        req.user = user;
        // Si la llave es correcta, hacemos un next()
        next()
    })
}