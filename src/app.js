import express from "express";
import productRouter from "./routers/product.Router.js";
import cartRouter from "./routers/cart.Router.js";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import viewsRouter from "./routers/views.Router.js"
import mongoose from "mongoose"



const app= express()

//configuracion del motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

// para que mi servidor pueda recibir json del cliente
app.use(express.json())
// para que mi servidor pueda recibir json que llegan por formulario desde el cliente
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use("/handleproducts", viewsRouter)




try{
    await mongoose.connect("mongodb+srv://fedecoder:fedecoder@cluster0.irwwxpb.mongodb.net/ecommers")
    const serverHTTP= app.listen(8080, ()=>console.log("Server up"))
    const io= new Server(serverHTTP)
    app.set("socketio", io)
}catch(err){
    console.log(err.message)
}










// io.on("connection", socket =>{
//     console.log("nuevo cliente")
//     socket.on('products', data =>{
//         io.emit('updateProducts',data)
//     })
// })