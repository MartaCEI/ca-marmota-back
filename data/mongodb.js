import mongoose from 'mongoose';
import { DB } from '../config/config.js';

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log("Conectado correctamente")
    } catch (error) {
        console.log("Error conectando a MongooDB", error.message);
        process.exit(1);
    }
}

// Esquema para las secciones
const articleSchema = new mongoose.Schema({
    articleImage: {
        type: String,
    },
    articleTitle: {
        type: String,
    },
    articleSubtitle: {
        type: String,
    },
});

// Esquema para la página de inicio
const pageSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true
    },
    image: { 
        type: String, 
        required: true 
    },
    logo: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    subtitle: { 
        type: String, 
        required: true 
    },
    articles: [articleSchema] 
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        strict: false,
        versionKey: false
    })

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maxCount: {
        type: Number,
        required: true
    },
    rentPerDay: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    bathRoom: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    imagesUrls: [],
    currentBookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
},
    {
        timestamps: true,
        strict: false,
        versionKey: false
    })

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    checkIn: {
        type: String,
        required: true
    },
    checkOut: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalNights: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'booked'
    }
},
    {
        timestamps: true,
        strict: false,
        versionKey: false
    })

const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Page = mongoose.model('Page', pageSchema);

export { connectDB, User, Room, Booking, Page };