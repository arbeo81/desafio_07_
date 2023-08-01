import express from "express";
import { CartsDataBase } from "../dao/dbManagers/carts.js";
import { UserDataBase } from "../dao/dbManagers/user.js";

const router = express.Router();

const cartsDataBase = new CartsDataBase();
const userDataBase = new UserDataBase();

router.get("/", async (req, res) => {
    const cart = await cartsDataBase.getCarts();
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.status(200).send({ status: "Succes", message: "OK", cart });
    }
});

router.get("/:uid", async (req, res) => {
    const uid = req.params.uid;
    const cart = await userDataBase.getUserById(uid);
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.status(200).send({ status: "Succes", message: "OK", cart });
    }
});

router.post("/", async (req, res) => {
    try {
        const cartId = parseInt(req.params.id);
        const cart = req.body;
        cart.id = cartId;
        const updatedCart = await cartsDataBase.addCart(cart);
        return res.status(201).send({ status: 'Succes', message: 'Se creo el carritoo correctamente', updatedCart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const product = req.body;
        const productID = req.params.pid;
        const carritoID = req.params.cid;

        const cart = await cartsDataBase.addProducts(productID, carritoID, product.quantity || 1);

        return res.status(201).send({ status: 'Success', message: 'Se creo el producto correctamente', result: cart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const carritoID = req.params.cid;

        const cart = await cartsDataBase.eliminarTodosLosProductos(carritoID)

        return res.status(201).send({ status: 'Success', message: 'Se eliminaron los productos correctamente', result: cart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartsDataBase.eliminarProducto(productId,cartId)

        return res.status(200).send({ status: 'Success', message: 'Se elimino el producto correctamente', result: cart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const newProducts = req.body;
        const carritoID = req.params.cid;

        const cart = await cartsDataBase.editarCart(carritoID, newProducts);

        return res.status(200).send({ status: 'Success', message: 'Se actualizaron los productos correctamente', result: cart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const productID = pid;

        const updatedCart = await cartsDataBase.updateProductQuantity(productID, cid, quantity);

        return res.status(200).send({ status: 'Success', message: 'Se actualizó la cantidad de unidades del producto correctamente', result: updatedCart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

export default router;