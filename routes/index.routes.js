import {Router} from "express"
// import { getProducts, getProductById, createProductByUser, updateProduct, deleteProduct } from '../controllers/productos.controller.js';
// import { getAdmin, createRegister, getUsers, getUserByUsername, createUser, updateUser, deleteUser } from '../controllers/usuarios.controller.js';

import {authenticateToken} from '../middlewares/auth.js'
import { getLandings } from "../controllers/landings.controller.js";
import { createRegister, getUsers, authLogin, getAdmin, updateUser, deleteUser } from "../controllers/usuarios.controller.js";
import { getAllRooms, roomsAvailability, getRoomById } from "../controllers/rooms.controller.js";
import { createBooking, getAllBookings, getBookingByUserId, cancelBooking, updateBooking } from "../controllers/bookings.controller.js";
const router = Router();

// Rutas
// Rutas de inicio
router.get('/home', getLandings);

// Registro de usuarios
router.post('/register', createRegister);
router.post('/login', authLogin);
router.get('/users', getUsers);
router.get('/admin', authenticateToken, getAdmin);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);


// Rutas habitaciones
router.get('/rooms', getAllRooms);
router.post('/rooms/availability', roomsAvailability);
router.get('/rooms/:id', getRoomById);
// falta con multer y authenticateToken
// router.post('/rooms', createRoom);
// router.put('/rooms/:id', updateRoom);
// router.delete('/rooms/:id', deleteRoom);

// ruta bookings con authenticateToken
router.post('/booking', createBooking);
router.get('/bookings', getAllBookings);
// falta authenticateToken
router.get('/bookings/:userId', authenticateToken, getBookingByUserId);
router.put('/bookings/:bookingId', cancelBooking);
router.put('/bookings/:bookingId', updateBooking);


export default router;