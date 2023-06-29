import mongoose from "mongoose";

const productsCollection= "products";

const productsSchema= new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    // si pongo default true, significa que no es requerido, ya que viene por defecto
    status: {type: Boolean, default: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    // por default viene vacío, por lo que no es requerido
    thumbnails: {type: [String], default:[]}
});

mongoose.set("strictQuery", false)

export const productModel= mongoose.model(productsCollection, productsSchema)