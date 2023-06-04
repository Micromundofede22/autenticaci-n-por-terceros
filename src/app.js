import express from "express";
import productRouter from "./routers/productRouter.js";
import cartRouter from "./routers/cartRouter.js";



const app= express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/products', productRouter)
app.use('/carts', cartRouter)

// express escucha atento en puerto 8080
app.listen(8080, ()=>console.log("server up"))

