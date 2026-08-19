// auth-frontend.js
// Controla os modais de login/cadastro, envia os formulários para a API
// e atualiza o menu (Entrar/Cadastrar vs. Olá, Nome / Sair) conforme a sessão.

document.addEventListener("DOMContentLoaded", () => {

    // BOTÕES
    const btnLogin = document.querySelector('[data-open-modal="login"]');
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

    function mostrarLogado(usuario) {
        if (navLoggedOut) navLoggedOut.hidden = true;
        if (navLoggedIn) navLoggedIn.hidden = false;
        if (navUserNome) navUserNome.textContent = usuario.nome;
    }

    function mostrarDeslogado() {
        if (navLoggedOut) navLoggedOut.hidden = false;
        if (navLoggedIn) navLoggedIn.hidden = true;
    }

    // ---------- Verifica sessão atual ----------
    async function verificarSessao() {
        try {
            const resp = await fetch("/api/auth/me", { credentials: "include" });
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

        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        try {
            const resp = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, senha }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                mostrarErro(loginErro, dados.erro || "Não foi possível entrar.");
                return;
            }

            fecharModais();
            formLogin.reset();
            location.reload();
        } catch {
            mostrarErro(loginErro, "Erro de conexão. Tente novamente.");
        }
    });

    // ---------- Cadastro ----------
    formCadastro?.addEventListener("submit", async (e) => {
        e.preventDefault();
        esconderErro(cadastroErro);

        const nome = document.getElementById("cadastroNome").value.trim();
        const email = document.getElementById("cadastroEmail").value.trim();
        const senha = document.getElementById("cadastroSenha").value;

        try {
            const resp = await fetch("/api/auth/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nome, email, senha }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                mostrarErro(cadastroErro, dados.erro || "Não foi possível criar a conta.");
                return;
            }

            fecharModais();
            formCadastro.reset();
            location.reload();
        } catch {
            mostrarErro(cadastroErro, "Erro de conexão. Tente novamente.");
        }
    });

    // ---------- Logout ----------
    btnLogout?.addEventListener("click", async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            mostrarDeslogado();
            location.reload();
        }
    });

    verificarSessao();
});
