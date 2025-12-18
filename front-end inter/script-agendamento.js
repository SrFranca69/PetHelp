// ==============================
// DARK MODE
// ==============================
const themeToggle = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// ==============================
// ELEMENTOS DO FORMULÁRIO DE AGENDAMENTO
// ==============================
const agendamentoForm = document.getElementById("agendamentoForm");
const pagamentoSelect = document.getElementById("apagamento");
const pixContainer = document.getElementById("pix-qrcode");
const cardContainer = document.getElementById("card-container");
const displayNumber = document.getElementById("display-number");
const displayName = document.getElementById("display-name");
const displayExpiry = document.getElementById("display-expiry");
const cardNumberInput = document.getElementById("card-number");
const cardNameInput = document.getElementById("card-name");
const cardExpiryInput = document.getElementById("card-expiry");
const resp = document.getElementById("aresp");
const horaInput = document.getElementById("ahora");
const quadraSelect = document.getElementById("aquadra");

// Inicialmente esconde áreas
if (cardContainer) cardContainer.style.display = "none";
if (pixContainer) pixContainer.style.display = "none";

// ==============================
// PREÇOS POR QUADRA E HORÁRIO
// ==============================
const precos = {
  quadra1: { dia: 80, noite: 90 },
  quadra2: { dia: 80, noite: 90 }
};

let valorFinal = 0;

function calcularPreco(quadra, hora) {
  if (!quadra || !hora) return 0;
  const h = parseInt(hora.split(":")[0]);
  const periodo = (h >= 6 && h < 18) ? "dia" : "noite";
  return precos[quadra][periodo] || 0;
}

// Cria seletor de duração
if (agendamentoForm && pagamentoSelect) {
  const duracaoSelect = document.createElement("select");
  duracaoSelect.id = "aduracao";
  duracaoSelect.required = true;
  duracaoSelect.innerHTML = `
    <option value="">Duração (horas)</option>
    <option value="1">1 hora</option>
    <option value="2">2 horas</option>
    <option value="3">3 horas</option>
    <option value="4">4 horas</option>
  `;
  agendamentoForm.insertBefore(duracaoSelect, pagamentoSelect);

  const precoTexto = document.createElement("h3");
  precoTexto.id = "preco-total";
  precoTexto.textContent = "💵 Preço total: R$ 0,00";
  precoTexto.style.marginTop = "10px";
  agendamentoForm.insertBefore(precoTexto, pagamentoSelect);

  function atualizarPrecoTotal() {
    const quadra = quadraSelect.value;
    const hora = horaInput.value;
    let precoUnit = calcularPreco(quadra, hora);
    const duracao = parseInt(duracaoSelect.value) || 1;
    valorFinal = precoUnit * duracao;
    precoTexto.textContent = `💵 Preço total: R$ ${valorFinal.toFixed(2)}`;
  }

  horaInput.addEventListener("change", atualizarPrecoTotal);
  quadraSelect.addEventListener("change", atualizarPrecoTotal);
  duracaoSelect.addEventListener("change", atualizarPrecoTotal);
}

// ==============================
// PRÉ-VISUALIZAÇÃO DO CARTÃO
// ==============================
cardNumberInput?.addEventListener("input", () => {
  displayNumber.textContent = cardNumberInput.value || "#### #### #### ####";
});
cardNameInput?.addEventListener("input", () => {
  displayName.textContent = cardNameInput.value.toUpperCase() || "NOME DO TITULAR";
});
cardExpiryInput?.addEventListener("input", () => {
  displayExpiry.textContent = cardExpiryInput.value || "MM/AA";
});

// ==============================
// ALTERAÇÃO DE PAGAMENTO
// ==============================
pagamentoSelect?.addEventListener("change", () => {
  const metodo = pagamentoSelect.value;
  if (metodo === "pix") {
    pixContainer.style.display = "none"; // só aparece após confirmar
    cardContainer.style.display = "none";
  } else if (metodo === "cartao") {
    cardContainer.style.display = "block";
    pixContainer.style.display = "none";
  } else {
    cardContainer.style.display = "none";
    pixContainer.style.display = "none";
  }
});

