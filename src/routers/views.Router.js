import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const viewsRouter= Router()


viewsRouter.get("/", async (req, res)=>{
    const products= await productModel.find()
    res.render("home", {products});
})

viewsRouter.get("/realtimeproducts", async (req, res)=>{
    const products= await productModel.find();
    res.render("realTimeProducts", {products});
});


export default viewsRouter;