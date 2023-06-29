import { Router } from "express";
import { ProductManager } from "../dao/fsManager/ProductManager.js";

const viewsRouter= Router()
const manager= new ProductManager("./Productos.json");


viewsRouter.get("/", async (req, res)=>{
    const products= await manager.getProduct();
    res.render("home", {products});
})

viewsRouter.get("/realtimeproducts", async (req, res)=>{
    const products= await manager.getProduct();
    res.render("realTimeProducts", {products});
});


export default viewsRouter;