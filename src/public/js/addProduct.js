import { cartsModel } from "../../dao/models/cart.model"


const addLink =async function  (id) {
    try{
    console.log(id)
    cart = await cartsModel.findById("64adc7bc4952280f6310357d")
    cart.products.push({ product: id, quantity: 1 })
    await cartsModel.updateOne({ _id: "64adc7bc4952280f6310357d" }, cart)
    const result = await cartsModel.findById("64adc7bc4952280f6310357d")
    res.status(200).json({ status: "success", payload: result })
}catch(err){
    console.log(err)
}
    }

const button= document.getElementById("button")
button.addEventListener("click", addLink())

