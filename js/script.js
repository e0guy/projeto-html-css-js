// ================================================================
// EQUIPE03 EXPRESS - JAVASCRIPT PRINCIPAL
// ----------------------------------------------------------------
// Este arquivo deixa o projeto funcional em produção estática.
// Como esta entrega não utiliza servidor, os dados são persistidos no cache do navegador,
// que é o armazenamento local do próprio navegador.
// ================================================================

// ---------------------------------------------------------------
// 1. CHAVES USADAS NO LOCALSTORAGE
// ---------------------------------------------------------------
// Cada chave funciona como uma "tabela" simples dentro do navegador.
// O painel administrativo lê exatamente essas chaves para montar as listas.
const CHAVES_CACHE = {
  motoristas: "equipe03_motoristas",
  buscas: "equipe03_buscas_agencias",
  rastreios: "equipe03_rastreios",
  cotacoes: "equipe03_cotacoes_frete",
};

// ---------------------------------------------------------------
// 2. PONTOS DE COLETA EQUPE03 EXPRESS
// ---------------------------------------------------------------
// Nesta versão de produção estática, os pontos abaixo simulam uma rede
// de coleta profissional. A lógica usa o CEP digitado como referência,
// e a marca exibida ao cliente é sempre Equipe03 Express.
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
    referencia:
      "Unidade indicada para vendedores da zona sul e região empresarial",
  },
  {
    nome: "Equipe03 Express - Ponto Olinda",
    endereco: "Avenida Getúlio Vargas, 88 - Bairro Novo, Olinda - PE",
    bairro: "Bairro Novo",
    cidade: "Olinda",
    uf: "PE",
    horario: "Atendimento de segunda a sexta, das 8h às 17h",
    prazo: "Postagem, devolução e recebimento de pedidos",
    referencia:
      "Unidade indicada para pequenos negócios da Região Metropolitana",
  },
  {
    nome: "Equipe03 Express - Ponto Jaboatão",
    endereco:
      "Avenida Bernardo Vieira de Melo, 3000 - Piedade, Jaboatão dos Guararapes - PE",
    bairro: "Piedade",
    cidade: "Jaboatão dos Guararapes",
    uf: "PE",
    horario: "Atendimento de segunda a sexta, das 8h às 18h",
    prazo: "Coleta programada, postagem e apoio operacional",
    referencia:
      "Unidade indicada para operações em Jaboatão e bairros próximos",
  },
];

// ---------------------------------------------------------------
// 3. STATUS SIMULADOS PARA RASTREAMENTO
// ---------------------------------------------------------------
// Quando o usuário digita um código de rastreio, o sistema seleciona
// um desses status para retornar uma consulta operacional no front-end.
const STATUS_RASTREIO = [
  "Pedido registrado na central Equipe03 Express",
  "Pedido separado e aguardando coleta",
  "Parceiro operacional em rota de coleta",
  "Pedido em transporte para o destino",
  "Entrega concluída com confirmação operacional",
];

// ---------------------------------------------------------------
// 4. INICIALIZAÇÃO GERAL
// ---------------------------------------------------------------
// DOMContentLoaded garante que o JavaScript só rode depois que todo
// o HTML da página já estiver carregado no navegador.
document.addEventListener("DOMContentLoaded", () => {
  iniciarMenuMobile();
  iniciarScrollSuave();
  iniciarAnimacoes();
  criarBotaoTopo();
  iniciarCadastroMotorista();
  iniciarBuscaAgencia();
  iniciarCotacaoFrete();
  iniciarRastreamento();
  iniciarPainelLocal();
  cpfconfiguration();
});

// ================================================================
// 5. FUNÇÕES DE LOCALSTORAGE
// ================================================================

// Lê uma lista salva no cache do navegador.
// Se a chave não existir, retorna um array vazio.
function lerCache(chave) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    // Caso algum dado esteja corrompido, evita quebrar o sistema.
    console.error("Erro ao ler o cache:", erro);
    return [];
  }
}

