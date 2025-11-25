document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (!form) return;

    const errorBox = document.getElementById("login-error");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (errorBox) {
            errorBox.textContent = "";
            errorBox.classList.remove("visible");
        }

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                window.location.href = "/";
            } else if (errorBox) {
                errorBox.textContent = data.message || "Credenciales inválidas";
                errorBox.classList.add("visible");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            if (errorBox) {
                errorBox.textContent = "No se pudo conectar con el servidor";
                errorBox.classList.add("visible");
            }
        }
    });
});