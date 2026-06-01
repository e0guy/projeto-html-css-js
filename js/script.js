// ================================================================
// EQUIPE03 EXPRESS - JAVASCRIPT PRINCIPAL
// ----------------------------------------------------------------
// Este arquivo concentra as funcionalidades do projeto front-end.
// O sistema não usa backend: os dados são gravados no LocalStorage,
// que funciona como um armazenamento local do navegador.
// ================================================================

// ---------------------------------------------------------------
// 1. CHAVES DO LOCALSTORAGE
// ---------------------------------------------------------------
// Cada chave abaixo funciona como uma lista separada de dados.
const CHAVES_CACHE = {
  motoristas: "equipe03_motoristas",
  buscas: "equipe03_buscas_agencias",
  rastreios: "equipe03_rastreios",
  cotacoes: "equipe03_cotacoes_frete",
};

// ---------------------------------------------------------------
// 2. PONTOS DE COLETA DA EQUIPE03 EXPRESS
// ---------------------------------------------------------------
// Os pontos abaixo simulam unidades comerciais da empresa.
// A busca aceita CEP, cidade ou bairro e usa esses dados para filtrar.
const AGENCIAS_FIXAS = [
  {
    nome: "Equipe03 Express - Ponto Centro",
    endereco: "Avenida Guararapes, 120 - Santo Antônio, Recife - PE",
    bairro: "Santo Antônio",
    cidade: "Recife",
    uf: "PE",
    horario: "Atendimento de segunda a sexta, das 8h às 18h",
    prazo: "Postagem, coleta e retirada de encomendas para lojas e vendedores",
    referencia: "Unidade indicada para lojistas do centro comercial",
  },
  {
    nome: "Equipe03 Express - Ponto Boa Viagem",
    endereco: "Avenida Conselheiro Aguiar, 450 - Boa Viagem, Recife - PE",
    bairro: "Boa Viagem",
    cidade: "Recife",
    uf: "PE",
    horario: "Atendimento de segunda a sábado, das 9h às 19h",
    prazo: "Coleta expressa, postagem de pedidos e apoio a e-commerces",
    referencia: "Unidade indicada para vendedores da zona sul e região empresarial",
  },
  {
    nome: "Equipe03 Express - Ponto Olinda",
    endereco: "Avenida Getúlio Vargas, 88 - Bairro Novo, Olinda - PE",
    bairro: "Bairro Novo",
    cidade: "Olinda",
    uf: "PE",
    horario: "Atendimento de segunda a sexta, das 8h às 17h",
    prazo: "Postagem, devolução e recebimento de pedidos",
    referencia: "Unidade indicada para pequenos negócios da Região Metropolitana",
  },
  {
    nome: "Equipe03 Express - Ponto Jaboatão",
    endereco: "Avenida Bernardo Vieira de Melo, 3000 - Piedade, Jaboatão dos Guararapes - PE",
    bairro: "Piedade",
    cidade: "Jaboatão dos Guararapes",
    uf: "PE",
    horario: "Atendimento de segunda a sexta, das 8h às 18h",
    prazo: "Coleta programada, postagem e apoio operacional",
    referencia: "Unidade indicada para operações em Jaboatão e bairros próximos",
  },
];

// ---------------------------------------------------------------
// 3. STATUS SIMULADOS DE RASTREAMENTO
// ---------------------------------------------------------------
// A cada consulta de rastreio, o sistema seleciona um status.
const STATUS_RASTREIO = [
  "Pedido registrado na central Equipe03 Express",
  "Pedido separado e aguardando coleta",
  "Parceiro operacional em rota de coleta",
  "Pedido em transporte para o destino",
  "Entrega concluída com confirmação operacional",
];

