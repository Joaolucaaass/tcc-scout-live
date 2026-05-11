// pega o id do jogo que veio na url: detalhe-jogo.html?id=123
const params  = new URLSearchParams(window.location.search);
const jogoId  = params.get('id');


// DADOS MOCKADOS
// esses dados simulam o que a api vai retornar quando o back estiver pronto.
// a estrutura já está no formato certo pra substituir pelo fetch sem precisar
// mudar mais nada no resto do código.
const jogoMock = {
  id:         1,
  adversario: 'Vôlei Vinhedo',
  data:       '10/10/2025',
  placar:     { nos: 3, adv: 1 },
  resultado:  'vitoria',
  scout: {
    'Atleta 1': {
      1: { acerto_passeA: 4, acerto_passeB: 2, acerto_ataque: 3, acerto_saque: 2, acerto_bloqueio: 1, acerto_levantamento: 2, erro_passe: 1, erro_bloqueio: 0, erro_levantamento: 1, erro_ataque: 1 },
      2: { acerto_passeA: 5, acerto_passeB: 3, acerto_ataque: 4, acerto_saque: 3, acerto_bloqueio: 2, acerto_levantamento: 3, erro_passe: 0, erro_bloqueio: 1, erro_levantamento: 0, erro_ataque: 1 },
      3: { acerto_passeA: 3, acerto_passeB: 2, acerto_ataque: 2, acerto_saque: 1, acerto_bloqueio: 1, acerto_levantamento: 1, erro_passe: 2, erro_bloqueio: 1, erro_levantamento: 1, erro_ataque: 2 },
    },
    'Atleta 2': {
      1: { acerto_passeA: 6, acerto_passeB: 4, acerto_ataque: 5, acerto_saque: 3, acerto_bloqueio: 2, acerto_levantamento: 4, erro_passe: 0, erro_bloqueio: 0, erro_levantamento: 1, erro_ataque: 0 },
      2: { acerto_passeA: 7, acerto_passeB: 3, acerto_ataque: 6, acerto_saque: 4, acerto_bloqueio: 3, acerto_levantamento: 5, erro_passe: 1, erro_bloqueio: 0, erro_levantamento: 0, erro_ataque: 1 },
      3: { acerto_passeA: 5, acerto_passeB: 2, acerto_ataque: 4, acerto_saque: 2, acerto_bloqueio: 1, acerto_levantamento: 3, erro_passe: 1, erro_bloqueio: 1, erro_levantamento: 0, erro_ataque: 0 },
    },
    'Atleta 3': {
      1: { acerto_passeA: 3, acerto_passeB: 1, acerto_ataque: 2, acerto_saque: 1, acerto_bloqueio: 0, acerto_levantamento: 2, erro_passe: 2, erro_bloqueio: 1, erro_levantamento: 2, erro_ataque: 2 },
      2: { acerto_passeA: 2, acerto_passeB: 2, acerto_ataque: 1, acerto_saque: 2, acerto_bloqueio: 1, acerto_levantamento: 1, erro_passe: 3, erro_bloqueio: 2, erro_levantamento: 1, erro_ataque: 3 },
      3: { acerto_passeA: 4, acerto_passeB: 1, acerto_ataque: 3, acerto_saque: 1, acerto_bloqueio: 0, acerto_levantamento: 2, erro_passe: 1, erro_bloqueio: 1, erro_levantamento: 1, erro_ataque: 1 },
    },
  },
};


// CARREGAR DADOS DO JOGO
// quando o banco estiver pronto, trocar o jogoMock pelo fetch aqui.
// const jogo = await fetch(`/api/jogos/${jogoId}`).then(r => r.json());
async function carregarJogo() {
  const jogo = jogoMock; // <- troca por fetch quando a api estiver pronta

  popularCabecalho(jogo);
  montarGrafico(jogo.scout);
  montarAtletaDestaque(jogo.scout);
}


// CABEÇALHO
// preenche adversário, data, placar e resultado com os dados do jogo
function popularCabecalho(jogo) {
  document.querySelector('.jogo-adversario').textContent = jogo.adversario;
  document.querySelector('.jogo-data').textContent       = jogo.data;
  document.querySelector('.jogo-placar').innerHTML =
    `${jogo.placar.nos} <span class="x">×</span> ${jogo.placar.adv}`;

  const badge = document.querySelector('.jogo-resultado');
  if (jogo.resultado === 'vitoria') {
    badge.textContent  = 'Vitória';
    badge.className    = 'jogo-resultado jogo-resultado--vitoria';
  } else {
    badge.textContent  = 'Derrota';
    badge.className    = 'jogo-resultado jogo-resultado--derrota';
  }
}


