import { User } from '../data/mongodb.js';
// Hash y JWT
import bcrypt from 'bcrypt' // Hacer hash a nuestros pass
import jwt from 'jsonwebtoken' // Crear y leer token
import { JWT_SECRET, __dirname } from '../config/config.js';

export const getUsers = async (req, res, next) => {
    try {
        // Buscar si el usuario existe en la base de datos
        const users = await User.find({ isDeleted: false }); // Solo usuarios activos
        // Si existe, responder con un mensaje de éxito y el usuario (data)
        res.status(200).json({data: users, message: "Correcto users"})
    } catch (error) {
        // Si no existe, responder con un error
        res.status(500).json({ message: error.message });
    }
};

export const authLogin = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        // Buscar si el usuario existe en la base de datos por username
        const userCreated = await User.findOne({ username: username });
        // Si no existe, responder con un error
        if (!userCreated) {
            return res.status(400).json({message: "Usuario no encontrado"});
        }
        // Comparar la contraseña enviada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, userCreated.password);
        // Si las contraseñas no coinciden, responder con un error
        if (!isMatch) {
            return res.status(400).json({message: "Clave incorrecta"});
        }
    // Crear jwt y devuelvo el usuario
    // create and sign a new token(contenido purpura, llave privada, opciones(cuado expira))
    const token = jwt.sign({username:username}, JWT_SECRET, {expiresIn: '5h'});
    // Si el usuario existe y la contraseña es correcta, responder con el usuario y el token
    res.status(200).json({data: userCreated, message: "Correcto login", token})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const createRegister =  async (req, res, next) => {
    try {
        const {name, username, password} = req.body;
        // // Generar hash de la contraseña con bcrypt (importante el orden)
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear un nuevo usuario con la contraseña encriptada y lo guarda.
        const newUser = new User({name, username, password:hashedPassword});
        await newUser.save();

        // Obtener el usuario recien creado para verificar que se guardo correctamente
        const userCreated = await User.findOne({username : username});
        // Responder con el usuario creado
        res.status(200).json({data: userCreated, message: "Registro exitoso"})
    } catch (error) {
        // debug
        console.log(error)
        // Si hay un error, responder con un mensaje de error
        res.status(500).json({error: error.message})
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Obtener el ID del usuario desde los parámetros de la ruta
        const userId = req.params.id;
        // Marcar el usuario como eliminado (soft delete)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true }, // Marcar como eliminado (true)
            { new: true } // Devuelve el documento actualizado
        );
        // Si el usuario no existe, responder con un error
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Responde con un mensaje de éxito
        res.json({ message: "Usuario marcado como eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Esta función no se usa en el proyecto, pero se deja como ejemplo
// de cómo se puede actualizar un usuario.
export const updateUser = async (req, res, next) => {
    try {
        // Obtener el ID del usuario desde los parámetros de la ruta
        const userId = req.params.id;
        // Obtener los datos del usuario desde el cuerpo de la petición
        const {username, email} = req.body;

        // Utilizamos el new: true para que nos devuelva el documento actualizado
        const updatedUser = await User.findByIdAndUpdate(userId, {username, email}, {new: true});
        // Si el usuario no existe, responder con un error
        if(!updatedUser) return res.status(404).json({message: "Usuario no encontrado"});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}