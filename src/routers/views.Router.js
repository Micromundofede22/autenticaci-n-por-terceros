import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartsModel } from "../dao/models/cart.model.js";
import UserModel from "../dao/models/user.model.js";


const viewsRouter = Router()


viewsRouter.get("/products", async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        
        const session = req.session //1.obtengo la session
        console.log(session)
        const id = session.passport.user //2.obtengo el id de la session guardad en passport
        const user = await UserModel.findById(id) //3. busco el usuario por su id session

        const products = await productModel.paginate({}, { page, limit, lean: true }) //lean pasa datos con formato de mongo a objetos de js
        products.prevLink = products.hasPrevPage                                      //link pagina previa, solo si hay pag previa
            ? `/views/products?page=${products.prevPage}&limit=${limit}`              //la ruta a la q me lleva
            : ""

        products.nextLink = products.hasNextPage                                      //link pag siguiente, solo si hay pag sig
            ? `/views/products?page=${products.nextPage}&limit=${limit}`
            : ""

        res.render("home",
            (user && (user.role === "user"))
                ? {
                    username: user.first_name.toUpperCase(),
                    userLastName: user.last_name.toUpperCase(),
                    role: user.role.toUpperCase(),
                    products: products
                }
                : {
                    username: "admin",
                    userLastName: "coder",
                    role: "admin",
                    products: products
                }
        );
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