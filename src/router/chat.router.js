import express from "express";
import { ChatDataBase } from "../dao/dbManagers/chat.js";

const router = express.Router();
const chatDatabase = new ChatDataBase();

router.get("/", async (req, res) => {
    try {
        const messages = await chatDatabase.getMessages()
        res.status(200).send({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { message, user } = req.body;
        const newMessage = await chatDatabase.addMessage(message, user)

        return res.status(201).send({ status: 'Succes', message: 'Se creó el mensaje correctamente', product: newMessage });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.put("/:id",  async (req, res) => {
    const messageId = req.params.id;
    const changes = req.body;

    try {
        const updatedMessage = await chatDatabase.editarMessage(messageId, {...changes });

        return res.status(200).send({ status: "OK", message: `El mensaje se edito correctamente`, updatedMessage });
    } catch (error) {
        return res.status(404).send({ status: "Error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const messageId = req.params.id;

    try {
        const message = await chatDatabase.eliminarMessage(messageId);
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