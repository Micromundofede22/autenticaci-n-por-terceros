import { Router } from "express";
import { uploader } from "../middleware/multer.js";

const router= Router()

router.post("/", uploader.single("file"), (req,res)=>{ //uploader.single es para q se suba un archivo simple llamado file. (uploader.array me permite subir varios archivos)
    if (!req.file) {
        res.status(400).json({status: "error", error: "archivo no se ha enviado"})
    } else {
        res.status(200).json({status: "success", message: "Archivo subido con éxito" })
    }
})

export default router