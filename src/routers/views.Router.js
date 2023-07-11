import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartsModel } from "../dao/models/cart.model.js";

const viewsRouter= Router()


viewsRouter.get("/", async (req, res)=>{
    try {
        
        const page= req.query.page || 1
        const limit= req.query.limit || 10
        const products= await productModel.paginate({}, {page, limit, lean:true}) //lean pasa datos con formato de mongo a objetos de js
        
        products.prevLink= products.hasPrevPage
                            ? `/products?page=${products.prevPage}&limit=${limit}`
                            : ""
    
        products.nextLink= products.hasNextPage
                            ? `/products?page=${products.nextPage}&limit=${limit}`                    
                            :""
        const id= products.docs.id
       
        products.addLink= async function () {
             console.log(id)
           const cart= await cartsModel.findById("64adc7bc4952280f6310357d")
           cart.products.push({product:id, quantity:1})
            await cartsModel.updateOne({_id:"64adc7bc4952280f6310357d"}, cart)
            const result= await cartsModel.findById("64adc7bc4952280f6310357d")
            res.status(200).json({ status: "success", payload: result })
        }
        
    
        res.render("home", products);
    } catch (err) {
        res.render("Error del servidor")
    }
})



viewsRouter.get("/realtimeproducts", async (req, res)=>{
    const products= await productModel.find();
    res.render("realTimeProducts", {products});
});


export default viewsRouter;