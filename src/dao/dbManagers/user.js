import { isValidPassword } from "../../utils.js";
import { createHash } from "../../utils.js";
import { cartsModel } from "../models/carts.js";
import  UserModel  from "../models/user.js";
import jwt from "jsonwebtoken";

export class UserDataBase {
    constructor() { }

    getUser = async () => {
        const data = await UserModel.find();
        const user = data.map((user) => user.toObject());
        return user;
    }

    getUserById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u._id == uid);
        return user;
    };
    getUserCartById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u.cart._id == uid);
        return user;
    };

    registerUser = async (first_name, last_name, email, age, password, cart) => {
        try {
            const userExists = await UserModel.findOne({ email });
            if (userExists) {
                return { status: "error", error: `El usuario ${email} ya existe` };
            }

            const cart = await cartsModel.create({ products: [] });

            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart,
                role: "usuario",
            };

            await UserModel.create(user);
            console.log('user', user);
            return { status: "success", message: "Usuario registrado" };
        } catch (error) {
            console.log(error);
            return { status: "error", error: "Error interno del servidor" };
        }
    };

    loginUser = async (email, password, req, res) => {
        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                return { status: "error", error: "Correo electrónico incorrecto" };
            }

            const validPassword = isValidPassword(user, password);

            if (!validPassword) {
                return { status: "error", error: "Contraseña incorrecta" };
            }

            const { email: userEmail, role: userRole } = user;
            const token = jwt.sign({ email: userEmail, role: userRole }, "userKey", {
                expiresIn: "24h",
            });

            res.cookie("tokenCookie", token, { httpOnly: true });
            console.log('token',token);

            req.session.user = {
                name: user.first_name,
                apellido: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                role: user.role,
            };

            return {
                status: "success",
                message: "Inició sesión",
                payload: req.session.user,
            };
        } catch (error) {
            console.log(error);
            return { status: "error", error: "Error interno del servidor" };
        }
    };

    logoutUser = async (req) => {
        try {
            req.session.destroy();
            return { status: "success", message: "Sesión cerrada" };
        } catch (error) {
            console.log(error);
            return { status: "error", error: "Error interno del servidor" };
        }
    };

}