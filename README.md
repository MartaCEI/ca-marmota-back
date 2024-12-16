# Back

Nuestro Back tendrá una API Rest con rutas para Auth y Usuarios. También poseerá un middleware para proteger rutas privadas.

- [x] Crear Back con Express y dependencias (cors, nodemon, dotenv, mongoose)
- [x] Instalar dependencias de Auth (bcrypt, jsonwebtoken)
- [x] Crear variables de entorno
- [x] Archivo de config.js
- [x] Crear el archivo index.js
- [x] Página de inicio del backend
- [x] Crear archivo de rutas index.routes.js (rutas más ordenadas)
- [x] Crear controladores para las rutas (usuarios.controller.js)
- [x] Hash con Bcrypt
- [] Crear una ruta protegida (/admin)
- [] JWT con JsonWebToken para protección de rutas privadas
- [] Crear middleware auth.js que devuelve true siempre
- [] Esquemas de Mongoose para usuarios (nombre, email, contraseña)
- [] Conexión a MongoDB Atlas
- [] Testing
- [] Upload de Archivos (Multer)

1. Crear Back con Express y dependencias.
```bash
npm init -y
npm i express mongoose dotenv cors
npm i nodemon -D
npm i bcrypt jsonwebtoken
npm i multer
```
y cambiar el package.json
```json
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    },
```

2. Crear variables de entorno
```bash
PORT = "3000"
DOMAIN = "http://localhost"
MONGO_URI = "mongodb+srv://guecolmar:iOmPwThYD9p3FQPn@cluster0.tzkzh.mongodb.net/ca_marmota?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET = "3804654c6e96ba5f96128f098877179c"
```

3. Archivo de config.js
```js
import dotenv from 'dotenv';
dotenv.config();

// Para saber cual es la carpeta en la que se está ejecutando el servidor. 
//Dice exactamente en que carpeta se encuentra el archivo en el index.js middlewares
// Para que vercel acceda a nuestra carpeta public
import path from 'path';
export const __dirname = path.resolve();

export const PORT = process.env.PORT || 5000;
export const DOMAIN = process.env.DOMAIN || 'http://localhost';

export const URL = `${DOMAIN}:${PORT}`;

export const DB = process.env.MONGO_URI;

export const JWT_SECRET = process.env.JWT_SECRET || "utiliza_otra_clave_segura_no_esta"
```

4. Creamos el archivo index.js
```js
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

// Middlewares
// Conectar a la base de datos
connectDB();

// Para subir archivos estaticos desde el servidor (vercel)
app.use(express.static(path.join(__dirname, "public"))) 
// Comunicación entre servidores
app.use(cors());
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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${URL}`);
})
```

5. Página de inicio del backend
Nota: Para la página inicial del backend, Podemos crear dentro del archivo index.js una ruta que devuelva un mensaje de bienvenida.
```js
app.get("/", (req, res)=> {
    res.setHeader("Content-Type", "text/html")
    const hola = `<h1>Bienvenidos a nuestra REST-API</h1>
    <p> Este proyecto trata de un hotel </p>`
    res.status(200).send(hola)
});
```
o en public un archivo index.html normal
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ca marmota</title>
</head>
<body>
    <h1>Bienvenido a la API de la Marmota</h1>
    <p>Esta es mi pagina home de back-end de Express del proyecto hotel</p>
</body>
</html>
```

6. Crear archivo de rutas index.routes.js
```js
import {Router} from "express"
import { createRegister, authLogin } from "../controllers/usuarios.controller.js";
const router = Router();

// Rutas
// Registro de usuarios
router.get('/users', getUsers);
router.post('/register', createRegister);
router.post('/login', authLogin);
router.get('/admin', getAdmin);

export default router;
```

7. Crear controladores para las rutas (usuarios.controller.js)
IMPORTANTISIMO!!! Estamos probando si funciona el frente con el back, por lo que no vamos a hacer la conexión a la base de datos. Vamos a hacer un `mock` de la base de datos.
Pruebas del backend (rutas iniciales). 
- Usuario vacio de prueba
- Usuarios de prueba con contenido
- Rutas de prueba
```js
// Bases de datos ficticias:
const user = []

export const MockUser = {
    name:"Marta",
    username:"marta@gmail.com",
    password:"1234",
    image: 'https://picsum.photos/200',
    isAdmin: false,
}

export const Users = async (req, res, next) => {
    try {
        res.status(200).json({data: user, message: "Estos son los usuarios"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const Login = async (req, res, next) => {
    console.log("Haciendo login")
    try {
        res.status(200).json({data: user, message: "Has hecho login"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const Register = async (req, res, next) => {
    console.log("Haciendo register")
    try {
        res.status(200).json({data: user, message: "Registrado con exito"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const Admin = async (req, res, next) => {
    console.log("Contenido privado de admin")
    try {
        res.status(200).json({data: user, message: "Estos son los usuarios"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}
```
Comprobamos si funciona el servidor con un `console.log("Haciendo login")` en la función `Login` y lo probamos en el navegador. Y añadimos el MockUser a la función `Login` para que devuelva un usuario. res.status(200).json({data: `MockUser`, message: "Has hecho login"})
```js
npm run dev
```
y en el navegador
```bash
http://localhost:3000/api/v1/login
```
o con Thunder Client
POST  http://localhost:3000/api/v1/login
POST  http://localhost:3000/api/v1/register
GET  http://localhost:3000/api/v1/users
GET  http://localhost:3000/api/v1/admin

