// ==============================
// DARK MODE
// ==============================
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// ==============================
// FORM PAYMENT LOGIC
// ==============================
const pagamentoSelect = document.getElementById("apagamento");
const pixQRCodeContainer = document.getElementById("pix-qrcode");
const cardContainer = document.getElementById("card-container");

// Limpar QR Code se existir
let qr;

pagamentoSelect.addEventListener("change", () => {
  const value = pagamentoSelect.value;

  if (value === "pix") {
    pixQRCodeContainer.style.display = "block";
    cardContainer.style.display = "none";

    // Limpar QR anterior
    pixQRCodeContainer.innerHTML = "";

    // Gerar QR Code PIX (exemplo genérico)
    qr = new QRCode(pixQRCodeContainer, {
      text: "00020126580014BR.GOV.BCB.PIX0114+5511999999995204000053039865404100.005802BR5913Society FC6009Sao Paulo62070503***6304", 
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else if (value === "cartao") {
    cardContainer.style.display = "block";
    pixQRCodeContainer.style.display = "none";
    pixQRCodeContainer.innerHTML = "";
  } else {
    cardContainer.style.display = "none";
    pixQRCodeContainer.style.display = "none";
    pixQRCodeContainer.innerHTML = "";
  }
});

// ==============================
// CARD PREVIEW
// ==============================
const cardNumber = document.getElementById("card-number");
const cardName = document.getElementById("card-name");
const cardExpiry = document.getElementById("card-expiry");

const displayNumber = document.getElementById("display-number");
const displayName = document.getElementById("display-name");
const displayExpiry = document.getElementById("display-expiry");

cardNumber.addEventListener("input", () => {
  displayNumber.textContent = cardNumber.value || "#### #### #### ####";
});

cardName.addEventListener("input", () => {
  displayName.textContent = cardName.value.toUpperCase() || "NOME DO TITULAR";
});

cardExpiry.addEventListener("input", () => {
  displayExpiry.textContent = cardExpiry.value || "MM/AA";
});

// ==============================
// FORM SUBMISSION
// ==============================
const form = document.getElementById("agendamentoForm");
const resp = document.getElementById("aresp");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("anome").value.trim();
  const email = document.getElementById("aemail").value.trim();
  const telefone = document.getElementById("atelefone").value.trim();
  const data = document.getElementById("adata").value;
  const hora = document.getElementById("ahora").value;
  const quadra = document.getElementById("aquadra").value;
  const pagamento = document.getElementById("apagamento").value;

  if (!nome || !email || !telefone || !data || !hora || !quadra || !pagamento) {
    resp.textContent = "Por favor, preencha todos os campos.";
    resp.style.color = "red";
    return;
  }

  // Exibir mensagem de sucesso
  resp.textContent = `Agendamento realizado com sucesso para ${data} às ${hora} na ${quadra}. Forma de pagamento: ${pagamento}.`;
  resp.style.color = "green";

  // Limpar formulário (opcional)
  form.reset();
  pixQRCodeContainer.innerHTML = "";
  cardContainer.style.display = "none";
});

// ==============================
// AGENDAMENTO - PIX e Cartão
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const pagamentoSelect = document.getElementById("apagamento");
  const pixContainer = document.getElementById("pix-qrcode");
  const cardContainer = document.getElementById("card-container");
  const agendamentoForm = document.getElementById("agendamentoForm");
  const aresp = document.getElementById("aresp");

  // Função para atualizar exibição PIX/Cartão
  function updatePagamento() {
    const value = pagamentoSelect.value;
    if (value === "pix") {
      pixContainer.style.display = "block";
      cardContainer.style.display = "none";
      gerarQRCode();
    } else if (value === "cartao") {
      pixContainer.style.display = "none";
      cardContainer.style.display = "block";
    } else {
      pixContainer.style.display = "none";
      cardContainer.style.display = "none";
    }
  }

  pagamentoSelect.addEventListener("change", updatePagamento);
  updatePagamento(); // Inicial

  // ==============================
  // PIX QR CODE
  // ==============================
  function gerarQRCode() {
    pixContainer.innerHTML = ""; // limpa antes
    const chavePix = "00020126580014BR.GOV.BCB.PIX0136SEU_PIX_KEY5204000053039865404100005802BR5925Society FC6009Cidade SP61080540900062070503***6304";
    new QRCode(pixContainer, {
      text: chavePix,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // ==============================
  // CARTÃO PREVIEW
  // ==============================
  const cardNumberInput = document.getElementById("card-number");
  const cardNameInput = document.getElementById("card-name");
  const cardExpiryInput = document.getElementById("card-expiry");

  const displayNumber = document.getElementById("display-number");
  const displayName = document.getElementById("display-name");
  const displayExpiry = document.getElementById("display-expiry");

  cardNumberInput.addEventListener("input", () => {
    displayNumber.textContent = cardNumberInput.value || "#### #### #### ####";
  });
  cardNameInput.addEventListener("input", () => {
    displayName.textContent = cardNameInput.value.toUpperCase() || "NOME DO TITULAR";
  });
  cardExpiryInput.addEventListener("input", () => {
    displayExpiry.textContent = cardExpiryInput.value || "MM/AA";
  });

  // ==============================
  // SUBMIT AGENDAMENTO
  // ==============================
  agendamentoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("anome").value;
    const email = document.getElementById("aemail").value;
    const telefone = document.getElementById("atelefone").value;
    const data = document.getElementById("adata").value;
    const hora = document.getElementById("ahora").value;
    const quadra = document.getElementById("aquadra").value;
    const pagamento = pagamentoSelect.value;

    if (!nome || !email || !telefone || !data || !hora || !quadra || !pagamento) {
      aresp.textContent = "Por favor, preencha todos os campos.";
      return;
    }

    // Mensagem de confirmação simulada
    let msg = `Agendamento confirmado!\n\nQuadra: ${quadra}\nData: ${data} às ${hora}\nForma de pagamento: ${pagamento}`;
    if (pagamento === "pix") {
      msg += "\nUse o QR code acima para pagar via PIX.";
    }
    aresp.textContent = msg;
  });
});

