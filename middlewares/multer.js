import multer from "multer";
import path from 'path';

// Subida de archivos con multer ej: "avatar-unixTimeStamp-655466764.png"
export const storage = multer.diskStorage({
    destination: function (req, fille, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname)
        const uniqueSuffix = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
        // ej: "avatar-unixTimeStamp-655466764.png"
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
    }
});

export const upload = multer({storage:storage});  