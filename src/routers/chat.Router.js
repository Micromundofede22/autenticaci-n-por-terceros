import { Router } from "express";
import { messagesModel } from "../dao/models/message.model.js";

const router= Router()


router.get("/", async(req, res)=>{
    try {
        const messages= await messagesModel.find()
        res.render("chat", {messages})

    } catch (err) {
        res.status(500).json({status: "error", error: err.message})
    }

})

export default router