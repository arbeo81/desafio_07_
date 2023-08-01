import { Server } from "socket.io";
import { ProductsDataBase } from "./dao/dbManagers/products.js";
import { ChatDataBase } from "./dao/dbManagers/chat.js";

const socket = {};
const messageQueue = [];
const productDataBase = new ProductsDataBase();
const chatDB = new ChatDataBase();

socket.connect = function (httpServer) {
    socket.io = new Server(httpServer);
    let { io } = socket;

    io.on("connection", async (socket) => {
        console.log(`${socket.id} connected`);
        socket.broadcast.emit("userConnected", { user: socket.id, message: `${socket.id} se ha conectado` });

        // Obtener todos los mensajes de la base de datos al conectarse un nuevo usuario
        let messages = await chatDB.getMessages();
        socket.emit("messageLogs", messages);

        let productos = await productDataBase.getProducts();
        socket.emit('updateProducts', productos);

        socket.on("addProduct", async (newProduct) => {
            console.log("Nuevo producto:", newProduct);

            const addedProduct = await productDataBase.addProduct(newProduct);

            // Emitir el evento 'updateProducts' a todos los clientes con la lista actualizada de productos
            const productosActualizados = await productDataBase.getProducts();
            console.log("Productos actualizados:", productosActualizados);

            io.emit('updateProducts', productosActualizados);
        });

        socket.on('eliminarProducto', (productoId) => {
                const index = productos.findIndex((producto) => producto._id == productoId);
                if (index !== -1) {
                    productos.splice(index, 1);
                    io.emit('newProduct', productos);
                }
                io.emit('newProduct', productos);
            });
    
            socket.on('editarProducto', (productoId) => {
                const index = productos.findIndex((producto) => producto._id == productoId);
                if (index !== -1) {
                    productos.splice(index, 1);
                    io.emit('newProduct', productos);
                }
                io.emit('newProduct', productos);
            });

        socket.on("message", async (data) => {
            // Agregar el nuevo mensaje a la cola de mensajes y la base de datos
            messageQueue.push(data);
            await chatDB.addMessage(data.message, data.user);

            // Enviar el mensaje solo al cliente que lo ha enviado
            socket.emit("messageSent", { user: data.user, message: data.message });

            // Enviar el mensaje a todos los clientes conectados (incluyendo al que lo ha enviado)
            io.emit("messageLogs", messageQueue);
        });

        socket.on("eliminarMessage", async (messageId) => {
            await chatDB.eliminarMessage(messageId);
            // Envía un evento a todos los clientes para actualizar la lista de mensajes
            let messages = await chatDB.getMessages();
            io.emit("messageLogs", messages);
        });

        socket.on("disconnect", (data) => {
            console.log(`${socket.id} disconnected`);
            socket.broadcast.emit("userDisconnected", { user: socket.id, message: `${socket.id} se ha desconectado` });
        });
    });

};

export default socket;
