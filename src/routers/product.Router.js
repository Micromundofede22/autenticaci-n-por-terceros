import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const productRouter = Router()


productRouter.get("/", async (req, res) => {
    try{
        let limite = req.query.limite || 0
        const result= await productModel.find().limit(limite).lean().exec()
        res.status(200).json({status: "success", payload:result})
        req.app.get('socketio').emit('updateProducts', await productModel.find().limit(limite))
    }catch(err){
        res.status(500).json({status: "error", error: err.message})
    }
})

productRouter.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findById(id).lean().exec()

        if (id === null || id < 0) {
            res.status(406).json({ status: "error", error: "Not found" })
        } else {
            res.status(200).json({ status: "success", payload: result })
            req.app.get("socketio").emit("updateProducts", await productModel.find())
        }
    } catch (err) {
            res.status(500).json({status: "error", error: err.message})
    }
})

productRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const newProduct = await productModel.create(product)
            res.status(201).json({ status: "success", payload: newProduct })
            req.app.get("socketio").emit("updateProducts", await productModel.find())
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

productRouter.put("/:pid", async (req, res) => {
try{
    const id= req.params.pid
    const newData= req.body
    const result= await productModel.findByIdAndUpdate(id, newData, {returnDocument: "after"})

    if (result === null) {
        res.status(404).json({status: "error", error: "Not found"})
    } else {
        res.status(200).json({status: "success", payload: result})
        req.app.get("socketio").emit("updateProducts", await productModel.find())
    }
}catch(err){
    res.status(500).json({status: "error", error: err.message})
}
})

productRouter.delete("/:pid", async (req, res) => {
    try{
        const id= req.params.pid
        const result= await productModel.findByIdAndDelete(id)
        if (result == null) {
            res.status(404).json({status: "error", error: "Not found"})
        } else {
            res.status(200).json({status: "success", payload: result})
            req.app.get("socketio").emit("updateProducts", await productModel.find())
        }
    }catch(err){
        res.status(500).json({status:"error", error: err.message})
    }
})

export default productRouter