// GRÁFICO
// soma acertos e erros de todos os atletas por set e monta o gráfico de barras
function montarGrafico(scout) {
  const sets = {};

  // passa por cada atleta e cada set somando tudo
  Object.values(scout).forEach(atletaDados => {
    Object.entries(atletaDados).forEach(([set, valores]) => {
      if (!sets[set]) sets[set] = { acertos: 0, erros: 0 };

      const acertos = Object.entries(valores)
        .filter(([k]) => k.startsWith('acerto_'))
        .reduce((soma, [, v]) => soma + v, 0);

      const erros = Object.entries(valores)
        .filter(([k]) => k.startsWith('erro_'))
        .reduce((soma, [, v]) => soma + v, 0);

      sets[set].acertos += acertos;
      sets[set].erros   += erros;
    });
  });

  const labels  = Object.keys(sets).map(s => `Set ${s}`);
  const acertos = Object.values(sets).map(s => s.acertos);
  const erros   = Object.values(sets).map(s => s.erros);

  const ctx = document.getElementById('graficoSets').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Acertos',
          data: acertos,
          backgroundColor: 'rgba(45, 127, 255, 0.7)',
          borderColor: 'rgba(45, 127, 255, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Erros',
          data: erros,
          backgroundColor: 'rgba(232, 39, 58, 0.6)',
          borderColor: 'rgba(232, 39, 58, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255,255,255,0.6)',
            font: { family: 'Nexa, Arial, sans-serif', size: 11 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
          grid:  { color: 'rgba(255,255,255,0.05)' },
        },
        y: {
          beginAtZero: true,
          ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
          grid:  { color: 'rgba(255,255,255,0.05)' },
        },
      },
    },
  });
}


// ATLETA DESTAQUE
// calcula quem teve o maior aproveitamento (acertos / acertos + erros) no jogo todo
function montarAtletaDestaque(scout) {
  let melhorAtleta = null;
  let melhorAproveitamento = -1;

  Object.entries(scout).forEach(([nome, atletaDados]) => {
    let totalAcertos = 0;
    let totalErros   = 0;

    Object.values(atletaDados).forEach(valores => {
      Object.entries(valores).forEach(([k, v]) => {
        if (k.startsWith('acerto_')) totalAcertos += v;
        if (k.startsWith('erro_'))   totalErros   += v;
      });
    });

    const aproveitamento = totalAcertos + totalErros > 0
      ? Math.round((totalAcertos / (totalAcertos + totalErros)) * 100)
      : 0;

    if (aproveitamento > melhorAproveitamento) {
      melhorAproveitamento = aproveitamento;
      melhorAtleta = { nome, totalAcertos, totalErros, aproveitamento };
    }
  });

  if (!melhorAtleta) return;

  // atualiza o card de destaque com os dados calculados
  document.querySelector('.destaque-nome').textContent = melhorAtleta.nome;

  document.querySelectorAll('.destaque-stat-valor')[0].textContent = melhorAtleta.totalAcertos;
  document.querySelectorAll('.destaque-stat-valor')[1].textContent = melhorAtleta.totalErros;
  document.querySelectorAll('.destaque-stat-valor')[2].textContent = melhorAtleta.aproveitamento + '%';

  // quando o banco estiver pronto, buscar a foto e a posição do atleta aqui.
  // const atleta = await fetch(`/api/atletas?nome=${melhorAtleta.nome}`).then(r => r.json());
  // document.querySelector('.destaque-posicao').textContent = atleta.posicao;
  // if (atleta.foto) {
  //   const fotoEl = document.querySelector('.destaque-foto');
  //   fotoEl.innerHTML = `<img src="${atleta.foto}" alt="${atleta.nome}">`;
  // }
}


// EXCLUIR JOGO
// quando o banco estiver pronto, chamar a api e redirecionar pra lista de jogos aqui.
// await fetch(`/api/jogos/${jogoId}`, { method: 'DELETE' });
// window.location.href = 'jogos.html';
document.getElementById('btnExcluir').addEventListener('click', () => {
  const confirmar = window.confirm('Tem certeza que deseja excluir este jogo?');
  if (!confirmar) return;

  console.log('jogo excluído:', jogoId);
  // window.location.href = 'jogos.html';
});


// inicia tudo
carregarJogo();