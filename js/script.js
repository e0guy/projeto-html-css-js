
// ===============================
// ENTREGA EXPRESS - SCRIPT JS
// ===============================

// Aguarda carregamento completo da página
document.addEventListener("DOMContentLoaded", () => {

  iniciarScrollSuave();
  iniciarBusca();
  iniciarAnimacoes();
  criarBotaoTopo();

});


// =======================================
// SCROLL SUAVE NOS LINKS DO MENU
// =======================================

function iniciarScrollSuave() {

  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {

    link.addEventListener("click", function (e) {

      e.preventDefault();

      const destino = document.querySelector(this.getAttribute("href"));

      if (destino) {

        destino.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });

}


// =======================================
// BUSCA SIMPLES
// =======================================

function iniciarBusca() {

  const form = document.querySelector(".search-box form");

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const input = form.querySelector("input");
    const valor = input.value.trim();

    if (valor === "") {

      alert("Digite uma cidade ou bairro.");

      return;
    }

    alert(`Buscando pontos de entrega em: ${valor}`);

    input.value = "";

  });

}


// =======================================
// ANIMAÇÃO AO ROLAR A PÁGINA
// =======================================

function iniciarAnimacoes() {

  const elementos = document.querySelectorAll(
    ".card, .about-card, .hero-text, .hero-image"
  );

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

      }

    });

  }, {
    threshold: 0.2
  });

  elementos.forEach(el => {

    el.classList.add("hidden");

    observer.observe(el);

  });

}


// =======================================
// BOTÃO VOLTAR AO TOPO
// =======================================

function criarBotaoTopo() {

  const botao = document.createElement("button");

  botao.innerText = "↑";
  botao.classList.add("btn-topo");

  document.body.appendChild(botao);

  // Mostrar botão ao rolar
  window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

      botao.classList.add("ativo");

    } else {

      botao.classList.remove("ativo");

    }

  });

  // Voltar ao topo
  botao.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

}