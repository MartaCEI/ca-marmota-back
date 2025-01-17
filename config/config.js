// Permite leer las variables de entorno de un archivo .env
import dotenv from 'dotenv';

dotenv.config();

// Para saber cual es la carpeta en la que se está ejecutando el servidor. 
//Dice exactamente en que carpeta se encuentra el archivo en el index.js middlewares
// Para que vercel acceda a nuestra carpeta public
import path from 'path';
// Configura __dirname correctamente para manejar rutas de archivos
export const __dirname = path.resolve();

export const PORT = process.env.PORT || 3000;
export const DOMAIN = process.env.DOMAIN || 'http://localhost:';

export const DB = process.env.MONGO_URI;

export const JWT_SECRET = process.env.JWT_SECRET || "utiliza_otra_clave_segura_no_esta"

