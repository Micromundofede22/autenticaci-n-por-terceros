import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartsModel } from "../dao/models/cart.model.js";



const viewsRouter = Router()


viewsRouter.get("/products", async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 10


        const products = await productModel.paginate({}, { page, limit, lean: true }) //lean pasa datos con formato de mongo a objetos de js
        products.prevLink = products.hasPrevPage                                      //link pagina previa, solo si hay pag previa
            ? `/views/products?page=${products.prevPage}&limit=${limit}`              //la ruta a la q me lleva
            : ""

        products.nextLink = products.hasNextPage                                      //link pag siguiente, solo si hay pag sig
            ? `/views/products?page=${products.nextPage}&limit=${limit}`
            : ""


        const user = req.session.user
        res.render("home", {products, user});
        
    } catch (err) {
        res.render("Error del servidor")
    }
})

viewsRouter.get("/cart/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartsModel.findById(cid).populate("products.product") //muestra carrito con su id y products
        console.log(cart)
        const cartProducts = { products: cart.products.map(prod => prod.toObject()) } //creo un objeto con la prop products, y ahi mapeo el products de cart, pero esta vez transformados objetos, asi puedo acceder a sus propiedades en la vista

        console.log(cartProducts.products)

        res.render("cart", { cartProducts, lean: true })
    } catch (error) {
        res.render("Error del servidor")
    }
})







viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productModel.find();
    res.render("realTimeProducts", { products });
});


export default viewsRouter;