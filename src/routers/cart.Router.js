import { Router } from "express";
import { CartManager } from "../dao/fsManager/CartManager.js";
import {cartsModel} from "../dao/models/cart.model.js"

const cartRouter= Router()
const manager = new CartManager("./Cart.json")


cartRouter.post('/', async (req, res) => {
try{
    const newCart= req.body
    const result= await cartsModel.create(newCart)
    res.status(200).json({status: "success", payload: result})
}catch(err){
    res.status(500).json({status: "error", error: err.message})
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
    try{
        const id= req.params.cid
        const result= await cartsModel.findById(id)
        if (id == null) {
            res.status(406).json({status: "error", error: "Not found"})
        } else {
            res.status(200).json({status: "success", payload: result})
        }
    }catch(err){
        res.status(500).json({status: "error", error: err.message})
    }
    // const id = req.params.cid
    // if (id < 0) {
    //     res.status(406).json({ message: "El id es inválido" })
    // } else {
    //     res.send(await manager.getCartById(Number(id)))
    // }
})

cartRouter.post("/:cid/product/:pid", async(req,res) => {
    try{
        const cid= req.params.cid;
        const pid= req.params.pid;
        const cart= cartsModel.findById(cid).create(pid)

        if (cid || pid == null) {
            res.status(404).json({status: "error", error: "Not found"})
        } else {
            res.status(200).json({status: "success", payload: cart})
        }
    }catch(err){
        res.status(500).json({status: "error", error: err.message})
    }
    // const cid= req.params.cid
    // const pid= req.params.pid

    // if ((cid && pid < 0) ||(!cid || !pid) ) {
    //     res.status(406).json({ message: "El id es inválido" })
    // } else {
    //     res.send(await manager.addInCart(cid, pid))
    // }
    

})

export default cartRouter