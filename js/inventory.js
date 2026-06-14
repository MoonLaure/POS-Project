if (guardPage(["manager"])) {
  renderNav("inventory.html");
}

let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
const div = document.getElementById("inventoryList");

function renderInventory() {
  div.innerHTML = "";

  Object.keys(inventory).forEach(item => {
    div.innerHTML += `
      <div class="stock-card">
        <div>
          <h3 class="card-title">${item}</h3>
          <p class="card-text">目前庫存：${inventory[item]}</p>
        </div>
        <button onclick="addStock('${item}')">進貨 +5</button>
      </div>`;
  });

  const count = Object.keys(inventory).length;
  for (let i = count; i < 40; i++) {
    div.innerHTML += `<div class="grid-cell empty-cell"></div>`;
  }
}

function addStock(item) {
  inventory[item] += 5;
  localStorage.setItem("inventory", JSON.stringify(inventory));
  location.reload();
}

renderInventory();
