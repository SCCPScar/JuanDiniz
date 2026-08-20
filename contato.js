// contato.js
// Envia o formulário de contacto para a API.

(() => {
  const form = document.getElementById('formContato');
  if (!form) return;

  const erro = document.getElementById('contatoErro');
  const sucesso = document.getElementById('contatoSucesso');
  const botao = form.querySelector('.auth-submit');

  function mostrarErro(mensagem) {
    sucesso.hidden = true;
    erro.textContent = mensagem;
    erro.hidden = false;
  }

  function mostrarSucesso(mensagem) {
    erro.hidden = true;
    sucesso.textContent = mensagem;
    sucesso.hidden = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const corpo = {
      nome: document.getElementById('contatoNome').value.trim(),
      email: document.getElementById('contatoEmail').value.trim(),
      mensagem: document.getElementById('contatoMensagem').value.trim(),
    };

    botao.classList.add('btn-carregando');
    botao.disabled = true;

    try {
      const resp = await fetch('api/contato.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      });
      const dados = await resp.json();

      if (!resp.ok) {
        mostrarErro(dados.erro || 'Não foi possível enviar a mensagem.');
        return;
      }

      mostrarSucesso(dados.mensagem || 'Mensagem enviada!');
      form.reset();
    } catch {
      mostrarErro('Erro de ligação. Tente novamente.');
    } finally {
      botao.classList.remove('btn-carregando');
      botao.disabled = false;
    }
  });
})();
