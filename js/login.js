// ── ALTERNÂNCIA DE ABAS ──────────────────────
function trocarAba(aba) {
  const blocoEntrar   = document.getElementById('blocoEntrar');
  const blocoCadastro = document.getElementById('blocoCadastro');
  const abaEntrar     = document.getElementById('abaEntrar');
  const abaCadastro   = document.getElementById('abaCadastro');

  limparErros();

  if (aba === 'entrar') {
    blocoEntrar.classList.remove('oculto');
    blocoCadastro.classList.add('oculto');
    abaEntrar.classList.add('aba--ativa');
    abaCadastro.classList.remove('aba--ativa');
  } else {
    blocoCadastro.classList.remove('oculto');
    blocoEntrar.classList.add('oculto');
    abaCadastro.classList.add('aba--ativa');
    abaEntrar.classList.remove('aba--ativa');
  }
}

// ── MOSTRAR / OCULTAR SENHA ──────────────────
function toggleSenha(inputId, btn) {
  const input = document.getElementById(inputId);
  const visivel = input.type === 'text';

  input.type = visivel ? 'password' : 'text';

  // Troca o ícone: olho aberto ↔ olho com traço
  btn.innerHTML = visivel
    ? /* olho aberto */`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`
    : /* olho fechado */`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
}

// ── MÁSCARA DE CPF ───────────────────────────
function mascaraCpf(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

// ── VALIDAÇÕES ───────────────────────────────
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validarCpf(cpf) {
  const nums = cpf.replace(/\D/g, '');
  if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
  let r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(nums[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
  r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(nums[10]);
}

function mostrarErro(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function limparErros() {
  mostrarErro('erroLogin', '');
  mostrarErro('erroCadastro', '');
  document.querySelectorAll('.campo-input').forEach(i => i.classList.remove('campo-input--erro'));
}

function marcarCampoErro(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.classList.add('campo-input--erro');
}

// ── HABILITAR / DESABILITAR BOTÃO ────────────
function atualizarBotaoLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const btn   = document.querySelector('#blocoEntrar .botao-enviar');
  if (!btn) return;

  const valido = validarEmail(email) && senha.length >= 6;
  btn.disabled = !valido;
  btn.style.opacity  = valido ? '1' : '0.5';
  btn.style.cursor   = valido ? 'pointer' : 'not-allowed';
}

function atualizarBotaoCadastro() {
  const nome  = document.getElementById('cadastroNome').value.trim();
  const cpf   = document.getElementById('cadastroCpf').value;
  const email = document.getElementById('cadastroEmail').value.trim();
  const senha = document.getElementById('cadastroSenha').value;
  const btn   = document.querySelector('#blocoCadastro .botao-enviar');
  if (!btn) return;

  const valido = nome.length >= 3 && validarCpf(cpf) && validarEmail(email) && senha.length >= 6;
  btn.disabled = !valido;
  btn.style.opacity  = valido ? '1' : '0.5';
  btn.style.cursor   = valido ? 'pointer' : 'not-allowed';
}

// ── LOGIN ────────────────────────────────────
async function fazerLogin() {
  limparErros();

  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  let ok = true;

  if (!validarEmail(email)) {
    marcarCampoErro('loginEmail');
    mostrarErro('erroLogin', 'Digite um e-mail válido.');
    ok = false;
  }

  if (senha.length < 6) {
    marcarCampoErro('loginSenha');
    if (ok) mostrarErro('erroLogin', 'A senha deve ter pelo menos 6 caracteres.');
    ok = false;
  }

  if (!ok) return;

  const btn = document.querySelector('#blocoEntrar .botao-enviar');
  btn.textContent = 'Entrando…';
  btn.disabled = true;

  try {
    /* ── INTEGRAÇÃO COM BANCO DE DADOS ──────────────
       Substitua a URL abaixo pelo seu endpoint real.
       Exemplo com Firebase Auth, Supabase ou API própria.

       const resposta = await fetch('https://sua-api.com/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, senha })
       });

       const dados = await resposta.json();

       if (!resposta.ok) throw new Error(dados.mensagem || 'Credenciais inválidas.');

       // Salva o token de sessão
       localStorage.setItem('scout_token', dados.token);
       localStorage.setItem('scout_usuario', JSON.stringify(dados.usuario));

       window.location.href = '../index.html';
    ─────────────────────────────────────────────── */

    // ── SIMULAÇÃO (remova quando integrar o banco) ──
    await new Promise(r => setTimeout(r, 800));
    if (email === 'teste@scout.com' && senha === '123456') {
      localStorage.setItem('scout_usuario', JSON.stringify({ nome: 'Usuário Teste', email }));
      window.location.href = '../index.html';
    } else {
      throw new Error('E-mail ou senha incorretos.');
    }
    // ────────────────────────────────────────────────

  } catch (err) {
    mostrarErro('erroLogin', err.message);
    btn.textContent = 'ENTRAR';
    btn.disabled = false;
    atualizarBotaoLogin();
  }
}

// ── CADASTRO ─────────────────────────────────
async function fazerCadastro() {
  limparErros();

  const nome  = document.getElementById('cadastroNome').value.trim();
  const cpf   = document.getElementById('cadastroCpf').value;
  const email = document.getElementById('cadastroEmail').value.trim();
  const senha = document.getElementById('cadastroSenha').value;
  let ok = true;

  if (nome.length < 3) {
    marcarCampoErro('cadastroNome');
    mostrarErro('erroCadastro', 'Digite seu nome completo.');
    ok = false;
  }

  if (!validarCpf(cpf)) {
    marcarCampoErro('cadastroCpf');
    if (ok) mostrarErro('erroCadastro', 'CPF inválido.');
    ok = false;
  }

  if (!validarEmail(email)) {
    marcarCampoErro('cadastroEmail');
    if (ok) mostrarErro('erroCadastro', 'Digite um e-mail válido.');
    ok = false;
  }

  if (senha.length < 6) {
    marcarCampoErro('cadastroSenha');
    if (ok) mostrarErro('erroCadastro', 'A senha deve ter pelo menos 6 caracteres.');
    ok = false;
  }

  if (!ok) return;

  const btn = document.querySelector('#blocoCadastro .botao-enviar');
  btn.textContent = 'Criando conta…';
  btn.disabled = true;

  try {
    /* ── INTEGRAÇÃO COM BANCO DE DADOS ──────────────
       Substitua a URL abaixo pelo seu endpoint real.

       const resposta = await fetch('https://sua-api.com/auth/cadastro', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ nome, cpf, email, senha })
       });

       const dados = await resposta.json();

       if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao criar conta.');

       localStorage.setItem('scout_token', dados.token);
       localStorage.setItem('scout_usuario', JSON.stringify(dados.usuario));

       window.location.href = '../index.html';
    ─────────────────────────────────────────────── */

    // ── SIMULAÇÃO (remova quando integrar o banco) ──
    await new Promise(r => setTimeout(r, 800));
    mostrarErro('erroCadastro', '');
    alert(`Conta criada com sucesso! Bem-vindo(a), ${nome.split(' ')[0]}!`);
    trocarAba('entrar');
    // ────────────────────────────────────────────────

  } catch (err) {
    mostrarErro('erroCadastro', err.message);
    btn.textContent = 'CRIAR CONTA';
    btn.disabled = false;
    atualizarBotaoCadastro();
  }
}

// ── INICIALIZAÇÃO ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Estado inicial dos botões (desabilitados)
  atualizarBotaoLogin();
  atualizarBotaoCadastro();

  // Listeners de input para habilitar botões em tempo real
  document.getElementById('loginEmail') ?.addEventListener('input', atualizarBotaoLogin);
  document.getElementById('loginSenha') ?.addEventListener('input', atualizarBotaoLogin);

  document.getElementById('cadastroNome') ?.addEventListener('input', atualizarBotaoCadastro);
  document.getElementById('cadastroCpf')  ?.addEventListener('input', atualizarBotaoCadastro);
  document.getElementById('cadastroEmail')?.addEventListener('input', atualizarBotaoCadastro);
  document.getElementById('cadastroSenha')?.addEventListener('input', atualizarBotaoCadastro);

  // Remove borda de erro ao começar a digitar novamente
  document.querySelectorAll('.campo-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('campo-input--erro'));
  });
});