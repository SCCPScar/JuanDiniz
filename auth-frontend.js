// auth-frontend.js
// Controla os modais de login/cadastro, envia os formulários para a API
// e atualiza o menu (Entrar/Cadastrar vs. Olá, Nome / Sair) conforme a sessão.

document.addEventListener("DOMContentLoaded", () => {

    // BOTÕES
    const btnCadastroAbrir = document.querySelectorAll('[data-open-modal="cadastro"]');
    const btnLoginAbrir = document.querySelectorAll('[data-open-modal="login"]');
    const btnLogout = document.getElementById("btnLogout");

    // MODAIS
    const modalLogin = document.getElementById("modalLogin");
    const modalCadastro = document.getElementById("modalCadastro");

    // FORMULÁRIOS
    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const loginErro = document.getElementById("loginErro");
    const cadastroErro = document.getElementById("cadastroErro");

    // ESTADO DE SESSÃO NO MENU
    const navLoggedOut = document.getElementById("navAuthLoggedOut");
    const navLoggedIn = document.getElementById("navAuthLoggedIn");
    const navUserNome = document.getElementById("navUserNome");
    const navUserAvatar = document.getElementById("navUserAvatar");

    function abrirModal(modal) {
        if (modal) modal.hidden = false;
    }

    function fecharModais() {
        if (modalLogin) modalLogin.hidden = true;
        if (modalCadastro) modalCadastro.hidden = true;
    }

    function mostrarErro(el, mensagem) {
        if (!el) return;
        el.textContent = mensagem;
        el.hidden = false;
    }

    function esconderErro(el) {
        if (!el) return;
        el.hidden = true;
    }

    // Marca com borda vermelha os campos com problema; some assim que o
    // usuário mexe em qualquer um deles de novo.
    function destacarCampos(campos) {
        campos.forEach((campo) => {
            if (!campo) return;
            campo.classList.add("campo-erro");
            campo.addEventListener("input", () => campo.classList.remove("campo-erro"), { once: true });
        });
    }

    function limparDestaque(campos) {
        campos.forEach((campo) => campo && campo.classList.remove("campo-erro"));
    }

    function definirCarregando(botao, carregando) {
        botao.classList.toggle("btn-carregando", carregando);
        botao.disabled = carregando;
    }

    function mostrarLogado(usuario) {
        if (navLoggedOut) navLoggedOut.hidden = true;
        if (navLoggedIn) navLoggedIn.hidden = false;
        if (navUserNome) navUserNome.textContent = usuario.nome;
        if (navUserAvatar) navUserAvatar.textContent = usuario.nome.trim().charAt(0).toUpperCase();
    }

    function mostrarDeslogado() {
        if (navLoggedOut) navLoggedOut.hidden = false;
        if (navLoggedIn) navLoggedIn.hidden = true;
    }

    // ---------- Verifica sessão atual ----------
    async function verificarSessao() {
        try {
            const resp = await fetch("api/sessao.php");
            const dados = await resp.json();

            if (dados.usuario) {
                mostrarLogado(dados.usuario);
            } else {
                mostrarDeslogado();
            }
        } catch {
            mostrarDeslogado();
        }
    }

    // ---------- Abrir modais ----------
    btnLoginAbrir.forEach((btn) => btn.addEventListener("click", () => abrirModal(modalLogin)));
    btnCadastroAbrir.forEach((btn) => btn.addEventListener("click", () => abrirModal(modalCadastro)));

    // ---------- Fechar modais ----------
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", fecharModais);
    });

    document.querySelectorAll(".auth-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) fecharModais();
        });
    });

    // ---------- Login ----------
    formLogin?.addEventListener("submit", async (e) => {
        e.preventDefault();
        esconderErro(loginErro);

        const campoEmail = document.getElementById("loginEmail");
        const campoSenha = document.getElementById("loginSenha");
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        const botao = formLogin.querySelector(".auth-submit");

        limparDestaque([campoEmail, campoSenha]);
        definirCarregando(botao, true);

        try {
            const resp = await fetch("api/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                mostrarErro(loginErro, dados.erro || "Não foi possível entrar.");
                destacarCampos([campoEmail, campoSenha]);
                return;
            }

            fecharModais();
            formLogin.reset();
            location.reload();
        } catch {
            mostrarErro(loginErro, "Erro de conexão. Tente novamente.");
        } finally {
            definirCarregando(botao, false);
        }
    });

    // ---------- Cadastro ----------
    formCadastro?.addEventListener("submit", async (e) => {
        e.preventDefault();
        esconderErro(cadastroErro);

        const campoNome = document.getElementById("cadastroNome");
        const campoEmail = document.getElementById("cadastroEmail");
        const campoSenha = document.getElementById("cadastroSenha");
        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        const botao = formCadastro.querySelector(".auth-submit");

        limparDestaque([campoNome, campoEmail, campoSenha]);
        definirCarregando(botao, true);

        try {
            const resp = await fetch("api/cadastro.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                mostrarErro(cadastroErro, dados.erro || "Não foi possível criar a conta.");

                const mensagem = dados.erro || "";
                if (mensagem.includes("senha")) destacarCampos([campoSenha]);
                else if (mensagem.includes("mail")) destacarCampos([campoEmail]);
                else destacarCampos([campoNome, campoEmail, campoSenha]);

                return;
            }

            fecharModais();
            formCadastro.reset();
            location.reload();
        } catch {
            mostrarErro(cadastroErro, "Erro de conexão. Tente novamente.");
        } finally {
            definirCarregando(botao, false);
        }
    });

    // ---------- Logout ----------
    btnLogout?.addEventListener("click", async () => {
        try {
            await fetch("api/logout.php", { method: "POST" });
        } finally {
            mostrarDeslogado();
            location.reload();
        }
    });

    verificarSessao();
});
