import {Router} from "express"
// import { getProducts, getProductById, createProductByUser, updateProduct, deleteProduct } from '../controllers/productos.controller.js';
// import { getAdmin, createRegister, getUsers, getUserByUsername, createUser, updateUser, deleteUser } from '../controllers/usuarios.controller.js';

import {authenticateToken} from '../middlewares/auth.js'
import { createRegister, getUsers, authLogin, getAdmin, updateUser, deleteUser } from "../controllers/usuarios.controller.js";
import { getAllRooms, roomsAvailability, getRoomById, updateRoom } from "../controllers/rooms.controller.js";
import { createBooking, getAllBookings, getBookingByUserId, cancelBooking, updateBooking } from "../controllers/bookings.controller.js";
const router = Router();

// Rutas de la API
// Registro de usuarios
router.post('/register', createRegister);
router.post('/login', authLogin);
router.get('/users', authenticateToken, getUsers);
router.get('/admin', authenticateToken, getAdmin);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

// Rutas habitaciones
router.get('/rooms', getAllRooms);
router.post('/rooms/availability', roomsAvailability);
router.get('/rooms/:id', getRoomById);
// falta con multer
router.put('/rooms/:id', authenticateToken, updateRoom);
// router.delete('/rooms/:id', deleteRoom);

// ruta bookings
router.post('/booking', createBooking);
router.get('/bookings', authenticateToken, getAllBookings);
router.get('/bookings/:userId', authenticateToken, getBookingByUserId);
router.put('/bookings/:bookingId', authenticateToken, cancelBooking);
router.put('/bookings/:bookingId', authenticateToken, updateBooking);

export default router;