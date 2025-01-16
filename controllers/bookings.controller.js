import { Booking } from "../data/mongodb.js";
import { Room } from "../data/mongodb.js";

export const createBooking = async (req, res, next) => {
    const { userId, roomId, checkIn, checkOut, totalAmount, totalNights} = req.body;
    const transactionId = Math.floor(Math.random() * 1000) + 1;
    try {
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
        // Actualizar la habitación con la nueva reserva
        await Room.findByIdAndUpdate(roomId, { $push: { currentBookings: newBooking._id } });

        res.json({ message: 'Reserva creada exitosamente', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reserva', error });
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: 'userId',
                match: { isDeleted: false }, // Filtra solo usuarios activos
                select: 'name username' // Selecciona los campos que quieres retornar
            })
            .populate({
                path: 'roomId',
                select: 'roomName rentPerDay' // Selecciona los campos de las habitaciones
            });
        // Filtrar reservas que no tengan un usuario válido (por ejemplo, usuario eliminado)
        const filteredBookings = bookings.filter(booking => booking.userId !== null);

        res.status(200).json({ data: filteredBookings, message: "He conseguido todos los bookings" });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reservas', error });
    }
};

export const getBookingByUserId = async (req, res, next) => {
    const userId = req.params.userId; // Obtener el userId de los parámetros de la URL
    try {
        const bookings = await Booking.find({ userId })
            .populate({ path: 'roomId', select: 'roomName rentPerDay' });

        res.status(200).json({ data: bookings, message: "Reservas encontradas" });
    } catch (error) {
        console.error('Error:', error); // Para ver el error en la consola
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
}

export const cancelBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    console.log('User bookingId:', bookingId);

    try {
        const booking = await Booking.findOne({ _id: bookingId });
        console.log('Booking:', booking);
        if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

        // Cambiar el estado de la reserva a 'cancelled'
        booking.status = 'cancelled';
        await booking.save();

        // Obtener el roomId asociado a la reserva
        const roomId = booking.roomId.toString(); // Convertir roomId a string
        console.log('Formatted roomId:', roomId);
        // Actualizar la habitación usando el bookingId en el $pull
        const roomUpdate = await Room.findOneAndUpdate(
            { _id: roomId },
            { $pull: { currentBookings: bookingId } }, // Usar bookingId aquí
            { new: true } // Devolver el documento actualizado
        );
        res.status(200).json({ message: 'Reserva cancelada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar la reserva', error });
    }
};


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