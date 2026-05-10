// guarda a instância do cropper pra poder destruir quando fechar o modal
let cropperInstancia = null;

// quando o técnico escolhe uma foto, abre o modal de crop em vez de jogar direto no preview
document.getElementById('inputFoto').addEventListener('change', function (e) {
  const arquivo = e.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = function (ev) {
    abrirModalCrop(ev.target.result);
  };
  leitor.readAsDataURL(arquivo);
});

// abre o modal e inicializa o cropper na imagem escolhida
function abrirModalCrop(src) {
  const overlay = document.getElementById('modalCropOverlay');
  const imgCrop = document.getElementById('imagemCrop');

  imgCrop.src = src;
  overlay.classList.add('aberto');

  // espera o modal estar visível antes de inicializar o cropper
  // senão ele não consegue calcular as dimensões direito
  setTimeout(() => {
    if (cropperInstancia) {
      cropperInstancia.destroy();
      cropperInstancia = null;
    }

    cropperInstancia = new Cropper(imgCrop, {
      aspectRatio: 1,         // recorte sempre quadrado, igual ao preview
      viewMode: 1,            // não deixa o recorte sair da imagem
      dragMode: 'move',       // arrasta a foto, não a caixa de recorte
      autoCropArea: 0.85,     // começa com 85% da área já selecionada
      guides: false,          // sem linhas de grade pra não poluir a tela
      highlight: false,
      cropBoxMovable: false,  // a caixa fica fixa, só a foto se move
      cropBoxResizable: false,
    });
  }, 100);
}

// fecha o modal sem salvar nada
function fecharModalCrop() {
  const overlay = document.getElementById('modalCropOverlay');
  overlay.classList.remove('aberto');

  if (cropperInstancia) {
    cropperInstancia.destroy();
    cropperInstancia = null;
  }

  // limpa o input pra poder selecionar a mesma foto de novo se quiser
  document.getElementById('inputFoto').value = '';
}

// confirma o recorte, gera o canvas e joga no preview
function confirmarCrop() {
  if (!cropperInstancia) return;

  // gera a imagem final em 300x300 — tamanho ideal pra foto de perfil
  const canvas   = cropperInstancia.getCroppedCanvas({ width: 300, height: 300 });
  const fotoFinal = canvas.toDataURL('image/jpeg', 0.9);

  const img = document.getElementById('fotoImg');
  const svg = document.querySelector('#fotoPreview svg');

  img.src = fotoFinal;
  img.style.display = 'block';
  if (svg) svg.style.display = 'none';

  fecharModalCrop();
}


// MÁSCARAS
// formata o rg enquanto o técnico digita: 00.000.000-0
document.getElementById('campoRg').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 9);
  if (v.length > 8) v = v.slice(0,2) + '.' + v.slice(2,5) + '.' + v.slice(5,8) + '-' + v.slice(8);
  else if (v.length > 5) v = v.slice(0,2) + '.' + v.slice(2,5) + '.' + v.slice(5);
  else if (v.length > 2) v = v.slice(0,2) + '.' + v.slice(2);
  this.value = v;
});

// formata o cpf enquanto digita: 000.000.000-00
document.getElementById('campoCpf').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) v = v.slice(0,3) + '.' + v.slice(3,6) + '.' + v.slice(6,9) + '-' + v.slice(9);
  else if (v.length > 6) v = v.slice(0,3) + '.' + v.slice(3,6) + '.' + v.slice(6);
  else if (v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
  this.value = v;
});


// SALVAR
document.getElementById('btnSalvar').addEventListener('click', salvarAtleta);

function salvarAtleta() {
  const nome    = document.getElementById('campoNome').value.trim();
  const numero  = document.getElementById('campoNumero').value.trim();
  const posicao = document.getElementById('campoPosicao').value.trim();
  const rg      = document.getElementById('campoRg').value.trim();
  const idade   = document.getElementById('campoIdade').value.trim();
  const cpf     = document.getElementById('campoCpf').value.trim();
  const altura  = document.getElementById('campoAltura').value.trim();
  const peso    = document.getElementById('campoPeso').value.trim();
  const img     = document.getElementById('fotoImg');
  const temFoto = img.style.display !== 'none' && img.src !== '';

  // só o nome é obrigatório pra não travar o cadastro por falta de dado secundário
  if (!nome) {
    destacarCampoVazio('campoNome');
    return;
  }

  // monta o objeto que vai pro banco
  const payload = {
    nome,
    numero,
    posicao,
    rg,
    idade,
    cpf,
    altura,
    peso,
    foto: temFoto ? img.src : null,
  };

  // quando a api estiver pronta, mandar o payload pra rota de atletas aqui.
  // await fetch('/api/atletas', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });

  console.log('atleta pronto para salvar:', payload);

  mostrarAviso();
  limparForm();
}

// pisca a borda vermelha no campo que ficou vazio
function destacarCampoVazio(id) {
  const el = document.getElementById(id);
  el.style.borderColor = 'rgba(232, 39, 58, 0.7)';
  el.focus();
  setTimeout(() => el.style.borderColor = '', 2000);
}

// limpa tudo depois de salvar
function limparForm() {
  ['campoNome', 'campoNumero', 'campoPosicao', 'campoRg',
   'campoIdade', 'campoCpf', 'campoAltura', 'campoPeso']
    .forEach(id => document.getElementById(id).value = '');

  // volta o preview pro ícone de pessoa
  const img = document.getElementById('fotoImg');
  const svg = document.querySelector('#fotoPreview svg');
  img.src = '';
  img.style.display = 'none';
  if (svg) svg.style.display = '';
  document.getElementById('inputFoto').value = '';
}

// mostra o aviso de sucesso por 2.5 segundos e some
function mostrarAviso() {
  const aviso = document.getElementById('aviso');
  aviso.classList.add('visivel');
  setTimeout(() => aviso.classList.remove('visivel'), 2500);
}


// conecta os botões do modal depois que o dom carregou
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCropCancelar').addEventListener('click', fecharModalCrop);
  document.getElementById('btnCropConfirmar').addEventListener('click', confirmarCrop);

  // fecha se clicar no fundo escuro fora da caixa
  document.getElementById('modalCropOverlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModalCrop();
  });
});