import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const productRouter = Router()

// busqueda por query
productRouter.get("/", async (req, res) => {
    try {
        const limite = req.query.limite || 10
        const page = req.query.page || 1
        const sort = req.query.sort || 0
        const status = req.query.status
        const category = req.query.category


        const result = await productModel.paginate(
            (status && category) //filtros
                ? { status: status, category: category }
                : {}
            ,

            (limite || page && sort)
                ? { limit: limite, page: page, sort: { price: Number(sort) } }
                : {limit:limite, page:page}
        )

        result.prevLink = result.hasPrevPage
            ? `/api/products?page=${result.prevPage}&limite=${limite}`
            : ``;

        result.nextLink = result.hasNextPage
            ? `/api/products?page=${result.nextPage}&limite=${limite}`
            : ``


        res.status(200).json({
            status: "success",
            payload: result,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink
        })

        req.app.get('socketio').emit('updateProducts', await productModel.find().limit(limite))
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

// busqueda por params
productRouter.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findById(id).lean().exec()

        if (id === null || id < 0) {
            res.status(406).json({ status: "error", error: "Not found" })
        } else {
            res.status(200).json({ status: "success", payload: result })
            req.app.get("socketio").emit("updateProducts", await productModel.find())
        }
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

productRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const newProduct = await productModel.create(product)
        res.status(201).json({ status: "success", payload: newProduct })
        req.app.get("socketio").emit("updateProducts", await productModel.find())
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

productRouter.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const newData = req.body
        const result = await productModel.findByIdAndUpdate(id, newData, { returnDocument: "after" })

        if (result === null) {
            res.status(404).json({ status: "error", error: "Not found" })
        } else {
            res.status(200).json({ status: "success", payload: result })
            req.app.get("socketio").emit("updateProducts", await productModel.find())
        }
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

productRouter.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findByIdAndDelete(id)
        if (result == null) {
            res.status(404).json({ status: "error", error: "Not found" })
        } else {
            res.status(200).json({ status: "success", payload: result })
            req.app.get("socketio").emit("updateProducts", await productModel.find())
        }
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

export default productRouter