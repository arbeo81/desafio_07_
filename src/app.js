import express from "express";
import cartsRouter from "./router/carts.router.js";
import productRouter from "./router/product.router.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import socket from "./socket.js";
import viewsRouter from "./router/views.router.js";
import { MONGODB, PORT, SESSION_SECRET } from "./config.js";
import { connectToDatabase } from "./database/database.js";
import chatRouter from "./router/chat.router.js";
import sessionsRouter from "./router/sessions.router.js";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import session from "express-session";
import handlebar from 'handlebars'
import cookieParser from "cookie-parser";
import initializePassport from "./passport.js";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";


const app = express();

// Registro del helper "eq"
handlebar.helpers.eq = function(a, b) {
    return a === b;
    };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: MONGODB,
            ttl: 360,
        }),
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET,
    })
);

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corre en el puerto ${PORT}`);
});

socket.connect(httpServer)
connectToDatabase();