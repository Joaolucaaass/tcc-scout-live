// guarda a instância do cropper pra poder destruir quando fechar
let cropperInstancia = null;


// FOTO DE PERFIL
// o botão de editar foto aciona o input de arquivo escondido
document.getElementById('btnEditarFoto').addEventListener('click', () => {
  document.getElementById('inputFotoPerfil').click();
});

// quando o técnico escolhe uma foto, abre o modal de crop
document.getElementById('inputFotoPerfil').addEventListener('change', function (e) {
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
      aspectRatio: 1,         // recorte quadrado — fica bem no círculo do perfil
      viewMode: 1,            // não deixa o recorte sair da imagem
      dragMode: 'move',       // arrasta a foto, não a caixa de recorte
      autoCropArea: 0.85,     // começa com 85% selecionado
      guides: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
    });
  }, 100);
}

// fecha o modal de crop sem salvar nada
function fecharModalCrop() {
  document.getElementById('modalCropOverlay').classList.remove('aberto');

  if (cropperInstancia) {
    cropperInstancia.destroy();
    cropperInstancia = null;
  }

  document.getElementById('inputFotoPerfil').value = '';
}

// confirma o recorte e aplica no círculo do perfil
function confirmarCrop() {
  if (!cropperInstancia) return;

  const canvas    = cropperInstancia.getCroppedCanvas({ width: 300, height: 300 });
  const fotoFinal = canvas.toDataURL('image/jpeg', 0.9);

  const img         = document.getElementById('fotoPerfilImg');
  const placeholder = document.getElementById('fotoPlaceholder');

  img.src                   = fotoFinal;
  img.style.display         = 'block';
  placeholder.style.display = 'none';

  // quando a api estiver pronta, enviar a foto atualizada aqui.
  // const formData = new FormData();
  // formData.append('foto', dataURLtoBlob(fotoFinal));
  // await fetch('/api/perfil/foto', { method: 'POST', body: formData });

  fecharModalCrop();
}


// MODAL DE EDITAR INFORMAÇÕES
// abre o modal e preenche os campos com os dados atuais da tela
function abrirModalEditar() {
  const overlay = document.getElementById('modalEditarOverlay');

  document.getElementById('editNome').value  = document.getElementById('perfilNome').textContent;
  document.getElementById('editEmail').value = document.getElementById('valorEmail').textContent;
  document.getElementById('editSenha').value = '';
  document.getElementById('editCpf').value   = '';

  // garante que o campo volta pro modo oculto e o ícone volta pro olho aberto ao abrir o modal
  document.getElementById('editSenha').type      = 'password';
  document.getElementById('iconeOlho').src        = '../src/assets/IMG/olho.png';

  // quando o banco estiver pronto, preencher o cpf real aqui
  // document.getElementById('editCpf').value = cpfReal;

  overlay.classList.add('aberto');
}

// fecha o modal de edição
function fecharModalEditar() {
  document.getElementById('modalEditarOverlay').classList.remove('aberto');
}

// salva as alterações e atualiza a tela
function confirmarEditar() {
  const nome  = document.getElementById('editNome').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const cpf   = document.getElementById('editCpf').value.trim();
  const senha = document.getElementById('editSenha').value;

  // nome e email são obrigatórios
  if (!nome)  { destacarVazio('editNome');  return; }
  if (!email) { destacarVazio('editEmail'); return; }

  const payload = {
    nome,
    email,
    cpf:   cpf   || undefined,
    senha: senha || undefined, // só envia se o técnico digitou algo
  };

  // quando a api estiver pronta, enviar as alterações aqui.
  // await fetch('/api/perfil', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });

  console.log('perfil pronto para atualizar:', payload);

  // atualiza a tela com os novos dados
  document.getElementById('perfilNome').textContent = nome;
  document.getElementById('valorEmail').textContent = email;
  if (cpf) document.getElementById('valorCpf').textContent = cpf;

  fecharModalEditar();
}

// pisca vermelho no campo vazio
function destacarVazio(id) {
  const el = document.getElementById(id);
  el.style.borderColor = 'rgba(232, 39, 58, 0.7)';
  el.focus();
  setTimeout(() => el.style.borderColor = '', 2000);
}


// VER SENHA
// alterna entre mostrar e esconder a senha, trocando o ícone junto
function toggleVerSenha() {
  const input = document.getElementById('editSenha');
  const icone = document.getElementById('iconeOlho');
  const senhaVisivel = input.type === 'text';

  // se tava visível, esconde — se tava oculta, mostra
  input.type = senhaVisivel ? 'password' : 'text';

  // troca o ícone: olho aberto = senha oculta, olho fechado = senha visível
  icone.src = senhaVisivel
    ? '../src/assets/IMG/olho.png'
    : '../src/assets/IMG/olho-fechado.png';
}


// SAIR DA CONTA
// quando o banco estiver pronto, limpar o token e redirecionar pro login aqui.
// localStorage.removeItem('token');
// window.location.href = '../pages/login.html';
document.getElementById('btnSair').addEventListener('click', () => {
  console.log('sair da conta acionado');
});


// conecta tudo depois que o dom carregou
document.addEventListener('DOMContentLoaded', () => {

  // cpf: formata enquanto o técnico digita no modal: 000.000.000-00
  document.getElementById('editCpf').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.slice(0,3) + '.' + v.slice(3,6) + '.' + v.slice(6,9) + '-' + v.slice(9);
    else if (v.length > 6) v = v.slice(0,3) + '.' + v.slice(3,6) + '.' + v.slice(6);
    else if (v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
    this.value = v;
  });

  // botão de ver/esconder senha
  document.getElementById('btnVerSenha').addEventListener('click', toggleVerSenha);

  // botões do modal de editar
  document.getElementById('btnEditar').addEventListener('click', abrirModalEditar);
  document.getElementById('btnEditarCancelar').addEventListener('click', fecharModalEditar);
  document.getElementById('btnEditarConfirmar').addEventListener('click', confirmarEditar);

  // fecha modal de editar clicando no fundo
  document.getElementById('modalEditarOverlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModalEditar();
  });

  // botões do modal de crop
  document.getElementById('btnCropCancelar').addEventListener('click', fecharModalCrop);
  document.getElementById('btnCropConfirmar').addEventListener('click', confirmarCrop);

  // fecha modal de crop clicando no fundo
  document.getElementById('modalCropOverlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModalCrop();
  });

  // quando o banco estiver pronto, carregar os dados reais do técnico aqui.
  // const perfil = await fetch('/api/perfil').then(r => r.json());
  // document.getElementById('perfilNome').textContent      = perfil.nome;
  // document.getElementById('valorEmail').textContent      = perfil.email;
  // document.getElementById('valorCpf').textContent        = perfil.cpf;
  // if (perfil.foto) {
  //   document.getElementById('fotoPerfilImg').src              = perfil.foto;
  //   document.getElementById('fotoPerfilImg').style.display    = 'block';
  //   document.getElementById('fotoPlaceholder').style.display  = 'none';
  // }
});