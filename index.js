import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js'
import { PORT, DOMAIN, URL } from './config/config.js'
import { connectDB } from './data/mongodb.js';
import path from "path";
import { upload } from './middlewares/multer.js';
import { __dirname } from './config/config.js';

// Crear la aplicación de express
const app = express();

app.use(cors());
// Middlewares
// Conectar a la base de datos
connectDB();

// Para subir archivos estaticos desde el servidor (vercel)
app.use(express.static(path.join(__dirname, "public"))) 
// Comunicación entre servidores
// Para que express entienda json
app.use(express.json());
// true para parsear arrays y objetos complejos
app.use(express.urlencoded({extended: true}));
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

// Esto va en rutas.. y no tinen por que llamarse uploads.. 
// Upload de archivos con multer
app.post('/api/v1/upload', upload.single('profile'), (req, res, next) => {
    debug.blue("Subiendo Archivo con name 'profile'");
    try {

        console.log("file es ", req.file); // req.file info del archivo
        console.log("body es:", req.body); // otros campos si existieran
        debug.magenta("Titulo del form es ", req.body.titulo);

        res.status(200).json({
            msg: "Archivo subido correctamente",
            file: req.file,
            body: req.body,
            peso: `${Math.round(req.file.size / 1024)} Kbytes`,
            url: `${FULL_DOMAIN}/uploads/${req.file.filename}`
        });

    } catch (e) {
        debug.red(e);
        next(e);
    }
});


app.get("/", (req, res)=> {
    res.setHeader("Content-Type", "text/html")

    const hola = `<h1>Bienvenidos a nuestra REST-API</h1>
    <p> Este proyecto trata de un hotel </p>
    `
    res.status(200).send(hola)
});


app.listen(PORT, () => {
    console.log(`Server running on ${URL}`);
});
