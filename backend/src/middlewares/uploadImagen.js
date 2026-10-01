import multer from "multer";

const almacenamiento = multer.memoryStorage();

const uploadImagen = multer({
    storage: almacenamiento,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Solo se permiten imágenes JPG, PNG o WEBP"
                )
            );
        }

        cb(null, true);
    },
});

export default uploadImagen;