// ==============================
// SCRIPT COMPLETO DE AGENDAMENTO
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS
  const pagamentoSelect = document.getElementById("apagamento");
  const pixContainer = document.getElementById("pix-qrcode");
  const cardContainer = document.getElementById("card-container");
  const agendamentoForm = document.getElementById("agendamentoForm");
  const aresp = document.getElementById("aresp");

  // CHAVE PIX (substitua pela sua chave real)
  const minhaChavePix = "71141645483"; // <-- troque aqui

  // FUNÇÃO DE TROCA DE PAGAMENTO
  function updatePagamento() {
    const value = pagamentoSelect.value;
    if (value === "pix") {
      pixContainer.style.display = "block";
      cardContainer.style.display = "none";
      gerarQRCode();
    } else if (value === "cartao") {
      pixContainer.style.display = "none";
      cardContainer.style.display = "block";
    } else {
      pixContainer.style.display = "none";
      cardContainer.style.display = "none";
    }
  }

  pagamentoSelect.addEventListener("change", updatePagamento);
  updatePagamento();

  // ==============================
  // FUNÇÃO GERAR QR CODE PIX
  // ==============================
  function gerarQRCode() {
    pixContainer.innerHTML = ""; // limpa o container

    // Payload simples do PIX (pode ser customizado conforme banco)
    const payloadPix = `00020126580014BR.GOV.BCB.PIX0136${minhaChavePix}5204000053039865404100005802BR5925Society FC6009Cidade SP61080540900062070503***6304`;

    new QRCode(pixContainer, {
      text: payloadPix,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // ==============================
  // PREVIEW CARTÃO DE CRÉDITO
  // ==============================
  const cardNumberInput = document.getElementById("card-number");
  const cardNameInput = document.getElementById("card-name");
  const cardExpiryInput = document.getElementById("card-expiry");

  const displayNumber = document.getElementById("display-number");
  const displayName = document.getElementById("display-name");
  const displayExpiry = document.getElementById("display-expiry");

  cardNumberInput.addEventListener("input", () => {
    displayNumber.textContent = cardNumberInput.value || "#### #### #### ####";
  });
  cardNameInput.addEventListener("input", () => {
    displayName.textContent = cardNameInput.value.toUpperCase() || "NOME DO TITULAR";
  });
  cardExpiryInput.addEventListener("input", () => {
    displayExpiry.textContent = cardExpiryInput.value || "MM/AA";
  });

  // ==============================
  // SUBMIT FORMULÁRIO DE AGENDAMENTO
  // ==============================
  agendamentoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("anome").value;
    const email = document.getElementById("aemail").value;
    const telefone = document.getElementById("atelefone").value;
    const data = document.getElementById("adata").value;
    const hora = document.getElementById("ahora").value;
    const quadra = document.getElementById("aquadra").value;
    const pagamento = pagamentoSelect.value;

    if (!nome || !email || !telefone || !data || !hora || !quadra || !pagamento) {
      aresp.textContent = "Por favor, preencha todos os campos.";
      return;
    }

    let msg = `✅ Agendamento confirmado!\n\nQuadra: ${quadra}\nData: ${data} às ${hora}\nForma de pagamento: ${pagamento}`;
    if (pagamento === "pix") {
      msg += "\n📌 Use o QR code acima para pagar via PIX.";
    }
    aresp.textContent = msg;

    // Limpar formulário após confirmação
    // agendamentoForm.reset(); // opcional
  });
});
