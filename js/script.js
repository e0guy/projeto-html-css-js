// Seleciona o botão de menu pelo ID
const menuToggle = document.getElementById("menuToggle");

// Seleciona o menu pelo ID
const menu = document.getElementById("menu");

// Verifica se os elementos existem antes de aplicar o evento
if (menuToggle && menu) {
  // Quando o usuário clicar no botão, abre ou fecha o menu
  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("active");
  });
}

// Seleciona todos os formulários do site
const forms = document.querySelectorAll("form");

// Percorre todos os formulários encontrados
forms.forEach(function (form) {
  // Impede o envio real do formulário, pois o projeto ainda é estático
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Mostra uma mensagem simples para simular o envio
    alert("Ação registrada com sucesso! Em uma versão futura, esses dados podem ser enviados para um banco de dados.");
  });
});
