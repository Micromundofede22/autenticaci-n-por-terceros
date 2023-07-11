import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const viewsRouter= Router()


viewsRouter.get("/", async (req, res)=>{
    const page= req.query.page || 1
    const limit= req.query.limit || 10
    const products= await productModel.paginate({}, {page, limit, lean:true}) //lean pasa datos con formato de mongo a objetos de js
    
    products.prevLink= products.hasPrevPage
                        ? `/handleproducts?page=${products.prevPage}&limit=${limit}`
                        : ""
    products.nextLink= products.hasNextPage
                        ? `/handleproducts?page=${products.nextPage}&limit=${limit}`                    
                        :""
    res.render("home", products);
})

viewsRouter.get("/realtimeproducts", async (req, res)=>{
    const products= await productModel.find();
    res.render("realTimeProducts", {products});
});


export default viewsRouter;