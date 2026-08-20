// entrar.js
// Envia o formulário de login e, se tudo correr bem, leva o cliente
// para a sua área de conta.

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formEntrar");
    if (!form) return;

    const erro = document.getElementById("entrarErro");
    const campoEmail = document.getElementById("entrarEmail");
    const campoPalavraPasse = document.getElementById("entrarPalavraPasse");

    function destacarCampos(campos) {
        campos.forEach((campo) => {
            campo.classList.add("campo-erro");
            campo.addEventListener("input", () => campo.classList.remove("campo-erro"), { once: true });
        });
    }

    function definirCarregando(botao, carregando) {
        botao.classList.toggle("btn-carregando", carregando);
        botao.disabled = carregando;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        erro.hidden = true;
        campoEmail.classList.remove("campo-erro");
        campoPalavraPasse.classList.remove("campo-erro");

        const email = campoEmail.value.trim();
        const senha = campoPalavraPasse.value;
        const botao = form.querySelector(".auth-submit");

        definirCarregando(botao, true);

        try {
            const resp = await fetch("api/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                erro.textContent = dados.erro || "Não foi possível entrar.";
                erro.hidden = false;
                destacarCampos([campoEmail, campoPalavraPasse]);
                return;
            }

            location.href = "conta.html";
        } catch {
            erro.textContent = "Erro de ligação. Tente novamente.";
            erro.hidden = false;
        } finally {
            definirCarregando(botao, false);
        }
    });
});
