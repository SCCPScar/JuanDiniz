// auth-frontend.js
// Comum a todas as páginas: verifica se há sessão iniciada e atualiza o
// menu (Entrar/Registar vs. Olá, Nome/Terminar sessão), e trata o logout.

document.addEventListener("DOMContentLoaded", () => {

    const btnLogout = document.getElementById("btnLogout");

    const navLoggedOut = document.getElementById("navAuthLoggedOut");
    const navLoggedIn = document.getElementById("navAuthLoggedIn");
    const navUserNome = document.getElementById("navUserNome");
    const navUserAvatar = document.getElementById("navUserAvatar");

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

    btnLogout?.addEventListener("click", async () => {
        try {
            await fetch("api/logout.php", { method: "POST" });
        } finally {
            location.href = "index.html";
        }
    });

    verificarSessao();
});
