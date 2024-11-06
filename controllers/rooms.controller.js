import { Room } from '../data/mongodb.js';

export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las habitaciones', error });
    }
};

export const roomsAvailability = async (req, res, next) => {
    const { checkIn, checkOut } = req.body;

    try {
        // Obtener habitaciones y popular las reservas actuales
        const rooms = await Room.find({}).populate('currentBookings'); // Asegúrate de que el campo de referencia esté bien definido

        // Convertir las fechas a objetos Date para comparación
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const availableRooms = rooms.filter(room => {
            return room.currentBookings.every(booking => {
                // Aquí asumimos que `booking` ahora tiene los campos `checkIn` y `checkOut`
                const bookingCheckIn = new Date(booking.checkIn);
                const bookingCheckOut = new Date(booking.checkOut);

                // Verificar si hay una superposición
                return (
                    checkOutDate <= bookingCheckIn || // La nueva reserva termina antes del check-in existente
                    checkInDate >= bookingCheckOut      // La nueva reserva comienza después del check-out existente
                );
            });
        });

        res.json(availableRooms);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las habitaciones', error });
    }
};

export const getRoomById = async (req, res, next) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
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

        if (!room) {
            return res.status(404).json({ message: "Habitación no encontrada" });
        }

        // Actualizar solo los campos que se envían en el cuerpo de la solicitud
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            req.body, // Aquí usamos req.body para actualizar los campos modificados
            { new: true } // Esto asegura que la respuesta sea la habitación actualizada
        );

        // Responder con la habitación actualizada
        res.status(200).json(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la habitación", error: error.message });
    }
};