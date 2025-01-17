import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js'
import { PORT, DOMAIN, URL } from './config/config.js'
import { connectDB } from './data/mongodb.js';
import path from "path";
import { __dirname } from './config/config.js';


// Crear la aplicación de express
const app = express();

// Middlewares
// Conectar a la base de datos
connectDB();

app.use(express.static(path.join(__dirname, "public"))) 

// Comunicación entre servidores
// Para que express entienda json
app.use(cors());

app.use(express.json());
// true para parsear arrays y objetos complejos
app.use(express.urlencoded({ extended: true }));
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
    console.log(`Server running on ${DOMAIN}${PORT}`);
});
