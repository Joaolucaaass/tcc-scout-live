// atletas.js — lógica do frontend da tela de atletas


// BUSCA DE ATLETAS
// Filtra os cards enquanto o técnico digita o nome
document.querySelector('.atletas-busca input').addEventListener('input', function () {
  const busca = this.value.toLowerCase();
  const cards = document.querySelectorAll('.atleta-card');

  cards.forEach(card => {
    const nome = card.querySelector('.atleta-nome').textContent.toLowerCase();
    card.style.display = nome.includes(busca) ? '' : 'none';
  });
});


// Quando o banco estiver pronto, buscar os atletas cadastrados e montar os cards aqui.
// Por enquanto os atletas estão fixos no HTML para mostrar o design.
// async function carregarAtletas() {
//   const atletas = await fetch('/api/atletas').then(r => r.json());
//   montarCards(atletas);
// }
// carregarAtletas();