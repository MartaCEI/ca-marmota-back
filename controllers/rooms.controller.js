import { Room } from '../data/mongodb.js';

// Obtener todas las habitaciones disponibles
export const getAllRooms = async (req, res, next) => {
    try {
        // Buscar todas las habitaciones en la base de datos
        const rooms = await Room.find({});
        // Enviar respuesta con las habitaciones encontradas
        res.status(200).json(rooms);
    } catch (error) {
        // Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al obtener las habitaciones', error });
    }
};

// Verificar la disponibilidad de las habitaciones en función de las fechas de check-in y check-out
export const roomsAvailability = async (req, res, next) => {
    const { checkIn, checkOut } = req.body; // Obtener fechas de entrada y salida del cuerpo de la solicitud
    try {
        // Obtener todas las habitaciones y sus reservas actuales
        const rooms = await Room.find({}).populate('currentBookings');
        
        // Convertir las fechas de check-in y check-out a objetos Date para poder compararlas
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Filtrar las habitaciones para encontrar las disponibles
        const availableRooms = rooms.filter(room => {
            return room.currentBookings.every(booking => {
                // Convertir las fechas de cada reserva a objetos Date
                const bookingCheckIn = new Date(booking.checkIn);
                const bookingCheckOut = new Date(booking.checkOut);
                
                // Verificar si la nueva reserva no se solapa con las reservas existentes
                return (
                    checkOutDate <= bookingCheckIn || // La nueva reserva termina antes del check-in existente
                    checkInDate >= bookingCheckOut    // La nueva reserva comienza después del check-out existente
                );
            });
        });
        res.status(200).json(availableRooms);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las habitaciones', error });
    }
};

// Obtener una habitación específica por su ID
export const getRoomById = async (req, res, next) => {
    try {
        // Obtener roomId desde los parámetros de la URL
        const roomId = req.params.id;
        // Buscar la habitación por su ID
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la habitación', error });
    }
};



export const updateRoom = async (req, res, next) => {
    try {
        // Obtener roomId desde los parámetros de la URL
        const roomId = req.params.id;
        // Verificar si la habitación existe
        const room = await Room.findById(roomId);
        // Si la habitación no existe, responder con un error
        if (!room) {
            return res.status(404).json({ message: "Habitación no encontrada" });
        }
        // Actualizar solo los campos que se envían en el cuerpo de la solicitud
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            req.body, // Aquí usamos req.body para actualizar los campos modificados
            { new: true } // Devuelve el documento actualizado
        );
        // Responder con la habitación actualizada
        res.status(200).json(updatedRoom);
    } catch (error) {
        // Si hay un error, responder con un mensaje de error
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la habitación", error: error.message });
    }
};