// ---------------------------------------------------------------
// 4. INICIALIZAÇÃO DA PÁGINA
// ---------------------------------------------------------------
// DOMContentLoaded garante que o HTML carregou antes do JavaScript rodar.
document.addEventListener("DOMContentLoaded", () => {
  iniciarMenuMobile();
  iniciarScrollSuave();
  iniciarAnimacoes();
  criarBotaoTopo();
  iniciarMascaraCpf();
  iniciarCadastroMotorista();
  iniciarBuscaAgencia();
  iniciarCotacaoFrete();
  iniciarRastreamento();
  iniciarPainelLocal();
});

// ================================================================
// 5. FUNÇÕES AUXILIARES DE ALERTA COM SWEETALERT2
// ================================================================

// Exibe mensagens usando SweetAlert2.
// Caso a biblioteca não carregue por falta de internet, usa alert padrão.
function mostrarAlerta(opcoes) {
  if (typeof Swal !== "undefined") {
    return Swal.fire(opcoes);
  }

  alert(`${opcoes.title || "Aviso"}\n${opcoes.text || ""}`);
  return Promise.resolve({ isConfirmed: true });
}

// ================================================================
// 6. FUNÇÕES DE LOCALSTORAGE
// ================================================================

// Lê uma lista salva no navegador.
function lerCache(chave) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao ler dados locais:", erro);
    return [];
  }
}

// Salva uma lista no navegador.
function salvarCache(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// Adiciona um item no início da lista salva.
function adicionarNoCache(chave, item) {
  const lista = lerCache(chave);
  lista.unshift(item);
  salvarCache(chave, lista);
}

// Remove todos os dados de uma chave específica.
function limparCache(chave) {
  localStorage.removeItem(chave);
}

// Gera um identificador simples para cada registro.
function gerarId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Evita que textos digitados pelo usuário quebrem o HTML da página.
function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Formata datas salvas no LocalStorage.
function formatarData(dataISO) {
  if (!dataISO) return "data não informada";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dataISO));
}

// ================================================================
// 7. MENU MOBILE, SCROLL E EFEITOS VISUAIS
// ================================================================

// Abre e fecha o menu no celular.
function iniciarMenuMobile() {
  const botao = document.querySelector("#menuToggle");
  const menu = document.querySelector("#menuPrincipal");

  if (!botao || !menu) return;

  botao.addEventListener("click", () => {
    menu.classList.toggle("open");
    botao.classList.toggle("open");
  });
}

// Faz rolagem suave nos links internos.
function iniciarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destino = document.querySelector(link.getAttribute("href"));

      if (!destino) return;

      evento.preventDefault();
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Aplica animação leve de entrada nos elementos principais.
function iniciarAnimacoes() {
  const elementos = document.querySelectorAll(
    ".hero-content, .hero-visual, .trust-strip, .section-heading, .solution-card, .panel-section, .form-card, .page-card-info, .metric-card"
  );

  if (!("IntersectionObserver" in window)) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elementos.forEach((elemento) => {
    elemento.classList.add("reveal");
    observador.observe(elemento);
  });
}