// Salva uma lista no cache do navegador convertendo o array em texto JSON.
function salvarCache(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// Adiciona um novo item no começo da lista salva no navegador.
function adicionarNoCache(chave, item) {
  const lista = lerCache(chave);
  lista.unshift(item);
  salvarCache(chave, lista);
}

// Remove uma lista inteira do cache do navegador.
function limparCache(chave) {
  localStorage.removeItem(chave);
}

// Gera um ID simples com base na data atual e em um número aleatório.
function gerarId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Formata a data ISO para o padrão brasileiro.
function formatarData(dataISO) {
  return new Date(dataISO).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Evita que textos digitados pelo usuário sejam interpretados como HTML.
// Isso é uma proteção básica para dados exibidos na tela.
function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ================================================================
// 6. FUNÇÕES DE INTERFACE
// ================================================================

// Controla o menu mobile.
// Ao clicar no botão, adiciona ou remove a classe "ativo" do menu.
function iniciarMenuMobile() {
  const botao = document.querySelector("#menuToggle");
  const menu = document.querySelector("#menuPrincipal");

  if (!botao || !menu) return;

  botao.addEventListener("click", () => {
    menu.classList.toggle("ativo");
  });
}

// Faz links internos, como #rastreamento, descerem suavemente até a seção.
function iniciarScrollSuave() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (evento) {
      const destino = document.querySelector(this.getAttribute("href"));

      if (!destino) return;

      evento.preventDefault();
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Aplica animação de entrada nos cards quando aparecem na tela.
function iniciarAnimacoes() {
  const elementos = document.querySelectorAll(
    ".feature-card, .operation-image, .operation-content, .metric-card, .panel-section, .agency-card, .form-card",
  );

  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.12 },
  );

  elementos.forEach((elemento) => {
    elemento.classList.add("hidden");
    observer.observe(elemento);
  });
}

// Cria automaticamente o botão de voltar ao topo.
function criarBotaoTopo() {
  const botao = document.createElement("button");

  botao.innerText = "↑";
  botao.classList.add("btn-topo");
  botao.setAttribute("aria-label", "Voltar ao topo");

  document.body.appendChild(botao);

  // O botão só aparece quando a página já foi rolada para baixo.
  window.addEventListener("scroll", () => {
    botao.classList.toggle("ativo", window.scrollY > 420);
  });

  botao.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ================================================================
// 7. CADASTRO DE MOTORISTAS
// ================================================================

// Captura o formulário de motorista e salva os dados no navegador.
function iniciarCadastroMotorista() {
  const form = document.querySelector("#formMotorista");
  const mensagem = document.querySelector("#mensagemFormulario");

  // Se a página atual não tiver esse formulário, a função é encerrada.
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Objeto com os dados preenchidos pelo usuário.
    const motorista = {
      id: gerarId(),
      nome: document.querySelector("#nome").value.trim(),
      cpf: document.querySelector("#cpf").value.trim(),
      telefone: document.querySelector("#telefone").value.trim(),
      email: document.querySelector("#email").value.trim(),
      regiao: document.querySelector("#regiao").value.trim(),
      veiculo: document.querySelector("#veiculo").value,
      criadoEm: new Date().toISOString(),
    };

    // Confere se algum campo está vazio.
    const camposInvalidos = Object.values(motorista).some((valor) => !valor);

    if (camposInvalidos) {
      Swal.fire({
     title: "Cadastro realizado!",
     text: "Parceiro cadastrado com sucesso no painel local.",
     icon: "success",
     confirmButtonText: "OK"
     });
      return;
    }

    // Salva no cache do navegador e limpa o formulário.
    adicionarNoCache(CHAVES_CACHE.motoristas, motorista);
    form.reset();

    mensagem.textContent = "Parceiro cadastrado com sucesso no painel local.";
    mensagem.className = "form-message sucesso";
  });
}

// ================================================================
// 8. BUSCA DE PONTOS DE COLETA
// ================================================================

// Inicia a busca de pontos de coleta em modo estático.
// O usuário pode digitar CEP, cidade ou bairro. Quando o termo tem formato de CEP,
// a função consulta a API pública ViaCEP para identificar cidade, UF e bairro.
function iniciarBuscaAgencia() {
  const form = document.querySelector("#formAgencia");
  const lista = document.querySelector("#listaAgencias");

  if (!form || !lista) return;

  // Mostra os pontos de coleta antes mesmo da primeira busca.
  renderizarAgencias(AGENCIAS_FIXAS, lista);

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const campoBusca = document.querySelector("#buscaAgencia");
    const termo = campoBusca.value.trim();

    if (!termo) return;

    // Registra o termo pesquisado para aparecer no painel administrativo.
    adicionarNoCache(CHAVES_CACHE.buscas, {
      id: gerarId(),
      termo,
      criadoEm: new Date().toISOString(),
    });

    // Exibe uma mensagem rápida enquanto o endereço do CEP é consultado.
    lista.innerHTML = `<div class="empty-state">Buscando pontos de coleta próximos...</div>`;

    // Tenta descobrir o endereço real quando o usuário digita um CEP brasileiro.
    const enderecoCep = await consultarCep(termo);

    // Filtra os pontos mais adequados de acordo com CEP, bairro, cidade ou UF.
    const pontosEncontrados = filtrarAgencias(termo, enderecoCep);

    // Atualiza os cards com o resultado profissional e o botão do Google Maps.
    renderizarAgencias(pontosEncontrados, lista, termo, enderecoCep);
  });
}

