import { Router } from "express";
// import { ProductManager } from "../dao/fsManager/ProductManager.js"
import { productModel } from "../dao/models/product.model.js";

const productRouter = Router()
// const manager = new ProductManager("./Productos.json")


productRouter.get("/", async (req, res) => {
    try{
        let limite = req.query.limite || 0
        const result= await productModel.find().limit(limite).lean().exec()
        res.status(200).json({status: "success", payload:result})
    }catch(err){
        res.status(500).json({status: "error", error: err.message})
    }

    // let limite = req.query.limite
    // const arrayProducts = await manager.getProduct()
    // const productLimitados = arrayProducts.slice(0, Number(limite))
    // if (!limite) {
    //     req.app.get('socketio').emit('updateProducts', await manager.getProducts())
    //     res.send(await manager.getProduct())
    // }
    // else if (limite < 0) {
    //     res.status(406).json({ status: "error", message: "El número es inválido" })
    // } else {
    //     res.json({ prueba: productLimitados })
    // }
})

productRouter.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findById(id).lean().exec()

        if (id === null || id < 0) {
            res.status(406).json({ status: "error", error: "Not found" })
        } else {
            // res.send(await manager.getProductById(Number(id)))
            res.status(200).json({ status: "success", payload: result })
        }
    } catch (err) {
            res.status(500).json({status: "error", error: err.message})
    }
})

productRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const newProduct = await productModel.create(product)
        // const productsActualizados = await productModel.find().lean().exec()
            res.status(201).json({ status: "success", payload: newProduct })
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }

    //     if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
    //         return res.status(400).json({ message: "Faltan campos" })
    //     } else {
    //         await manager.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnails)
    //         req.app.get("socketio").emit("updateProducts", await manager.getProduct())
    //         return res.status(201).json({ message: 'Producto agregado' })
    //     }
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
    }
}catch(err){
    res.status(500).json({status: "error", error: err.message})
}


    // const id = req.params.pid
    // const newData = req.body
    // const producto = await manager.updateProduct(id, newData)
    // if (producto === "error") {
    //     return res.status(400).json({ message: "Faltan campos" })
    // } else {
    //     req.app.get("socketio").emit("updateProducts", await manager.getProduct())
    //     return res.status(200).json({ message: "Producto actualizado" })
    // }
})

productRouter.delete("/:pid", async (req, res) => {
    try{
        const id= req.params.pid
        const result= await productModel.findByIdAndDelete(id)
        if (result == null) {
            res.status(404).json({status: "error", error: "Not found"})
        } else {
            res.status(200).json({status: "success", payload: result})
        }
    }catch(err){
        res.status(500).json({status:"error", error: err.message})
    }
    // const id = req.params.pid
    // const productoEliminado = await manager.deleteProduct(id)
    // if (productoEliminado === "error") {
    //     return res.status(400).json({ message: "Producto no encontrado" })
    // } else {
    //     req.app.get('socketio').emit('updateProducts', await manager.getProduct())
    //     return res.status(200).json({ message: `Producto con id: ${id} eliminado` })

    // }

})

export default productRouter