// Cria botão de voltar ao topo.
function criarBotaoTopo() {
  const botao = document.createElement("button");
  botao.className = "back-to-top";
  botao.setAttribute("aria-label", "Voltar ao topo");
  botao.textContent = "↑";
  document.body.appendChild(botao);

  window.addEventListener("scroll", () => {
    botao.classList.toggle("show", window.scrollY > 500);
  });

  botao.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ================================================================
// 8. MÁSCARA DE CPF
// ================================================================

// Aplica máscara visual no campo CPF.
// Essa função não salva dados; ela apenas melhora a digitação.
function iniciarMascaraCpf() {
  const inputCpf = document.querySelector("#cpf");

  if (!inputCpf) return;

  inputCpf.addEventListener("input", (evento) => {
    let valor = evento.target.value.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    evento.target.value = valor;
  });
}

// ================================================================
// 9. CADASTRO DE MOTORISTAS
// ================================================================

// Captura o formulário de parceiros e salva no LocalStorage.
function iniciarCadastroMotorista() {
  const form = document.querySelector("#formMotorista");
  const mensagem = document.querySelector("#mensagemFormulario");

  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const motorista = {
      id: gerarId(),
      nome: document.querySelector("#nome")?.value.trim(),
      cpf: document.querySelector("#cpf")?.value.trim(),
      telefone: document.querySelector("#telefone")?.value.trim(),
      email: document.querySelector("#email")?.value.trim(),
      regiao: document.querySelector("#regiao")?.value.trim(),
      veiculo: document.querySelector("#veiculo")?.value,
      criadoEm: new Date().toISOString(),
    };

    const camposInvalidos = Object.entries(motorista)
      .filter(([campo]) => !["id", "criadoEm"].includes(campo))
      .some(([, valor]) => !valor);

    if (camposInvalidos) {
      mostrarAlerta({
        title: "Campos obrigatórios",
        text: "Preencha todos os dados do parceiro antes de cadastrar.",
        icon: "warning",
        confirmButtonText: "Entendi",
      });
      return;
    }

    adicionarNoCache(CHAVES_CACHE.motoristas, motorista);
    form.reset();

    if (mensagem) {
      mensagem.textContent = "Parceiro cadastrado com sucesso no painel local.";
      mensagem.className = "form-message sucesso";
    }

    mostrarAlerta({
      title: "Cadastro realizado",
      text: "Parceiro cadastrado com sucesso no painel operacional.",
      icon: "success",
      confirmButtonText: "Continuar",
    });
  });
}

// ================================================================
// 10. BUSCA DE PONTOS DE COLETA
// ================================================================

// Inicia a busca de pontos de coleta por CEP, cidade ou bairro.
function iniciarBuscaAgencia() {
  const form = document.querySelector("#formAgencia");
  const lista = document.querySelector("#listaAgencias");

  if (!form || !lista) return;

  renderizarAgencias(AGENCIAS_FIXAS, lista);

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const campoBusca = document.querySelector("#buscaAgencia");
    const termo = campoBusca.value.trim();

    if (!termo) {
      mostrarAlerta({
        title: "Informe uma busca",
        text: "Digite um CEP, cidade ou bairro para encontrar pontos de coleta.",
        icon: "warning",
      });
      return;
    }

    adicionarNoCache(CHAVES_CACHE.buscas, {
      id: gerarId(),
      termo,
      criadoEm: new Date().toISOString(),
    });

    lista.innerHTML = `<div class="empty-state">Buscando pontos de coleta próximos...</div>`;

    const enderecoCep = await consultarCep(termo);
    const pontosEncontrados = filtrarAgencias(termo, enderecoCep);

    renderizarAgencias(pontosEncontrados, lista, termo, enderecoCep);

    mostrarAlerta({
      title: "Pontos encontrados",
      text: "Confira as unidades Equipe03 Express disponíveis e abra a rota no Google Maps.",
      icon: "success",
      confirmButtonText: "Ver pontos",
    });
  });
}

// Consulta ViaCEP quando o usuário informa um CEP válido.
async function consultarCep(termo) {
  const cep = extrairCep(termo);

  if (!cep) return null;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) return null;

    return {
      cep: dados.cep,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      uf: dados.uf,
    };
  } catch (erro) {
    console.error("Não foi possível consultar o CEP:", erro);
    return null;
  }
}

// Extrai apenas números e valida CEP com 8 dígitos.
function extrairCep(termo) {
  const somenteNumeros = termo.replace(/\D/g, "");
  return somenteNumeros.length === 8 ? somenteNumeros : null;
}

