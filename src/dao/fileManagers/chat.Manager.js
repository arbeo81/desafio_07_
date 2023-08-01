import fs from "fs";
import __dirname from "../../utils.js";

class ChatManager {
    constructor() {
        this.chatJSON = __dirname + "/files/Chat.json"
    }

    getMessages = async () => {
        try {
            const data = await fs.promises.readFile(this.chatJSON, "utf-8");
            const messages = JSON.parse(data);
            return messages;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los mensajes");
        }
    }

    validateMessage(message,user) {
        if (!message) {
            throw new Error("El mensaje es requerido");
        }
        if (!user) {
            throw new Error("El usuario es requerido");
        }
    }

    addMessage = async (message, user) => {
        this.validateMessage(message);
        const messages = await this.getMessages();
        const newMessage = {
            id: messages.length + 1,
            message: message.trim(),
            user: user.trim()
        }
        messages?.push(newMessage)

        await fs.promises.writeFile(
            this.chatJSON,
            JSON.stringify(messages , null, "\t")
        );
        return newMessage;
    }

    editarMessage = async (id, changes) => {
        const messages = await this.getMessages();
        const messageIndex = messages.findIndex((message) => message.id == id);

        if (messageIndex === -1) {
            throw new Error(`No se encontró el mensaje con ID ${id}`);
        }

        const updatedMessage = {...messages[messageIndex],...changes,};
        messages[messageIndex] = updatedMessage;

        await fs.promises.writeFile(
            this.chatJSON,
            JSON.stringify(messages, null, "\t")
        );

        return updatedMessage;
    }

    eliminarMessage = async (id) => {
        const messages = await this.getMessages();
        const index = messages.findIndex((p) => p.id == id);

        if (index === -1) {
            throw new Error(`No se encontró el mensaje con ID ${id}`);
        }
        messages.splice(index, 1);

        await fs.promises.writeFile(
            this.chatJSON,
            JSON.stringify(messages, null, "\t")
        );

        return `Se eliminó el mensaje ${id} correctamente`;
    }

}

export default ChatManager;