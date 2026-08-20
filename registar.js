// registar.js
// Envia o formulário de registo e, se tudo correr bem, leva o cliente
// para a sua área de conta (já com sessão iniciada).

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistar");
    if (!form) return;

    const erro = document.getElementById("registarErro");
    const campoNome = document.getElementById("registarNome");
    const campoEmail = document.getElementById("registarEmail");
    const campoPalavraPasse = document.getElementById("registarPalavraPasse");

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
        [campoNome, campoEmail, campoPalavraPasse].forEach((c) => c.classList.remove("campo-erro"));

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const senha = campoPalavraPasse.value;
        const botao = form.querySelector(".auth-submit");

        definirCarregando(botao, true);

        try {
            const resp = await fetch("api/registar.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                erro.textContent = dados.erro || "Não foi possível criar a conta.";
                erro.hidden = false;

                const mensagem = dados.erro || "";
                if (mensagem.includes("passe")) destacarCampos([campoPalavraPasse]);
                else if (mensagem.includes("mail")) destacarCampos([campoEmail]);
                else destacarCampos([campoNome, campoEmail, campoPalavraPasse]);

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
