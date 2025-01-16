import { User } from '../data/mongodb.js';
// Hash y JWT
import bcrypt from 'bcrypt' // Hacer hash a nuestros pass
import jwt from 'jsonwebtoken' // Crear y leer token
import { JWT_SECRET, __dirname } from '../config/config.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isDeleted: false }); // Solo usuarios activos
        res.status(200).json({data: users, message: "Correcto users"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const authLogin = async (req, res, next) => {
try {
    const {username, password} = req.body;
    const userCreated = await User.findOne({ username: username });

    if (!userCreated) {
        return res.status(400).json({message: "Usuario no encontrado"})
    }

    const isMatch = await bcrypt.compare(password, userCreated.password)

    if (!isMatch) {
        return res.status(400).json({message: "Clave incorrecta"})
    }

    // Crear jwt y devuelvo el usuario
    // create and sign a new token(contenido purpura, llave privada, opciones(cuado expira))
    const token = jwt.sign({username:username}, JWT_SECRET, {expiresIn: '5h'});

    res.status(200).json({data: userCreated, message: "Correcto login", token})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const createRegister =  async (req, res, next) => {
    try {
        const {name, username, password, image='https://picsum.photos/200'} = req.body;
        // Hash de contraseña con bcrypt(importante el orden)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, username, password:hashedPassword, image:"https://picsum.photos/200"});
        await newUser.save();

        // Obtener el usuario recien creado
        const userCreated = await User.findOne({username : username});
        res.status(200).json({data: userCreated, message: "Registro exitoso"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}

export const getAdmin =  async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({data: users, message: "Correcto users"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // Marcar el usuario como eliminado (soft delete)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario marcado como eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const {username, email} = req.body;

        // Utilizamos el new: true para que nos devuelva el documento actualizado
        const updatedUser = await User.findByIdAndUpdate(userId, {username, email}, {new: true});
        if(!updatedUser) return res.status(404).json({message: "Usuario no encontrado"});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}