import { Router } from "express";
import { ChatDataBase } from "../dao/dbManagers/chat.js";
import { ProductsDataBase } from "../dao/dbManagers/products.js";
import { CartsDataBase } from "../dao/dbManagers/carts.js";
import { UserDataBase } from "../dao/dbManagers/user.js";
import { checkLogged, checkLogin } from "../middlewares/auth.js";
import { authorization, passportCall } from "../utils.js";

const router = Router();
const productDataBase = new ProductsDataBase();
const chatDataBase = new ChatDataBase();
const cartsDataBase = new CartsDataBase();
const userDataBase = new UserDataBase();

router.get("/login", checkLogged, async (req, res) => {
    res.render("login", { title: "Login", user: req.session.user });
});

router.get("/github", passportCall("github", { scope: ["user:email"] }));

router.get("/github/callback", passportCall("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});

router.get("/register", checkLogged, (req, res) => {
    res.render("register", { title: "Register", user: req.session.user });
});

router.get("/profile", checkLogin, (req, res) => {
    res.render("profile", { user: req.session.user });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get("/products", checkLogin, async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const {
        payload: products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
    } = await productDataBase.getProducts(limit, page, query);

    return res.render("products", {
        products: products,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        user: req.session.user,
    });

});

router.get("/product/:pid", checkLogin, async (req, res) => {
    try {
        const pid = req.params.pid;
        const producto = await productDataBase.getProductById(pid);
        return res.render("product", { title: "Product", producto: producto, user: req.session.user });
    } catch (error) {
        console.error(error);
        return res.status(404).send({ status: "Error", error: "No se encontró el producto seleccionado" });
    }
});

router.get("/cart/:cid", checkLogin, async (req, res) => {
    const cid = req.params.cid;
    const cart = await userDataBase.getUserCartById(cid);
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.render("cart", { title: "Cart", cart: cart, user: req.session.user });
    }
});

router.get("/admin", checkLogin, passportCall("jwt"), authorization("admin") , async (req, res) => {
    const cart = await userDataBase.getUser()
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.render("admin", { title: "admin", cart: cart, user: req.session.user });
    }
});

router.get("/realtimeproducts", checkLogin, async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const productos = await productDataBase.getProducts(limit, page, query);
    res.render("realtimeproducts", { title: "realtimeproducts", productos: productos, user: req.session.user });
});

router.get("/", checkLogin, async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const productos = await productDataBase.getProducts(limit, page, query);
    res.render("home", { title: "home", productos: productos, user: req.session.user });
});

router.get("/chat", checkLogin, async (req, res) => {
    const messages = await chatDataBase.getMessages();
    res.render("chat", { title: "chat", messages: messages, user: req.session.user });
});

export default router;