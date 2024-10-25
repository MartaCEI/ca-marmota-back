import { Booking } from "../data/mongodb.js";
import { Room } from "../data/mongodb.js";

export const createBooking = async (req, res) => {
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

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({ path: 'userId', select: 'name username' })
            .populate({ path: 'roomId', select: 'roomName rentPerDay' });

        res.status(200).json({ data: bookings, message: "He conseguido todos los bookings" });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reservas', error });
    }
};

export const getBookingByUserId = async (req, res) => {
    const userId = req.params.userId; // Asegúrate de usar el nombre correcto aquí

    try {
        const bookings = await Booking.find({ userId }) // O { userId: userId }
            .populate({ path: 'roomId', select: 'roomName rentPerDay' });

        res.status(200).json({ data: bookings, message: "Reservas encontradas" });
    } catch (error) {
        console.error('Error:', error); // Para ver el error en la consola
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
}

export const cancelBooking = async (req, res) => {
    const bookingId = req.params.bookingId;
    console.log('User bookingId:', bookingId);
    try {
        const booking = await Booking.findById(bookingId); // No necesitas un objeto aquí
        if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

        // Cambia el estado de la reserva a 'cancelled'
        booking.status = 'cancelled';
        console.log('User status:', booking.status);
        await booking.save(); // Guarda los cambios en la reserva

        // Eliminar la reserva de la habitación
        console.log('User roomId:', booking.roomId);
        await Room.findByIdAndUpdate(booking.roomId, { $pull: { currentBookings: bookingId } });

        res.json({ message: 'Reserva cancelada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar la reserva', error });
    }
};

export const updateBooking = async (req, res) => {
    const bookingId = req.params.bookingId;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

        const updatedBooking = await Booking.findByIdAndUpdate
            (bookingId, req.body, {
                new: true,
                runValidators: true
            });

        res.json({ message: 'Reserva actualizada exitosamente', booking: updatedBooking });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la reserva', error });
    }
}



// export const deleteProduct= async (req, res, next) => {
//     try {
//         const productId = req.params.id;
//         const deletedproduct= await Product.findByIdAndDelete(productId);
//         if(!deleteProduct) return res.status(404).json({message: "Correo no encontrado"});
//         res.json({message: "Correo eliminado correctamente"}); // Si no tiene status envia el mensaje. si le ponemos status(204) no envia mensaje
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }

// Marcar correo como leido
// export const updateProduct = async (req, res, next) => {
//     try {
//         const productId = req.params.id;

//         // Utilizamos el new: true para que nos devuelva el documento actualizado
//         // Utilizamos {isLeido:true} para marcar el correo como leido
//         const updatedproduct= await Product.findByIdAndUpdate(
//             productId,
//             {isLeido: true},
//             {new: true}    
//         )
//         if(!updateProduct) return es.status(404).json({message: "Correo no encontrado"});
//         res.status(200).json(updateProduct);

//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }