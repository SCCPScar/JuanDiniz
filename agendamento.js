// agendamento.js
// Popula o formulário de agendamento e envia para a API

(() => {
  const blocoLogado = document.getElementById('agendamentoLogado');
  const blocoDeslogado = document.getElementById('agendamentoDeslogado');
  const form = document.getElementById('formAgendamento');
  const selectServico = document.getElementById('agendaServico');

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

  async function verificarLoginEExibirFormulario() {
    try {
      const resp = await fetch('api/sessao.php');
      const dados = await resp.json();

      if (dados.usuario) {
        blocoLogado.hidden = false;
        blocoDeslogado.hidden = true;
        carregarServicos();
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const corpo = {
        id_servico: document.getElementById('agendaServico').value,
        barbeiro: document.getElementById('agendaBarbeiro').value.trim(),
        data: document.getElementById('agendaData').value,
        hora: document.getElementById('agendaHora').value,
        observacoes: document.getElementById('agendaObs').value.trim(),
      };

      try {
        const resp = await fetch('api/agendar.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo),
        });
        const dados = await resp.json();

        if (!resp.ok) {
          mostrarErro(dados.erro || 'Não foi possível agendar.');
          return;
        }

        mostrarSucesso(dados.mensagem || 'Agendamento realizado com sucesso!');
        form.reset();
      } catch {
        mostrarErro('Erro de conexão. Tente novamente.');
      }
    });
  }

  verificarLoginEExibirFormulario();
})();