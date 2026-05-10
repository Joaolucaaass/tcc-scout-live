// Guarda qual filtro de resultado está ativo no momento (todos, vitoria ou derrota)
let filtroAtivo = 'todos';


// FILTROS DE RESULTADO (chips: Todos, Vitória, Derrota)
// Quando o técnico clica num chip, marca ele como ativo e filtra a lista
const chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('chip--ativo'));
    chip.classList.add('chip--ativo');
    filtroAtivo = chip.dataset.filtro;
    filtrarJogos();
  });
});


// BUSCA POR ADVERSÁRIO
// Filtra os jogos enquanto o técnico digita o nome do adversário
document.getElementById('inputBusca').addEventListener('input', filtrarJogos);


// FILTRAR JOGOS
// Combina o filtro de resultado com o texto digitado na busca
function filtrarJogos() {
  const busca = document.getElementById('inputBusca').value.toLowerCase();
  const jogos  = document.querySelectorAll('.jogo-item');

  jogos.forEach(jogo => {
    const resultado   = jogo.dataset.resultado;
    const adversario  = jogo.querySelector('.jogo-adversario').textContent.toLowerCase();

    const passaFiltro = filtroAtivo === 'todos' || resultado === filtroAtivo;
    const passaBusca  = adversario.includes(busca);

    jogo.style.display = passaFiltro && passaBusca ? '' : 'none';
  });
}


// FILTRO DE ADVERSÁRIO (dropdown)
// Por enquanto abre e fecha visualmente.
// Quando o banco estiver pronto, carregar a lista real de adversários aqui.
document.getElementById('filtroAdversario').addEventListener('click', () => {

  // Quando o banco estiver pronto, buscar os adversários cadastrados e montar o dropdown aqui.
  // const adversarios = await fetch('/api/adversarios').then(r => r.json());
  // montarDropdownAdversarios(adversarios);

});


// Quando o banco estiver pronto, buscar os jogos salvos e montar a lista aqui.
// Por enquanto os jogos estão fixos no HTML para mostrar o design.
// async function carregarJogos() {
//   const jogos = await fetch('/api/jogos').then(r => r.json());
//   montarListaJogos(jogos);
// }
// carregarJogos();