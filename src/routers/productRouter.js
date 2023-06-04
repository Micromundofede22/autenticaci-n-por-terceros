import { Router } from "express";
import { ProductManager } from "../ProductManager.js"

const productRouter = Router()
const manager = new ProductManager("./Productos.json")

productRouter.get("/", async (req, res) => {
    let limite = req.query.limite
    const productLimitados = await manager.getProduct()
    const prueba = productLimitados.slice(0, Number(limite))

    if (!limite) res.send(await manager.getProduct())
    else if (limite < 0) {
        res.status(406).json({ message: "El número es inválido" })
    } else {
        res.json({ prueba })
    }
})

productRouter.get("/:pid", async (req, res) => {
    const id = req.params.pid
    if (id < 0) {
        res.status(406).json({ message: "El id es inválido" })
    } else {
        res.send(await manager.getProductById(Number(id)))
    }

})

productRouter.post('/', async (req, res) => {
    const product = req.body
    if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
        return res.status(400).json({ message: "Faltan campos" })
    } else {
        await manager.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnails)
        return res.status(201).json({ message: 'Producto agregado' })
    }
})

productRouter.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const newData = req.body
    const producto= await manager.updateProduct(id, newData)
    if (producto === "error") {
        return res.status(400).json({ message: "Faltan campos" })
    } else {
        return res.status(200).json({ message: "Producto actualizado" })
    }
})

productRouter.delete("/:pid", async (req, res)=>{
    const id= req.params.pid
    const productoEliminado= await manager.deleteProduct(id)
    if (productoEliminado ==="error") {
         return res.status(400).json({ message: "Producto no encontrado" })
    } else {
        return res.status(200).json({ message:  `Producto con id: ${id} eliminado` })
       
    }

})

export default productRouter