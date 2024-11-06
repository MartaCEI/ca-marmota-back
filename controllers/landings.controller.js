import { Landing } from '../data/mongodb.js';
import { Home } from '../data/mongodb.js';

export const getLandings = async (req, res, next) => {
    try {
        const landings = await Landing.find();
        res.status(200).json({data: landings, message: "Correcto landings"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const getHome = async (req, res, next) => {
    try {
        const home = await Home.find();
        res.status(200).json({data: home, message: "Correcto home"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

