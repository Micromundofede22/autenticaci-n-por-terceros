import multer from "multer";

// CONFIGURACIÓN MULTER
const storage= multer.diskStorage({ // acá le digo que se grabe en disco de almacenamiento
    destination: function(req, file, cb){
        cb(null, "public/")         //acá le digo que se guarde en carpeta public
    },
    filename: function(req, file,cb){
        cb(null, file.originalname) //y acá que se guarde con el nombre original con el que viene
    }
})
export const uploader= multer({storage})