// Normaliza texto para busca sem acentos.
function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Filtra os pontos de coleta.
function filtrarAgencias(termo, enderecoCep) {
  const termoNormalizado = normalizarTexto(termo);

  const resultado = AGENCIAS_FIXAS.filter((agencia) => {
    const textoAgencia = normalizarTexto(
      `${agencia.nome} ${agencia.endereco} ${agencia.bairro} ${agencia.cidade} ${agencia.uf}`
    );

    if (enderecoCep) {
      const mesmaCidade =
        normalizarTexto(agencia.cidade) === normalizarTexto(enderecoCep.cidade);
      const mesmoUf =
        normalizarTexto(agencia.uf) === normalizarTexto(enderecoCep.uf);
      const mesmoBairro = normalizarTexto(agencia.bairro).includes(
        normalizarTexto(enderecoCep.bairro)
      );

      return (mesmaCidade && mesmoUf) || mesmoBairro;
    }

    return textoAgencia.includes(termoNormalizado);
  });

  return resultado.length ? resultado : AGENCIAS_FIXAS;
}

// Gera link para pesquisa no Google Maps.
function criarLinkGoogleMaps(endereco) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

// Renderiza os cards de pontos de coleta.
function renderizarAgencias(agencias, elemento, termo = "", enderecoCep = null) {
  const resumoBusca = enderecoCep
    ? `Resultado para CEP ${escaparHTML(enderecoCep.cep)} - ${escaparHTML(enderecoCep.bairro || "bairro não informado")}, ${escaparHTML(enderecoCep.cidade)}-${escaparHTML(enderecoCep.uf)}`
    : termo
      ? `Resultado para: ${escaparHTML(termo)}`
      : "Ponto de coleta disponível";

  elemento.innerHTML = agencias
    .map(
      (agencia) => `
        <article class="agency-card">
          <span class="agency-meta">Ponto de postagem Equipe03</span>
          <h3>${escaparHTML(agencia.nome)}</h3>
          <p>${escaparHTML(agencia.endereco)}</p>
          <p>${escaparHTML(agencia.horario)}</p>
          <p>${escaparHTML(agencia.prazo)}</p>
          <p>${escaparHTML(agencia.referencia)}</p>
          <span>${resumoBusca}</span>

          <div class="agency-actions">
            <a class="btn btn-secondary btn-map" href="${criarLinkGoogleMaps(agencia.endereco)}" target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

// ================================================================
// 11. COTAÇÃO DE FRETE SIMULADA
// ================================================================

// Calcula preços demonstrativos de frete.
function iniciarCotacaoFrete() {
  const form = document.querySelector("#formCotacao");
  const resultado = document.querySelector("#resultadoCotacao");

  if (!form || !resultado) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const origem = document.querySelector("#cepOrigem").value.trim();
    const destino = document.querySelector("#cepDestino").value.trim();
    const peso = Number(document.querySelector("#pesoPacote").value);

    if (!origem || !destino || !peso || peso <= 0) {
      mostrarAlerta({
        title: "Dados incompletos",
        text: "Preencha os CEPs e o peso para simular o frete.",
        icon: "warning",
      });
      return;
    }

    const baseEconomica = 12 + peso * 4.9;
    const baseExpressa = 19 + peso * 7.5;

    const cotacao = {
      id: gerarId(),
      origem,
      destino,
      peso,
      economico: baseEconomica.toFixed(2),
      expresso: baseExpressa.toFixed(2),
      criadoEm: new Date().toISOString(),
    };

    adicionarNoCache(CHAVES_CACHE.cotacoes, cotacao);

    resultado.innerHTML = `
      <article class="result-card freight-result">
        <strong>Opções de frete para o seu envio</strong>
        <p>Origem: ${escaparHTML(origem)} | Destino: ${escaparHTML(destino)} | Peso: ${escaparHTML(peso)} kg</p>

        <div class="freight-options">
          <div>
            <span>Equipe03 Econômico</span>
            <strong>R$ ${cotacao.economico.replace(".", ",")}</strong>
            <p>Prazo estimado: 3 a 6 dias úteis</p>
          </div>

          <div>
            <span>Equipe03 Expresso</span>
            <strong>R$ ${cotacao.expresso.replace(".", ",")}</strong>
            <p>Prazo estimado: 1 a 3 dias úteis</p>
          </div>
        </div>
      </article>
    `;

    form.reset();

    mostrarAlerta({
      title: "Cotação realizada",
      text: "Sua simulação de frete foi gerada e registrada no painel.",
      icon: "success",
      confirmButtonText: "Continuar",
    });
  });
}

// ================================================================
// 12. RASTREAMENTO
// ================================================================

// Gera uma resposta demonstrativa para o código de rastreamento.
function iniciarRastreamento() {
  const form = document.querySelector("#formRastreamento");
  const resultado = document.querySelector("#resultadoRastreamento");

  if (!form || !resultado) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const codigo = document.querySelector("#codigoRastreamento").value.trim();

    if (!codigo) {
      mostrarAlerta({
        title: "Código obrigatório",
        text: "Informe um código de rastreamento para consultar.",
        icon: "warning",
      });
      return;
    }

    const status =
      STATUS_RASTREIO[Math.floor(Math.random() * STATUS_RASTREIO.length)];

    const rastreio = {
      id: gerarId(),
      codigo,
      status,
      local: "Hub operacional Equipe03 Express - Recife",
      criadoEm: new Date().toISOString(),
    };

    adicionarNoCache(CHAVES_CACHE.rastreios, rastreio);

    resultado.innerHTML = `
      <article class="result-card">
        <strong>Código ${escaparHTML(rastreio.codigo)}</strong>
        <p>Status: ${escaparHTML(rastreio.status)}</p>
        <p>Local: ${escaparHTML(rastreio.local)}</p>
        <p>Consulta realizada em ${formatarData(rastreio.criadoEm)}</p>
      </article>
    `;

    form.reset();

    mostrarAlerta({
      title: "Rastreamento encontrado",
      text: `Status atual: ${rastreio.status}`,
      icon: "success",
      confirmButtonText: "Continuar",
    });
  });
}

// ================================================================
// 13. PAINEL ADMINISTRATIVO LOCAL
// ================================================================

// Inicializa o painel apenas na página que possui as métricas.
function iniciarPainelLocal() {
  const totalMotoristas = document.querySelector("#totalMotoristas");
  const totalBuscas = document.querySelector("#totalBuscas");
  const totalRastreios = document.querySelector("#totalRastreios");

  if (!totalMotoristas || !totalBuscas || !totalRastreios) return;

  atualizarPainel();

  configurarBotaoLimpar("#limparMotoristas", CHAVES_CACHE.motoristas);
  configurarBotaoLimpar("#limparBuscas", CHAVES_CACHE.buscas);
  configurarBotaoLimpar("#limparRastreios", CHAVES_CACHE.rastreios);
  configurarBotaoLimpar("#limparCotacoes", CHAVES_CACHE.cotacoes);
}

// Configura botões de limpeza usando SweetAlert2 para confirmação.
function configurarBotaoLimpar(seletor, chave) {
  const botao = document.querySelector(seletor);

  if (!botao) return;

  botao.addEventListener("click", async () => {
    const resultado = await mostrarAlerta({
      title: "Tem certeza?",
      text: "Todos os dados desta seção serão removidos do navegador.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, limpar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    limparCache(chave);
    atualizarPainel();

    mostrarAlerta({
      title: "Dados removidos",
      text: "As informações foram apagadas com sucesso.",
      icon: "success",
      confirmButtonText: "Continuar",
    });
  });
}

// Atualiza métricas e listas do painel.
function atualizarPainel() {
  const motoristas = lerCache(CHAVES_CACHE.motoristas);
  const buscas = lerCache(CHAVES_CACHE.buscas);
  const rastreios = lerCache(CHAVES_CACHE.rastreios);
  const cotacoes = lerCache(CHAVES_CACHE.cotacoes);

  const totalMotoristas = document.querySelector("#totalMotoristas");
  const totalBuscas = document.querySelector("#totalBuscas");
  const totalRastreios = document.querySelector("#totalRastreios");
  const totalCotacoes = document.querySelector("#totalCotacoes");

  if (totalMotoristas) totalMotoristas.textContent = motoristas.length;
  if (totalBuscas) totalBuscas.textContent = buscas.length;
  if (totalRastreios) totalRastreios.textContent = rastreios.length;
  if (totalCotacoes) totalCotacoes.textContent = cotacoes.length;

  renderizarCotacoes(cotacoes);
  renderizarMotoristas(motoristas);
  renderizarBuscas(buscas);
  renderizarRastreios(rastreios);
}

// Mostra motoristas cadastrados.
function renderizarMotoristas(lista) {
  const elemento = document.querySelector("#listaMotoristas");

  if (!elemento) return;

  if (!lista.length) {
    elemento.innerHTML = `<div class="empty-state">Nenhum motorista cadastrado neste navegador.</div>`;
    return;
  }

  elemento.innerHTML = lista
    .map(
      (item) => `
        <article class="data-card">
          <h3>${escaparHTML(item.nome)}</h3>
          <p>CPF: ${escaparHTML(item.cpf)}</p>
          <p>Contato: ${escaparHTML(item.telefone)} | ${escaparHTML(item.email)}</p>
          <p>Região: ${escaparHTML(item.regiao)}</p>
          <p>Veículo: ${escaparHTML(item.veiculo)}</p>
          <span>Cadastrado em ${formatarData(item.criadoEm)}</span>
        </article>
      `
    )
    .join("");
}

// Mostra buscas de agências.
function renderizarBuscas(lista) {
  const elemento = document.querySelector("#listaBuscas");

  if (!elemento) return;

  if (!lista.length) {
    elemento.innerHTML = `<div class="empty-state">Nenhuma busca de agência registrada.</div>`;
    return;
  }

  elemento.innerHTML = lista
    .map(
      (item) => `
        <article class="data-card">
          <h3>${escaparHTML(item.termo)}</h3>
          <p>Consulta comercial para encontrar um ponto de postagem próximo.</p>
          <span>Buscado em ${formatarData(item.criadoEm)}</span>
        </article>
      `
    )
    .join("");
}

// Mostra rastreamentos.
function renderizarRastreios(lista) {
  const elemento = document.querySelector("#listaRastreios");

  if (!elemento) return;

  if (!lista.length) {
    elemento.innerHTML = `<div class="empty-state">Nenhum rastreamento registrado.</div>`;
    return;
  }

  elemento.innerHTML = lista
    .map(
      (item) => `
        <article class="data-card">
          <h3>${escaparHTML(item.codigo)}</h3>
          <p>Status: ${escaparHTML(item.status)}</p>
          <p>Local: ${escaparHTML(item.local)}</p>
          <span>Consultado em ${formatarData(item.criadoEm)}</span>
        </article>
      `
    )
    .join("");
}

// Mostra cotações.
function renderizarCotacoes(lista) {
  const elemento = document.querySelector("#listaCotacoes");

  if (!elemento) return;

  if (!lista.length) {
    elemento.innerHTML = `<div class="empty-state">Nenhuma cotação de frete registrada.</div>`;
    return;
  }

  elemento.innerHTML = lista
    .map(
      (item) => `
        <article class="data-card">
          <h3>Frete de ${escaparHTML(item.origem)} para ${escaparHTML(item.destino)}</h3>
          <p>Peso informado: ${escaparHTML(item.peso)} kg</p>
          <p>Equipe03 Econômico: R$ ${escaparHTML(String(item.economico)).replace(".", ",")}</p>
          <p>Equipe03 Expresso: R$ ${escaparHTML(String(item.expresso)).replace(".", ",")}</p>
          <span>Cotado em ${formatarData(item.criadoEm)}</span>
        </article>
      `
    )
    .join("");
}