// Consulta a API pública ViaCEP para transformar um CEP em endereço.
// Isso mantém o projeto sem backend, mas entrega uma experiência mais realista.
async function consultarCep(termo) {
  const cep = extrairCep(termo);

  // Se o usuário digitou cidade ou bairro, não faz consulta de CEP.
  if (!cep) return null;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    // A API retorna "erro: true" quando o CEP não existe.
    if (dados.erro) return null;

    return {
      cep: dados.cep,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      uf: dados.uf,
    };
  } catch (erro) {
    // Se a internet falhar, o site continua funcionando com os pontos fixos.
    console.error("Não foi possível consultar o CEP:", erro);
    return null;
  }
}

// Extrai apenas números do texto e valida se existe um CEP com 8 dígitos.
function extrairCep(termo) {
  const somenteNumeros = termo.replace(/\D/g, "");
  return somenteNumeros.length === 8 ? somenteNumeros : null;
}

// Normaliza textos para busca, removendo acentos e transformando tudo em minúsculo.
function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Filtra os pontos de coleta pelo endereço retornado do CEP ou pelo texto digitado.
function filtrarAgencias(termo, enderecoCep) {
  const termoNormalizado = normalizarTexto(termo);

  const resultado = AGENCIAS_FIXAS.filter((agencia) => {
    const textoAgencia = normalizarTexto(
      `${agencia.nome} ${agencia.endereco} ${agencia.bairro} ${agencia.cidade} ${agencia.uf}`,
    );

    // Quando existe endereço do CEP, prioriza cidade, UF e bairro.
    if (enderecoCep) {
      const mesmaCidade =
        normalizarTexto(agencia.cidade) === normalizarTexto(enderecoCep.cidade);
      const mesmoUf =
        normalizarTexto(agencia.uf) === normalizarTexto(enderecoCep.uf);
      const mesmoBairro = normalizarTexto(agencia.bairro).includes(
        normalizarTexto(enderecoCep.bairro),
      );

      return (mesmaCidade && mesmoUf) || mesmoBairro;
    }

    return textoAgencia.includes(termoNormalizado);
  });

  // Se não encontrar correspondência exata, mostra todos os pontos como opções disponíveis.
  return resultado.length ? resultado : AGENCIAS_FIXAS;
}

// Monta um link seguro para abrir o endereço no Google Maps.
function criarLinkGoogleMaps(endereco) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

// Monta os cards dos pontos de coleta na tela.
function renderizarAgencias(
  agencias,
  elemento,
  termo = "",
  enderecoCep = null,
) {
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
  `,
    )
    .join("");
}

// ================================================================
// 8.1. COTAÇÃO DE FRETE SIMULADA
// ================================================================

// Inicia a calculadora comercial de frete.
// A simulação apresenta uma experiência próxima do mercado:
// CEP de origem, CEP de destino, peso, preço estimado e prazo.
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
      resultado.innerHTML = `<div class="empty-state">Preencha os CEPs e o peso para simular o frete.</div>`;
      return;
    }

    // Cálculo demonstrativo: usa o peso para variar os preços e prazos.
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

    Swal.fire({
  title: "Cotação realizada!",
  text: "Sua simulação de frete foi gerada com sucesso.",
  icon: "success"
  });

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
  });
}

// ================================================================
// 9. RASTREAMENTO
// ================================================================

// Captura o código digitado e gera uma resposta de rastreio no front-end.
function iniciarRastreamento() {
  const form = document.querySelector("#formRastreamento");
  const resultado = document.querySelector("#resultadoRastreamento");

  if (!form || !resultado) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const codigo = document
      .querySelector("#codigoRastreamento")
      .value.trim()
      .toUpperCase();
    if (!codigo) return;

    // Escolhe um status operacional para representar a movimentação da entrega.
    const status =
      STATUS_RASTREIO[Math.floor(Math.random() * STATUS_RASTREIO.length)];

    const rastreio = {
      id: gerarId(),
      codigo,
      status,
      local: "Hub operacional Equipe03 Express - Recife",
      criadoEm: new Date().toISOString(),
    };

    // Salva a consulta para aparecer no painel administrativo.
    Swal.fire({
  title: "Rastreamento encontrado!",
  text: `Status atual: ${rastreio.status}`,
  icon: "success"
});

    // Mostra o resultado na própria página.
    resultado.innerHTML = 
    
      <article class="result-card">
        <strong>Código ${escaparHTML(rastreio.codigo)}</strong>
        <p>Status: ${escaparHTML(rastreio.status)}</p>
        <p>Local: ${escaparHTML(rastreio.local)}</p>
        <p>Consulta realizada em ${formatarData(rastreio.criadoEm)}</p>
      </article>
    `;

    form.reset();
  });
}

