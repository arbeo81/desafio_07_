import { model, Schema } from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new Schema(
    {
        user: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }
);

export const messagesModel = model(messagesCollection, messagesSchema);