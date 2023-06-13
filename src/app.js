import express from "express";
import productRouter from "./routers/productRouter.js";
import cartRouter from "./routers/cartRouter.js";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import viewsRouter from "./routers/viewsRouter.js"



const app= express()

//configuracion del motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use("/handleproducts", viewsRouter)


const serverHTTP= app.listen(8080, ()=>console.log("Server up"))
const io= new Server(serverHTTP)
app.set("socketio", io)

// io.on("connection", socket =>{
//     console.log("nuevo cliente")
//     socket.on('products', data =>{
//         io.emit('updateProducts',data)
//     })
// })


