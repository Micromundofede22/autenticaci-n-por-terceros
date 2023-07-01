import express from "express";
import productRouter from "./routers/product.Router.js";
import cartRouter from "./routers/cart.Router.js";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import viewsRouter from "./routers/views.Router.js"
import mongoose from "mongoose"
import multerRouter from "./routers/multer.Router.js"
import routerChat from "./routers/chat.Router.js"


const app= express()

//configuracion del motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.json()) //para que mi servidor pueda recibir json del cliente
app.use(express.urlencoded({extended:true})) //para que mi servidor pueda recibir json que llegan por formulario desde el cliente
app.use(express.static("./public"))

app.use("/post", multerRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use("/handleproducts", viewsRouter)
app.use("/chat", routerChat)

try{
    await mongoose.connect("mongodb+srv://fedecoder:fedecoder@cluster0.irwwxpb.mongodb.net/ecommers")
    const serverHTTP= app.listen(8080, ()=>console.log("Server up"))
    const io= new Server(serverHTTP)
    app.set("socketio", io)

    const messages = []

    io.on('connection', socket => { //servidor escucha cuando llega una nueva conexion
        socket.broadcast.emit('alerta') //es una 3era emisión que avisa a todos menos a quien se acaba de conectar. (las otras dos son socket.emit y io.emit) io es el servidor y socket el cliente
        socket.emit('logs', messages) //solo emite a ese cliente el historial, (no a todos, sino se repetiria el historial)
        socket.on('message', data => { //cuando cliente me haga llegar un mensaje, lo pusheo
            messages.push(data)
            io.emit('logs', messages) // y el servidor io emite a todos el historial completo
        })
    })

}catch(err){
    console.log(err.message)
}










// io.on("connection", socket =>{
//     console.log("nuevo cliente")
//     socket.on('products', data =>{
//         io.emit('updateProducts',data)
//     })
// })