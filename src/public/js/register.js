const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => (obj[key] = value));

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(obj.email)) {
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = "Por favor, introduzca un correo electrónico válido";
        return;
    }

    let response = await fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    });

    let result = await response.json();
    console.log(result);

    if (result && result.status === "success") {
        window.location.href = "/login";
    } else if (result && result.error) {
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = result.error;
    } else {
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = "Se produjo un error al intentar registrar al usuario. Por favor, inténtelo de nuevo más tarde.";
    }
});