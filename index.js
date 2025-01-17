import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js'
import { PORT, DOMAIN } from './config/config.js'
import { connectDB } from './data/mongodb.js';
import path from "path";
import { fileURLToPath } from 'url';

// Crear la aplicación de express
const app = express();

// Middlewares
// Conectar a la base de datos
connectDB();

// Configuración para servir archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));  // Para ES6 Modules

// Comunicación entre servidores
// Para que express entienda json
app.use(cors());

app.use(cors({
    origin: 'https://ca-marmota-front.vercel.app', // Asegúrate de usar el dominio correcto del frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
// true para parsear arrays y objetos complejos
app.use(express.urlencoded({ extended: true }));
// Asegúrate de que 'public' esté disponible para los archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
// Si usas Multer para manejar cargas de archivos, asegúrate de que 'uploads' esté accesible también
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Rutas de la API que serán el localhost:3000 + /api/v1 + /ruta
app.use("/api/v1", indexRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    const responseAPI = {
        status: "error",
        msg: "Error en la API",
        error: err.message,
        code: 500
    }
    res.status(500).send(responseAPI)
})

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html")

    const hola = `<h1>Bienvenidos a nuestra REST-API</h1>
    <p> Este proyecto trata de un hotel </p>
    `
    res.status(200).send(hola)
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}${DOMAIN}`);
});