8. Hash con Bcrypt en usuarios.controller.js
```js 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

// Cambiamos el registro para HASEAR la contraseña
export const register = async (req, res, next) => {
    
    try {
        // Deconstruimos los datos del req.body. Si no hay imagen, ponemos una por defecto
        const { name, username, password, image:'https://picsum.photos/200', isAdmin } = req.body;
        console.log("Haciendo register")
    
        // 1. Mandamos información donde creamos un usuario nurvo con la contraseña hasheada. 
        const newUser = {
            name,
            username,
            password: await bcrypt.hash(password, 10),
            image,
            isAdmin
        }
        // 2. Añadimos el nuevo usuario en el array de prueba llamado user
        user.push(newUser);

        // 3. Devolvemos el usuario creado
        // Para esto, tengo que devolver el usuario recién creado buscando dentro del array de usuarios. 
        const userCreated = user.find((u) => u.username === username)
        res.status(200).json({data: userCreated, message: "Registrado con exito"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}
```
PARA PROBARLO EN THUNDER CLIENT:
HABRIMOS DOS VENTANAS AL MISMO TIEMPO:
POST  http://localhost:3000/api/v1/register  en la parte del body/json escribimos
```json
{
    "name": "Marta",
    "username": "marta@gmail.com",
    "password": "1234",
    "isAdmin": true
}
```
nos devuelve lo mismo:
```json
{
    "name": "Marta",
    "username": "marta@gmail.com",
    "password": "1234",
    "image": "https://picsum.photos/200",
    "isAdmin": true
}
```
y miramos si se ha mandado correctamente:
GET http://localhost:3000/api/v1/users
esta ruta nos devolveá todos los usuarios que hemos creado.

para HASHEAR la contraseña, utilizamos la función `bcrypt.hash(password, 10)` que nos devolverá la contraseña hasheada.
```js
password: await bcrypt.hash(password, 10),
```

Lo mismo para la función `Login`:
```js
export const login = async (req, res, next) => {
    try {
        console.log("Haciendo login")
        // RECIBIMOS LOS DATOS DEL FRONT
        // 1. Deconstruimos los datos del req.body 
        const { username, password } = req.body;

        // OPERAMOS CON LOS DATOS RECIBIDOS DEL FRON Y LOS DE LA BASE DE DATOS
        2. // 2. Buscamos el usuario en el array de usuarios
        const userFound = user.find((u) => u.username === username)
        // 3. Si no existe el usuario, devolvemos un error
        if (!userFound) {
            return res.status(404).json({error: "Usuario no encontrado"})
        }
        // 4. Comparamos la contraseña hasheada con la contraseña que nos mandan
        const isMatch = await bcrypt.compare(password, userFound.password)
        // 5. Si no coincide, devolvemos un error
        if (!isMatch) {
            return res.status(401).json({error: "Contraseña incorrecta"})
        }
        // MANDAMOS LOS DATOS AL FRONT
        // 6. Si coincide, devolvemos el usuario
        res.status(200).json({data: userFound, message: "Has hecho login"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}
```

9. Tokens: Crea una llave llamada token. Cada vez que se logea un usuario se crea una llave nueva. Con esa llave se puede acceder a las rutas protegidas. Tanto en el back como en el front. 
Cada vez que se hace un fetch se fija en la llave. Si es correcta, se accede, sino, no. 
1. Creamos un token con JWT en la función `login`. Justo antes de enviar la informacion otra vez al front: 
```js
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userFound = user.find((u) => u.username === username)

        if (!userFound) {
            return res.status(404).json({error: "Usuario no encontrado"})
        }

        const isMatch = await bcrypt.compare(password, userFound.password)

        if (!isMatch) {
            return res.status(401).json({error: "Contraseña incorrecta"})
        }

        // Creamos un token con JWT
        const token = jwt.sign({username: userFound.username}, JWT_SECRET, {expiresIn: '24h'});
        // Mandamos el token al front
        res.status(200).json({data: userFound, token, message: "Has hecho login"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}
```
// Creamos un token con JWT para el ADMIN. 
        const token = jwt.sign({username: userFound.username, isAdmin: userFound.isAdmin}, JWT_SECRET)


```js
import { JWT_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    // 1. Recibimos el token del front
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no hay token, devolvemos un error 401
    if(!token) return res.sendStatus(401); //unauthorized
    // 3. Verificamos el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403); //forbidden
        req.user = user;
        // Si la llave es correcta, hacemos un next()
        next()
    })
}
```
y lo añadimos a la ruta de admin
```js
router.get('/admin', authenticateToken, getAdmin);
```

Para probarlo con Thunder Client.
POST  http://localhost:3000/api/v1/login
```json
{
    "username": "marta@gmail.com",
    "password": "1234"
}
y nos devuelve el usuario y el token
```json
{
    "data": {
        .....
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhY2FAZ21haWwuY29tIiwiaWF0IjoxNzI5NjIxNTY5LCJleHAiOjE3Mjk2Mzk1Njl9.nxt5IA80om8jIcYnps-vAm3_rv4lEGuvTatn50SSYaQ"
    },
    "message": "Has hecho login"
}
```	
GET  http://localhost:3000/api/v1/admin
en la parte de Auth ponemos el token que nos ha devuelto el login
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhY2FAZ21haWwuY29tIiwiaWF0IjoxNzI5NjIxNTY5LCJleHAiOjE3Mjk2Mzk1Njl9.nxt5IA80om8jIcYnps-vAm3_rv4lEGuvTatn50SSYaQ
```
y nos devolverá el contenido privado de admin
```json
{
    "message": "Estos son los usuarios"
}
```

