// guarda qual atleta e qual set estão selecionados no momento
let atletaAtual = 'Atletas';
let setAtual    = 1;

// lista de todos os campos de acertos e erros que existem na tela
const campos = [
  'acerto_passeA',
  'acerto_passeB',
  'acerto_ataque',
  'acerto_saque',
  'acerto_bloqueio',
  'acerto_levantamento',
  'erro_passe',
  'erro_bloqueio',
  'erro_levantamento',
  'erro_ataque',
];

// os dados ficam guardados aqui enquanto não temos o banco.
// cada atleta tem seus próprios valores por set.
const dados = {};

// garante que a estrutura de dados existe antes de tentar ler ou escrever nela
function inicializarDados(atleta, set) {
  if (!dados[atleta]) dados[atleta] = {};
  if (!dados[atleta][set]) {
    dados[atleta][set] = {};
    campos.forEach(c => dados[atleta][set][c] = 0);
  }
}

// atualiza os números na tela com os valores do atleta e set selecionados
function carregarTela() {
  inicializarDados(atletaAtual, setAtual);
  campos.forEach(campo => {
    const el = document.getElementById(campo);
    if (el) el.textContent = dados[atletaAtual][setAtual][campo];
  });
}


// CONTADORES
// chamado pelos botões + e − de cada cartão.
// o delta é +1 ou -1 dependendo do botão clicado.
function change(campo, delta) {
  inicializarDados(atletaAtual, setAtual);
  const novo = dados[atletaAtual][setAtual][campo] + delta;
  if (novo < 0) return; // não deixa o contador passar de zero pra negativo
  dados[atletaAtual][setAtual][campo] = novo;
  document.getElementById(campo).textContent = novo;
}


// SELETOR DE ATLETA
// abre e fecha a lista de atletas
function toggleDropdown() {
  document.getElementById('listaAtletas').classList.toggle('aberto');
}

// quando o técnico escolhe um atleta, atualiza o estado e recarrega a tela
function selectAthlete(nome) {
  atletaAtual = nome;
  document.getElementById('atletaSelecionado').textContent = nome;
  document.getElementById('listaAtletas').classList.remove('aberto');
  carregarTela();

  // quando o banco estiver pronto, buscar a lista real de atletas aqui.
  // a ideia é chamar a api, pegar os atletas cadastrados e montar a lista dinamicamente.
  // const atletas = await fetch('/api/atletas').then(r => r.json());
  // popularListaAtletas(atletas);
}


// SELETOR DE SET
// abre e fecha a lista de sets
function toggleDropdownSet() {
  document.getElementById('listaSet').classList.toggle('aberto');
}

// quando o técnico troca de set, carrega os dados daquele set na tela
function selecionarSet(num) {
  setAtual = num;
  document.getElementById('setSelecionado').textContent = 'Set ' + num;
  document.getElementById('listaSet').classList.remove('aberto');
  carregarTela();
}


// MODAL DE CONFIRMAÇÃO
// ao invés de salvar direto, abre o formulário de confirmação primeiro
function saveScout() {
  abrirModal();
}

// abre o modal e já preenche a data de hoje como padrão
function abrirModal() {
  const overlay = document.getElementById('modalOverlay');

  // coloca a data de hoje no campo de data pra facilitar a vida do técnico
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('modalData').value = hoje;

  overlay.classList.add('aberto');
}

// fecha o modal e limpa os campos
function fecharModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('aberto');
  limparModal();
}

// limpa os campos do modal depois que salvar ou cancelar
function limparModal() {
  document.getElementById('modalAdversario').value = '';
  document.getElementById('modalPlacarNos').value  = '';
  document.getElementById('modalPlacarAdv').value  = '';
  document.getElementById('modalResultado').value  = '';
}

// valida e monta o payload final quando o técnico clica em "Salvar" no modal
function confirmarSalvar() {
  const data       = document.getElementById('modalData').value;
  const adversario = document.getElementById('modalAdversario').value.trim();
  const placarNos  = document.getElementById('modalPlacarNos').value;
  const placarAdv  = document.getElementById('modalPlacarAdv').value;
  const resultado  = document.getElementById('modalResultado').value;

  // checagem básica: todos os campos precisam estar preenchidos
  if (!data || !adversario || placarNos === '' || placarAdv === '' || !resultado) {
    destacarCamposVazios();
    return;
  }

  // monta o objeto completo que vai pro banco quando a api estiver pronta
  const payload = {
    data,
    adversario,
    placar: {
      nos: Number(placarNos),
      adv: Number(placarAdv),
    },
    resultado,
    scout: dados, // todos os dados coletados durante o jogo
  };

  // quando o banco estiver pronto, mandar o payload pra api aqui.
  // a rota vai receber tudo de uma vez: info do jogo + dados do scout.
  // await fetch('/api/jogos', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });

  console.log('scout pronto para salvar:', payload);

  fecharModal();
  mostrarAviso();
}

// pisca a borda vermelha nos campos que estão vazios
function destacarCamposVazios() {
  const campos = ['modalData', 'modalAdversario', 'modalPlacarNos', 'modalPlacarAdv', 'modalResultado'];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value || el.value.trim() === '') {
      el.style.borderColor = 'rgba(232, 39, 58, 0.7)';
      
      // volta pro normal depois de 2 segundos
      setTimeout(() => el.style.borderColor = '', 2000);
    }
  });
}


// AVISO DE SUCESSO
// mostra o aviso de sucesso por 2.5 segundos e depois some
function mostrarAviso() {
  const aviso = document.getElementById('aviso');
  aviso.classList.add('visivel');
  setTimeout(() => aviso.classList.remove('visivel'), 2500);
}


// fecha qualquer dropdown aberto quando o técnico clica fora dele
document.addEventListener('click', function(e) {
  if (!e.target.closest('#seletorAtleta') && !e.target.closest('#listaAtletas')) {
    document.getElementById('listaAtletas').classList.remove('aberto');
  }
  if (!e.target.closest('#seletorSetWrapper')) {
    document.getElementById('listaSet').classList.remove('aberto');
  }
});

// conecta os botões do modal depois que o dom carregou
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnModalCancelar').addEventListener('click', fecharModal);
  document.getElementById('btnModalConfirmar').addEventListener('click', confirmarSalvar);

  // fecha o modal se o técnico clicar no fundo escuro fora da caixa
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
  });
});


// inicia a tela com os valores zerados do atleta e set padrão
carregarTela();