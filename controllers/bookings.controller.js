import { Booking } from "../data/mongodb.js";
import { Room } from "../data/mongodb.js";

export const createBooking = async (req, res, next) => {
    // Obtener los datos de la reserva desde el cuerpo de la solicitud
    const { userId, roomId, checkIn, checkOut, totalAmount, totalNights} = req.body;
    // Generar un ID de transacción aleatorio
    const transactionId = Math.floor(Math.random() * 1000) + 1;
    try {
        // Crear y guarda una nueva reserva con los datos proporcionados
        const newBooking = new Booking({
            userId,
            roomId,
            checkIn,
            checkOut,
            totalAmount,
            totalNights,
            transactionId,
            status: 'booked'
        });
        await newBooking.save();
        // Actualizar la habitación con la nueva reserva dentro de el campo de currentBookings
        await Room.findByIdAndUpdate(roomId, { $push: { currentBookings: newBooking._id } });
        // Responder con un mensaje de éxito y la reserva creada
        res.status(200).json({ message: 'Reserva creada exitosamente', booking: newBooking });
    } catch (error) {
        // Si hay un error, responder con un mensaje de error
        res.status(500).json({ message: 'Error al crear la reserva', error });
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        // Obtener todas las reservas y añadir los campos de userId y roomId
        const bookings = await Booking.find()
            .populate({
                // Añade los campos de name y username de los usuarios activos
                path: 'userId',
                match: { isDeleted: false }, // Filtra solo usuarios activos
                select: 'name username' // Selecciona los campos que quieres retornar
            })
            // Añade los campos de roomName rentPerDay
            .populate({
                path: 'roomId',
                select: 'roomName rentPerDay' // Selecciona los campos que quieres retornar
            });
        // Filtrar reservas que no tengan un usuario válido (por ejemplo, usuario eliminado)
        const filteredBookings = bookings.filter(booking => booking.userId !== null);
        // Responder con las reservas filtradas
        res.status(200).json({ data: filteredBookings, message: "He conseguido todos los bookings" });
    } catch (error) {
        // Si hay un error, responder con un mensaje de error
        res.status(500).json({ message: 'Error al obtener las reservas', error });
    }
};

export const getBookingByUserId = async (req, res, next) => {
    const userId = req.params.userId; // Obtener el userId de los parámetros de la URL
    try {
        // Buscar todas las reservas que coincidan con el userId
        const bookings = await Booking.find({ userId })
            // Añade los campos de roomName y rentPerDay
            .populate({ path: 'roomId', select: 'roomName rentPerDay' });
        // Responder con las reservas encontradas
        res.status(200).json({ data: bookings, message: "Reservas encontradas" });
    } catch (error) {
        // Si hay un error, responder con un mensaje de error
        console.error('Error:', error); // Para ver el error en la consola
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
}

// Soft delete de una reserva
export const cancelBooking = async (req, res, next) => {
    // Obtener el ID de la reserva desde los parámetros de la URL
    const bookingId = req.params.bookingId;
    try {
        // Buscar la reserva por su ID
        const booking = await Booking.findOne({ _id: bookingId });
        // Si la reserva no existe, responder con un error
        if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
        // Cambiar el estado de la reserva a 'cancelled'
        booking.status = 'cancelled';
        await booking.save();
        // Obtener el roomId asociado a la reserva
        const roomId = booking.roomId.toString(); // Convertir roomId a string
        console.log('Formatted roomId:', roomId);
        // Actualizar la habitación usando el bookingId en el $pull
        const roomUpdate = await Room.findOneAndUpdate(
            { _id: roomId }, // Buscar la habitación por su ID
            { $pull: { currentBookings: bookingId } }, // Eliminar el bookingId de currentBookings
            { new: true } // Devolver el documento actualizado
        );
        // Responder con un mensaje de éxito y la reserva cancelada
        res.status(200).json({ data: roomUpdate, message: 'Reserva cancelada exitosamente' });
    } catch (error) {
        // Si hay un error, responder con un mensaje de error
        res.status(500).json({ message: 'Error al cancelar la reserva', error });
    }
};

// Esta función no se usa en el proyecto, pero se deja como ejemplo
// de cómo se puede actualizar un usuario.
export const updateBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

        const updatedBooking = await Booking.findByIdAndUpdate
            (bookingId, req.body, {
                new: true,
                runValidators: true
            });
        res.status(200).json({ message: 'Reserva actualizada exitosamente', booking: updatedBooking });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la reserva', error });
    }
}