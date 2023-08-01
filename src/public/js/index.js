const socket = io();

///FUNCIONES DEL CHAT///

let user;
let chatBox = document.getElementById("chatBox");
let chatSubmit = document.getElementById("chatSumbit");

Swal.fire({
    title: "Ingresa un correo",
    input: "text",
    text: "Ingresa el usuario para comunicarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un correo de usuario para continuar";
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    if (user) {
        Swal.fire({
            title: "Usuario conectado",
            text: `Bienvenido ${user}`,
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 2000
        });
    }
});

chatBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
    chatSubmit.addEventListener("click", sendMessage);

function sendMessage() {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value });
        chatBox.value = "";
    }
}

socket.on("messageLogs", (data) => {
    let messages = "";
    data.forEach((message) => {
        console.log(message)
        let userMessage = `<div style="font-weight: 800; font-size: 22px">${message.user}</div>`
        let messageStyle = (message.user === user) ?
            "background-color: #3a573f; color: rgb(201, 190, 190); padding: 6px; border-radius: 8px; font-size: 18px; margin-bottom: 8px; display: flex; justify-content: end; width: 100%; display: flex; align-items: center;" :
            "background-color: #97ba9d; color: black; padding: 6px; border-radius: 8px; font-size: 18px; margin-bottom: 8px; display: flex; justify-content: start; width: 100%; display: flex; align-items: center;";
        messages += `<div style="${messageStyle}"> ${userMessage} : ${message.message} <button 
        style="background: rgb(191, 93, 93);border: none; border-radius: 12px;font-size: 8px; cursor: pointer;"
        type="button" onclick="eliminarMensaje('${message._id}')">Eliminar</button></div>`;
    });

    messageLogs.innerHTML = messages;
});

function eliminarMensaje(messageId) {
    socket.emit("eliminarMessage", messageId);
}

socket.on("userConnected", (data) => {
    Swal.fire({
        title: "Usuario conectado",
        text: `${user} se ha conectado`,
        icon: "info",
        position: "top-start",
        toast: true,
        showConfirmButton: false,
        timer: 2000
    });
});

socket.on("userDisconnected", (data) => {
    Swal.fire({
        title: `Usuario ${user} desconectado`,
        text: `${user} se ha desconectado`,
        icon: "warning",
        position: "top-start",
        toast: true,
        showConfirmButton: false,
        timer: 2000
    });
});

