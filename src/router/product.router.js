import express from "express";
import { uploader } from "../utils.js";
import { ProductsDataBase } from "../dao/dbManagers/products.js";

const router = express.Router();
const productDatabase = new ProductsDataBase()

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const page = req.query.page;
        const query = req.query;
        const response = await productDatabase.getProducts(limit, page, query);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const producto = await productDatabase.getProductById(pid);
        return res.status(200).send({ producto });
    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
});

router.post("/", uploader.array("thumbnail", 10), async (req, res) => {
    try {
        const { title, description, price, code, stock, category } = req.body;
        const thumbnailUrl = req?.files?.map(file => `http://localhost:8080/images/${file.filename}`)
        const newProduct = await productDatabase.addProduct(
            title, description, price, thumbnailUrl, code, stock, category
        );

        return res.status(201).send({ status: 'Succes', message: 'Se creó el producto correctamente', product: newProduct });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.put("/:id", uploader.array("thumbnail", 10), async (req, res) => {
    const productId = req.params.id;
    const changes = req.body;
    const thumbnailUrl = req?.files?.map(file => `http://localhost:8080/images/${file.filename}`)

    if (!thumbnailUrl) {
        return res.status(400).send({ status: "Error", error: "No se envio niguna imagen!!" });
    }

    try {
        const updatedProduct = await productDatabase.editarProducto(productId, {...changes,thumbnail :thumbnailUrl,});

        return res.status(200).send({ status: "OK", message: `El producto se edito correctamente`, updatedProduct });
    } catch (error) {
        return res.status(404).send({ status: "Error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const message = await productDatabase.eliminarProducto(productId);
        return res
            .status(200)
            .send({ status: "Success", message });
    } catch (error) {
        return res
            .status(404)
            .send({ status: "Error", message: error.message });
    }
});

export default router;