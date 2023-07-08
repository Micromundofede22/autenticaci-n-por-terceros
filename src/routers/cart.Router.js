import { Router } from "express";
import { cartsModel } from "../dao/models/cart.model.js"


const cartRouter = Router()


cartRouter.post('/', async (req, res) => {
    try {
        const newCart = req.body
        const result= await cartsModel.create(newCart)
        res.status(200).json({ status: "success", payload: result})
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
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
        const actualizado = await cartsModel.findById(cid).populate("products.product") //2do lo busco. Populateo la info de product en products para que aparezca en el carrito y asi se relacionen ambas bases de datos(cart y products)
        res.status(200).json({ status: "success", payload: actualizado }) //3ero lo mando al json
    } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
}
})

cartRouter.delete("/:cid/product/:pid", async(req, res)=>{
    try {
        const cid= req.params.cid
        const pid= req.params.pid
        let cart= await cartsModel.findById(cid)
        
        cart.products.filter((prod)=> prod._id != "64a061ab2407571397ff7ca0")
        console.log(cart)
        await cartsModel.updateOne({_id: cid}, cart)

        const result= await cartsModel.findById(cid).populate("products.product")

        res.status(200).json({status: "success", payload: result})
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message})
    }
})


export default cartRouter