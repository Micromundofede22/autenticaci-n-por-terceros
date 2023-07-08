import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    status: {type: Boolean, default: true}, //default true, significa que no es requerido, ya que viene por defecto
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    thumbnails: {type: [String], default:[]} // por default viene vacío, por lo que no es requerido
});

mongoose.set("strictQuery", false)

export const productModel= mongoose.model("products", productSchema)