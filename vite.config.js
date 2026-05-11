import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:            resolve(__dirname, 'index.html'),
        login:           resolve(__dirname, 'pages/login.html'),
        scoutLive:       resolve(__dirname, 'pages/scoutlive.html'),
        jogos:           resolve(__dirname, 'pages/jogos.html'),
        atletas:         resolve(__dirname, 'pages/atletas.html'),
        perfil:          resolve(__dirname, 'pages/perfil.html'),
        adicionarAtleta: resolve(__dirname, 'pages/adicionar-atletas.html'),
        atletaDetalhes:  resolve(__dirname, 'pages/atleta-detalhes.html'),
        detalheJogo:     resolve(__dirname, 'pages/detalhe-jogo.html'),
      }
    }
  }
})