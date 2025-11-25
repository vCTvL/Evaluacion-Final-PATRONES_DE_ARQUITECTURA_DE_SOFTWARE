document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("crear-usuario-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, email, password })
            });

            if (response.ok) {
                window.location.href = "/usuarios";
            } else {
                alert("Error al crear usuario");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la conexión con el servidor");
        }
    });
});
