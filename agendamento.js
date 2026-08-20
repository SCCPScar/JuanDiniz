// agendamento.js
// Popula o formulário de marcação e envia para a API.

(() => {
  const blocoLogado = document.getElementById('agendamentoLogado');
  const blocoDeslogado = document.getElementById('agendamentoDeslogado');
  const form = document.getElementById('formAgendamento');
  const selectServico = document.getElementById('agendaServico');
  const campoData = document.getElementById('agendaData');
  const campoHora = document.getElementById('agendaHora');

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

  // A data mínima que dá para escolher no calendário é hoje — evita que o
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
      selectServico.innerHTML = '<option value="">Erro ao carregar os serviços</option>';
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
          mostrarErro(dados.erro || 'Não foi possível confirmar a marcação.');
          if ((dados.erro || '').includes('futuras')) {
            campoData.classList.add('campo-erro');
            campoHora.classList.add('campo-erro');
          }
          return;
        }

        mostrarSucesso(dados.mensagem || 'Marcação confirmada com sucesso!');
        form.reset();
        definirDataMinima();
      } catch {
        mostrarErro('Erro de ligação. Tente novamente.');
      } finally {
        definirCarregando(botao, false);
      }
    });
  }

  verificarLoginEExibirFormulario();
})();
