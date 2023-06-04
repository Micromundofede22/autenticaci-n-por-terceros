import { Router } from "express";
import { CartManager } from "../CartManager.js";

const cartRouter= Router()
const manager = new CartManager("./Cart.json")


cartRouter.post('/', async (req, res) => {
    const newCart = req.body
    if (!newCart) {
        return res.status(400).json({ message: "Faltan campos" })
    } else {
        await manager.addCart(newCart.products)
        return res.status(201).json({ message: 'Carrito agregado' })
    }
})

cartRouter.get("/:cid", async (req, res) => {
    const id = req.params.cid
    if (id < 0) {
        res.status(406).json({ message: "El id es inválido" })
    } else {
        res.send(await manager.getCartById(Number(id)))
    }
})

cartRouter.post("/:cid/product/:pid", async(req,res) => {
    const cid= req.params.cid
    const pid= req.params.pid

    if ((cid && pid < 0) ||(!cid || !pid) ) {
        res.status(406).json({ message: "El id es inválido" })
    } else {
        res.send(await manager.addInCart(cid, pid))
    }
    

})

export default cartRouter