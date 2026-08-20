// conta.js
// A área de cliente: mostra os dados de quem tem sessão iniciada e a
// lista dos seus horários marcados, com opção de cancelar.

document.addEventListener("DOMContentLoaded", () => {
    const contaNome = document.getElementById("contaNome");
    const contaEmail = document.getElementById("contaEmail");
    const contaAvatar = document.getElementById("contaAvatar");
    const listaAgendamentos = document.getElementById("listaMeusAgendamentos");
    const contaErro = document.getElementById("contaErro");

    if (!listaAgendamentos) return;

    const ROTULO_STATUS = {
        Pendente: "pendente",
        Confirmado: "confirmado",
        Cancelado: "cancelado",
        "Concluído": "concluído",
    };

    async function carregarConta() {
        try {
            const resp = await fetch("api/sessao.php");
            const dados = await resp.json();

            if (!dados.usuario) {
                location.href = "entrar.html";
                return;
            }

            contaNome.textContent = dados.usuario.nome;
            contaEmail.textContent = dados.usuario.email;
            contaAvatar.textContent = dados.usuario.nome.trim().charAt(0).toUpperCase();

            carregarMeusAgendamentos();
        } catch {
            location.href = "entrar.html";
        }
    }

    async function carregarMeusAgendamentos() {
        try {
            const resp = await fetch("api/meus-agendamentos.php");
            const agendamentos = await resp.json();

            if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
                listaAgendamentos.innerHTML = '<li class="agendamento-vazio">Ainda não tem horários marcados.</li>';
                return;
            }

            listaAgendamentos.innerHTML = agendamentos.map((a) => `
        <li class="agendamento-item" data-status="${a.status}">
          <div>
            <strong>${a.nome_servico}</strong>
            <span>${a.data} às ${a.hora}${a.barbeiro ? ' — ' + a.barbeiro : ''}</span>
            <span class="agendamento-status">${ROTULO_STATUS[a.status] || a.status}</span>
          </div>
          ${a.status === 'Pendente' || a.status === 'Confirmado'
                ? `<button type="button" class="nav-link-btn btn-cancelar" data-id="${a.id_agendamento}">Cancelar</button>`
                : ''}
        </li>
      `).join('');
        } catch {
            listaAgendamentos.innerHTML = '<li class="agendamento-vazio">Não foi possível carregar os seus horários.</li>';
        }
    }

    listaAgendamentos.addEventListener("click", async (e) => {
        const botao = e.target.closest(".btn-cancelar");
        if (!botao) return;

        if (!confirm("Cancelar este horário?")) return;

        botao.disabled = true;
        botao.textContent = "A cancelar...";

        try {
            const resp = await fetch("api/cancelar-agendamento.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_agendamento: botao.dataset.id }),
            });
            const dados = await resp.json();

            if (!resp.ok) {
                contaErro.textContent = dados.erro || "Não foi possível cancelar.";
                contaErro.hidden = false;
                botao.disabled = false;
                botao.textContent = "Cancelar";
                return;
            }

            contaErro.hidden = true;
            carregarMeusAgendamentos();
        } catch {
            contaErro.textContent = "Erro de ligação. Tente novamente.";
            contaErro.hidden = false;
            botao.disabled = false;
            botao.textContent = "Cancelar";
        }
    });

    carregarConta();
});
