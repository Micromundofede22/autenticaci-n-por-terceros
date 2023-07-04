import { Router } from "express";
// import { CartManager } from "../dao/fsManager/CartManager.js";
import { cartsModel } from "../dao/models/cart.model.js"


const cartRouter = Router()
// const manager = new CartManager("./Cart.json")


cartRouter.post('/', async (req, res) => {
    try {
        const newCart = req.body
        const result= await cartsModel.create(newCart)
        res.status(200).json({ status: "success", payload: result})
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // const newCart = req.body
    // if (!newCart) {
    //     return res.status(400).json({ message: "Faltan campos" })
    // } else {
    //     await manager.addCart(newCart.products)
    //     return res.status(201).json({ message: 'Carrito agregado' })
    // }
})

cartRouter.get("/:cid", async (req, res) => {
    try {
        const id = req.params.cid
        const result = await cartsModel.findById(id)
        if (id == null) {
            res.status(406).json({ status: "error", error: "Not found" })
        } else {
            res.status(200).json({ status: "success", payload: result })
        }
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartsModel.findById(cid)

        let acum = 0
        cart.products.map((datos) => {
            if (datos.product == pid) {
                acum++;
                datos.quantity++;
            }
        })

        if (acum === 0) {
            cart.products.push({ product: pid, quantity: 1 })
        }

        await cartsModel.updateOne({ _id: cid }, cart) //1ero actualizo el carrito
        const actualizado = await cartsModel.findById(cid) //2do lo busco
        res.status(200).json({ status: "success", payload: actualizado }) //3ero lo mando al json
    } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
}
})


export default cartRouter