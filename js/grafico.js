//  graficos.js — configuração do gráfico, os dados fixos abaixo serão substituídos

const dadosGrafico = {
  labels: ['Set 1', 'Set 2', 'Set 3', 'Set 4'],

  acertos: [18, 22, 15, 24],
  erros:   [4,  3,  6,  2],
};

const ctx = document.getElementById('graficoSets').getContext('2d');

const graficoSets = new Chart(ctx, {
  type: 'line',

  data: {
    labels: dadosGrafico.labels,
    datasets: [
      {
        label: 'Acertos',
        data: dadosGrafico.acertos,
        borderColor: '#2d7fff',
        backgroundColor: 'rgba(45,127,255,0.12)',
        borderWidth: 2.5,
        pointBackgroundColor: '#2d7fff',
        pointBorderColor: '#050d1f',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Erros',
        data: dadosGrafico.erros,
        borderColor: '#e8273a',
        backgroundColor: 'rgba(232,39,58,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#e8273a',
        pointBorderColor: '#050d1f',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: 'rgba(255,255,255,0.6)',
          font: { family: 'Nexa, Arial, sans-serif', size: 11, weight: '700' },
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0e1e36',
        borderColor: 'rgba(45,127,255,0.3)',
        borderWidth: 1,
        titleColor: 'rgba(255,255,255,0.6)',
        bodyColor: '#fff',
        titleFont: { family: 'Nexa, Arial, sans-serif', size: 10, weight: '700' },
        bodyFont:  { family: 'Nexa, Arial, sans-serif', size: 13, weight: '700' },
        padding: 10,
        cornerRadius: 10,
      },
    },

    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255,255,255,0.4)',
          font: { family: 'Nexa, Arial, sans-serif', size: 11, weight: '700' },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255,255,255,0.4)',
          font: { family: 'Nexa, Arial, sans-serif', size: 11, weight: '700' },
          stepSize: 5,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  },
});