// ==============================
// FUNÇÃO PARA GERAR PIX
// ==============================
function gerarPix(valor) {
  if (valor <= 0) {
    alert("Escolha quadra, hora e duração para calcular o valor.");
    return;
  }
  const chavePix = "seuemail@seudominio.com";
  const pixCode = `00020126360014BR.GOV.BCB.PIX0114${chavePix}520400005303986540${valor.toFixed(2)}5802BR5920Society FC6009Recife62070503***6304`;

  pixContainer.innerHTML = `
    <p>Escaneie o QR Code para pagar <strong>R$ ${valor.toFixed(2)}</strong></p>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=230x230&data=${encodeURIComponent(pixCode)}" alt="QR Code PIX">
    <button id="copyPix" class="btn">📋 Copiar código PIX</button>
    <p id="timer">⏰ Tempo restante: 05:00</p>
  `;
  pixContainer.style.display = "block";

  document.getElementById("copyPix").addEventListener("click", () => {
    navigator.clipboard.writeText(pixCode)
      .then(() => alert("✅ Código PIX copiado!"))
      .catch(() => alert("❌ Não foi possível copiar o código PIX."));
  });

  let tempo = 300;
  const timerElem = document.getElementById("timer");
  const interval = setInterval(() => {
    if (tempo <= 0) {
      clearInterval(interval);
      pixContainer.innerHTML = "<p>⚠️ O QR Code expirou. Clique em Confirmar novamente.</p>";
      return;
    }
    tempo--;
    const min = String(Math.floor(tempo / 60)).padStart(2, "0");
    const seg = String(tempo % 60).padStart(2, "0");
    timerElem.textContent = `⏰ Tempo restante: ${min}:${seg}`;
  }, 1000);
}

// ==============================
// SUBMISSÃO DO FORMULÁRIO DE AGENDAMENTO
// ==============================
agendamentoForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("anome").value;
  const email = document.getElementById("aemail").value;
  const telefone = document.getElementById("atelefone").value;
  const data = document.getElementById("adata").value;
  const hora = horaInput.value;
  const quadra = quadraSelect.value;
  const pagamento = pagamentoSelect.value;

  if (!nome || !email || !telefone || !data || !hora || !quadra || !document.getElementById("aduracao").value || !pagamento) {
    resp.textContent = "⚠️ Preencha todos os campos antes de confirmar!";
    resp.style.color = "orange";
    return;
  }

  if (pagamento === "pix") {
    gerarPix(valorFinal);
    resp.textContent = `💰 Pedido pendente até confirmação do pagamento PIX (R$ ${valorFinal.toFixed(2)}).`;
    resp.style.color = "orange";
  } else if (pagamento === "cartao") {
    resp.textContent = `✅ Pagamento com cartão confirmado! Valor total: R$ ${valorFinal.toFixed(2)}.`;
    resp.style.color = "green";
    cardContainer.style.display = "none";
    pixContainer.style.display = "none";
    agendamentoForm.reset();
    displayNumber.textContent = "#### #### #### ####";
    displayName.textContent = "NOME DO TITULAR";
    displayExpiry.textContent = "MM/AA";
    document.getElementById("preco-total").textContent = "💵 Preço total: R$ 0,00";
    valorFinal = 0;
  } else {
    resp.textContent = `💵 Agendamento pendente para pagamento em dinheiro (R$ ${valorFinal.toFixed(2)}).`;
    resp.style.color = "orange";
    pixContainer.style.display = "none";
    cardContainer.style.display = "none";
    agendamentoForm.reset();
    document.getElementById("preco-total").textContent = "💵 Preço total: R$ 0,00";
    valorFinal = 0;
  }
});

// ==============================
// FORMULÁRIO DE CONTATO WHATSAPP
// ==============================
const contatoForm = document.getElementById("contactForm");

if (contatoForm) {
  contatoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("cname").value.trim();
    const email = document.getElementById("cemail").value.trim();
    const mensagem = document.getElementById("cmsg").value.trim();

    if (!nome || !email || !mensagem) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    const numeroWhatsApp = "5581983056553";
    const texto = `Olá! Tenho uma nova mensagem do site:\n\nNome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`;
    const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(link, "_blank");

    contatoForm.reset();
  });
}
