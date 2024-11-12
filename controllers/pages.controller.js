import { Page } from '../data/mongodb.js';

export const getPageInfo = async (req, res, next) => {
    try {
        const page = await Page.find();
        res.status(200).json({data: page, message: "Informacion de las páginas obtenida con éxito"})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor"})
    }
}

