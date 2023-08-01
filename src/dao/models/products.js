import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = "products";

export const productsSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true},
        thumbnail: { type: [String], default: []},
        code: { type: String },
        stock: { type: Number },
        status: {type: Boolean },
        category: {type: String},
    },
    { timestamps: true }
);

productsSchema.plugin(mongoosePaginate);

export const productsModel = model(productsCollection, productsSchema);