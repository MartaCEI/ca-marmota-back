import {Router} from "express"
import { upload } from '../middlewares/multer.js';
import {authenticateToken} from '../middlewares/auth.js'
import { createRegister, getUsers, authLogin, updateUser, deleteUser } from "../controllers/usuarios.controller.js";
import { getAllRooms, roomsAvailability, getRoomById, updateRoom } from "../controllers/rooms.controller.js";
import { createBooking, getAllBookings, getBookingByUserId, cancelBooking, updateBooking } from "../controllers/bookings.controller.js";
import { PORT, DOMAIN } from '../config/config.js'

const router = Router();

// Rutas de la API
// Rutas de usuarios
router.post('/register', createRegister);
router.post('/login', authLogin);
router.get('/users', authenticateToken, getUsers);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

// Rutas habitaciones
router.get('/rooms', getAllRooms);
router.post('/rooms/availability', roomsAvailability);
router.get('/rooms/:id', getRoomById);
router.put('/rooms/:id', authenticateToken, updateRoom);

// Rutas bookings
router.post('/booking', createBooking);
router.get('/bookings', authenticateToken, getAllBookings);
router.get('/bookings/:userId', authenticateToken, getBookingByUserId);
router.put('/bookings/:bookingId', authenticateToken, cancelBooking);
router.put('/bookings/:bookingId', authenticateToken, updateBooking);

// Upload de archivos con multer
router.post('/upload', upload.single('image'), (req, res, next) => {
    try {
        res.status(200).json({
            msg: "Archivo subido correctamente",
            file: req.file,
            body: req.body,
            peso: `${Math.round(req.file.size / 1024)} Kbytes`,
            url: `${DOMAIN}${PORT}/uploads/${req.file.filename}`
        });
    } catch (e) {
        res.status(500).json({error: "Error en el servidor"})
    }
});

export default router;