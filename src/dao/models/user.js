import { model, Schema } from "mongoose";
import { cartsModel } from "./carts.js";

const userCollection = "user";

const userSchema = new Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        email: { type: String, unique: true },
        age: { type: Number },
        role: { type: String },
        password: { type: String },
        cart: { type: cartsModel.schema },
    }
);

export default model(userCollection, userSchema)