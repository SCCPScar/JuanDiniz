// admin.js
// Login e painel administrativo. Um único ficheiro, que decide o que
// fazer consoante os elementos que existem na página (login ou painel).

function definirCarregando(botao, carregando) {
  botao.classList.toggle('btn-carregando', carregando);
  botao.disabled = carregando;
}

const ROTULO_STATUS = {
  Pendente: 'Pendente',
  Confirmado: 'Confirmado',
  Cancelado: 'Cancelado',
  'Concluído': 'Concluído',
};

// ---------- Página de login (admin/index.html) ----------
const formAdminLogin = document.getElementById('formAdminLogin');

if (formAdminLogin) {
  const erro = document.getElementById('adminLoginErro');

  // Se já tiver sessão de administrador iniciada, salta diretamente para o painel
  fetch('../api/admin/sessao.php')
    .then((r) => r.json())
    .then((dados) => {
      if (dados.admin) location.href = 'painel.html';
    })
    .catch(() => {});

  formAdminLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    erro.hidden = true;

    const email = document.getElementById('adminEmail').value.trim();
    const senha = document.getElementById('adminSenha').value;
    const botao = formAdminLogin.querySelector('.auth-submit');

    definirCarregando(botao, true);

    try {
      const resp = await fetch('../api/admin/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resp.json();

      if (!resp.ok) {
        erro.textContent = dados.erro || 'Não foi possível entrar.';
        erro.hidden = false;
        return;
      }

      location.href = 'painel.html';
    } catch {
      erro.textContent = 'Erro de ligação. Tente novamente.';
      erro.hidden = false;
    } finally {
      definirCarregando(botao, false);
    }
  });
}

// ---------- Painel (admin/painel.html) ----------
const corpoTabelaAgendamentos = document.getElementById('corpoTabelaAgendamentos');

if (corpoTabelaAgendamentos) {
  const adminNomeEl = document.getElementById('adminNome');
  const btnLogout = document.getElementById('btnAdminLogout');
  const btnAtualizar = document.getElementById('btnAtualizarAgendamentos');
  const agendamentosErro = document.getElementById('agendamentosErro');
  const corpoTabelaMensagens = document.getElementById('corpoTabelaMensagens');

  async function verificarAdmin() {
    try {
      const resp = await fetch('../api/admin/sessao.php');
      const dados = await resp.json();

      if (!dados.admin) {
        location.href = 'index.html';
        return;
      }

      adminNomeEl.textContent = dados.admin.nome;
      carregarAgendamentos();
      carregarMensagens();
    } catch {
      location.href = 'index.html';
    }
  }

  async function carregarAgendamentos() {
    agendamentosErro.hidden = true;

    try {
      const resp = await fetch('../api/admin/agendamentos.php');
      const agendamentos = await resp.json();

      if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
        corpoTabelaAgendamentos.innerHTML = '<tr><td colspan="6">Ainda não há agendamentos.</td></tr>';
        return;
      }

      corpoTabelaAgendamentos.innerHTML = agendamentos.map((a) => `
        <tr>
          <td>${a.nome_cliente}<br><span class="admin-sub">${a.email_cliente}</span></td>
          <td>${a.nome_servico}</td>
          <td>${a.barbeiro || '—'}</td>
          <td>${a.data}</td>
          <td>${a.hora}</td>
          <td>
            <select class="admin-status-select" data-id="${a.id_agendamento}">
              ${Object.keys(ROTULO_STATUS).map((s) =>
                `<option value="${s}" ${s === a.status ? 'selected' : ''}>${ROTULO_STATUS[s]}</option>`
              ).join('')}
            </select>
          </td>
        </tr>
      `).join('');
    } catch {
      agendamentosErro.textContent = 'Não foi possível carregar os agendamentos.';
      agendamentosErro.hidden = false;
    }
  }

  async function carregarMensagens() {
    try {
      const resp = await fetch('../api/admin/mensagens.php');
      const mensagens = await resp.json();

      if (!Array.isArray(mensagens) || mensagens.length === 0) {
        corpoTabelaMensagens.innerHTML = '<tr><td colspan="4">Nenhuma mensagem recebida ainda.</td></tr>';
        return;
      }

      corpoTabelaMensagens.innerHTML = mensagens.map((m) => `
        <tr>
          <td>${m.nome}</td>
          <td>${m.email}</td>
          <td>${m.mensagem}</td>
          <td>${m.enviado_em}</td>
        </tr>
      `).join('');
    } catch {
      corpoTabelaMensagens.innerHTML = '<tr><td colspan="4">Não foi possível carregar as mensagens.</td></tr>';
    }
  }

  corpoTabelaAgendamentos.addEventListener('change', async (e) => {
    const select = e.target.closest('.admin-status-select');
    if (!select) return;

    const idAgendamento = select.dataset.id;
    const status = select.value;

    select.disabled = true;

    try {
      const resp = await fetch('../api/admin/atualizar-status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_agendamento: idAgendamento, status }),
      });

      if (!resp.ok) {
        const dados = await resp.json();
        alert(dados.erro || 'Não foi possível atualizar o estado.');
      }
    } catch {
      alert('Erro de ligação. Tente novamente.');
    } finally {
      select.disabled = false;
    }
  });

  btnAtualizar?.addEventListener('click', () => {
    carregarAgendamentos();
    carregarMensagens();
  });

  btnLogout?.addEventListener('click', async () => {
    try {
      await fetch('../api/admin/logout.php', { method: 'POST' });
    } finally {
      location.href = 'index.html';
    }
  });

  verificarAdmin();
}