// ================================================================
// 10. PAINEL LOCAL
// ================================================================

// Inicia o painel administrativo apenas quando os elementos existem.
function iniciarPainelLocal() {
  const totalMotoristas = document.querySelector("#totalMotoristas");
  const totalBuscas = document.querySelector("#totalBuscas");
  const totalRastreios = document.querySelector("#totalRastreios");
  const totalCotacoes = document.querySelector("#totalCotacoes");

  if (!totalMotoristas || !totalBuscas || !totalRastreios) return;

  atualizarPainel();

  configurarBotaoLimpar("#limparMotoristas", CHAVES_CACHE.motoristas);
  configurarBotaoLimpar("#limparBuscas", CHAVES_CACHE.buscas);
  configurarBotaoLimpar("#limparRastreios", CHAVES_CACHE.rastreios);
  configurarBconst confirotaoLimpar("#limparCotacoes", CHAVES_CACHE.cotacoes);
}

// Configura os botões que limpam dados do navegador.
function configurarBotaoLimpar(seletor, chave) {
  const botao = document.querySelector(seletor);

  if (!botao) return;

  botao.addEventListener("click", () => {
    mbotao.addEventListener("click", async () => {
  const resultado = await Swal.fire({
    title: "Tem certeza?",
    text: "Todos os dados desta seção serão removidos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, limpar",
    cancelButtonText: "Cancelar"
  });

  if (resultado.isConfirmed) {
    limparCache(chave);
    atualizarPainel();

    Swal.fire({
      title: "Limpo!",
      text: "Os dados foram removidos com sucesso.",
      icon: "success"
    });
    }
  });

// Atualiza os números e as listas do painel administrativo.
function atualizarPainel() {
  const motoristas = lerCache(CHAVES_CACHE.motoristas);
  const buscas = lerCache(CHAVES_CACHE.buscas);
  const rastreios = lerCache(CHAVES_CACHE.rastreios);
  const cotacoes = lerCache(CHAVES_CACHE.cotacoes);

  document.querySelector("#totalMotoristas").textContent = motoristas.length;
  document.querySelector("#totalBuscas").textContent = buscas.length;
  document.querySelector("#totalRastreios").textContent = rastreios.length;

  const totalCotacoes = document.querySelector("#totalCotacoes");
  if (totalCotacoes) totalCotacoes.textContent = cotacoes.length;

  renderizarCotacoes(cotacoes);
  renderizarMotoristas(motoristas);
  renderizarBuscas(buscas);
  renderizarRastreios(rastreios);
}

// Renderiza os motoristas cadastrados no painel.
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
  `,
    )
    .join("");
}

// Renderiza o histórico de buscas de agências.
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
  `,
    )
    .join("");
}

// Renderiza o histórico de rastreamentos feitos na página inicial.
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
  `,
    )
    .join("");
}

// Renderiza as cotações de frete simuladas no painel comercial.
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
  `,
    )
    .join("");
}

function cpfconfiguration() {
  const form = document.querySelector("form");
  const inputCpf = document.getElementById("cpf");

  if (inputCpf) {
    inputCpf.addEventListener("input", (e) => {
      let valor = e.target.value.replace(/\D/g, ""); // Limpa o que não for número

      // Aplica a máscara visualmente
      if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
      e.target.value = valor; // Mostra formatado no input
    });
  }

  // SEÇÃO 2: Limpa o CPF e salva os dados no localStorage QUANDO ENVIAR O FORMULÁRIO
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Impede o recarregamento da página

      // Pega o valor atual do input e remove os pontos/hífen para salvar limpo
      const cpfLimpo = inputCpf.value.replace(/\D/g, "");

      // Monta o objeto com os dados digitados
      const novoMotorista = {
        nome: document.getElementById("nome").value,
        cpf: cpfLimpo, // <-- salvando apenas os numeros.
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        regiao: document.getElementById("regiao").value,
        veiculo: document.getElementById("veiculo").value,
      };

      // Recupera a lista existente do localStorage ou cria uma vazia
      let listaMotoristas =
        JSON.parse(localStorage.getItem("motoristas")) || [];

      // Adiciona o novo objeto criado à lista
      listaMotoristas.push(novoMotorista);

      // Grava a lista atualizada de volta no localStorage
      localStorage.setItem("motoristas", JSON.stringify(listaMotoristas));

      alert("Motorista cadastrado com sucesso!");
      form.reset(); // Limpa todos os campos do formulário
    });
  }
}
