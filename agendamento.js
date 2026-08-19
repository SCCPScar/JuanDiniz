// agendamento.js
// Popula o formulário de agendamento, envia para a API e lista/cancela os
// agendamentos do usuário logado.

(() => {
  const blocoLogado = document.getElementById('agendamentoLogado');
  const blocoDeslogado = document.getElementById('agendamentoDeslogado');
  const form = document.getElementById('formAgendamento');
  const selectServico = document.getElementById('agendaServico');
  const campoData = document.getElementById('agendaData');
  const campoHora = document.getElementById('agendaHora');
  const listaAgendamentos = document.getElementById('listaMeusAgendamentos');

  const ROTULO_STATUS = {
    Pendente: 'pendente',
    Confirmado: 'confirmado',
    Cancelado: 'cancelado',
    'Concluído': 'concluído',
  };

  function mostrarErro(mensagem) {
    const el = document.getElementById('agendaErro');
    document.getElementById('agendaSucesso').hidden = true;
    el.textContent = mensagem;
    el.hidden = false;
  }

  function mostrarSucesso(mensagem) {
    const el = document.getElementById('agendaSucesso');
    document.getElementById('agendaErro').hidden = true;
    el.textContent = mensagem;
    el.hidden = false;
  }

  function definirCarregando(botao, carregando) {
    botao.classList.toggle('btn-carregando', carregando);
    botao.disabled = carregando;
  }

  // A data mínima que dá pra escolher no calendário é hoje — evita que o
  // cliente tente marcar um horário que já passou.
  function definirDataMinima() {
    if (!campoData) return;
    const hoje = new Date();
    const aaaa = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');
    campoData.min = `${aaaa}-${mm}-${dd}`;
  }

  async function carregarServicos() {
    try {
      const resp = await fetch('api/servicos.php');
      const servicos = await resp.json();

      selectServico.innerHTML = servicos.map(s =>
        `<option value="${s.id_servico}">${s.nome} — € ${s.preco}</option>`
      ).join('');
    } catch {
      selectServico.innerHTML = '<option value="">Erro ao carregar serviços</option>';
    }
  }

  async function carregarMeusAgendamentos() {
    if (!listaAgendamentos) return;

    try {
      const resp = await fetch('api/meus-agendamentos.php');
      const agendamentos = await resp.json();

      if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
        listaAgendamentos.innerHTML = '<li class="agendamento-vazio">Você ainda não tem agendamentos.</li>';
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
      listaAgendamentos.innerHTML = '<li class="agendamento-vazio">Não foi possível carregar seus agendamentos.</li>';
    }
  }

  listaAgendamentos?.addEventListener('click', async (e) => {
    const botao = e.target.closest('.btn-cancelar');
    if (!botao) return;

    if (!confirm('Cancelar este agendamento?')) return;

    botao.disabled = true;
    botao.textContent = 'Cancelando...';

    try {
      const resp = await fetch('api/cancelar-agendamento.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_agendamento: botao.dataset.id }),
      });
      const dados = await resp.json();

      if (!resp.ok) {
        alert(dados.erro || 'Não foi possível cancelar.');
        botao.disabled = false;
        botao.textContent = 'Cancelar';
        return;
      }

      carregarMeusAgendamentos();
    } catch {
      alert('Erro de conexão. Tente novamente.');
      botao.disabled = false;
      botao.textContent = 'Cancelar';
    }
  });

  async function verificarLoginEExibirFormulario() {
    try {
      const resp = await fetch('api/sessao.php');
      const dados = await resp.json();

      if (dados.usuario) {
        blocoLogado.hidden = false;
        blocoDeslogado.hidden = true;
        carregarServicos();
        carregarMeusAgendamentos();
      } else {
        blocoLogado.hidden = true;
        blocoDeslogado.hidden = false;
      }
    } catch {
      blocoLogado.hidden = true;
      blocoDeslogado.hidden = false;
    }
  }

  if (form) {
    definirDataMinima();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const corpo = {
        id_servico: document.getElementById('agendaServico').value,
        barbeiro: document.getElementById('agendaBarbeiro').value.trim(),
        data: campoData.value,
        hora: campoHora.value,
        observacoes: document.getElementById('agendaObs').value.trim(),
      };

      const botao = form.querySelector('.auth-submit');
      campoData.classList.remove('campo-erro');
      campoHora.classList.remove('campo-erro');
      definirCarregando(botao, true);

      try {
        const resp = await fetch('api/agendar.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo),
        });
        const dados = await resp.json();

        if (!resp.ok) {
          mostrarErro(dados.erro || 'Não foi possível agendar.');
          if ((dados.erro || '').includes('futuras')) {
            campoData.classList.add('campo-erro');
            campoHora.classList.add('campo-erro');
          }
          return;
        }

        mostrarSucesso(dados.mensagem || 'Agendamento realizado com sucesso!');
        form.reset();
        definirDataMinima();
        carregarMeusAgendamentos();
      } catch {
        mostrarErro('Erro de conexão. Tente novamente.');
      } finally {
        definirCarregando(botao, false);
      }
    });
  }

  verificarLoginEExibirFormulario();
})();
