if (guardPage(["kitchen"])) {
  renderNav("kitchen.html");
}

const ordersDiv = document.getElementById("orders");
let orders = getOrders();
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let menu = JSON.parse(localStorage.getItem("menu")) || [];

function itemLines(items) {
  if (!items || items.length === 0) return `<li>無餐點</li>`;
  return items.map(item => `<li>${item.name}</li>`).join("");
}

function getElapsedMinutes(order) {
  let start = Number(order.createdAtMs);
  if (!start && order.createdAt) {
    const parsed = new Date(order.createdAt).getTime();
    start = Number.isNaN(parsed) ? Date.now() : parsed;
  }
  if (!start) start = Date.now();
  return Math.max(0, Math.floor((Date.now() - start) / 60000));
}

function kitchenHeader(order) {
  const tableNo = order.tableNo || "?";
  const people = order.people || order.guestCount || "?";
  const elapsedMinutes = getElapsedMinutes(order);
  return `[${tableNo},${people},${elapsedMinutes}分]`;
}

function renderOrders() {
  ordersDiv.innerHTML = "";
  const cookingOrders = orders.filter(o => o.status === "製作中");

  cookingOrders.forEach((o) => {
    const realIndex = orders.indexOf(o);
    ordersDiv.innerHTML += `
      <div class="kitchen-table-card">
        <div class="kitchen-table-title">${kitchenHeader(o)}</div>
        <ul class="kitchen-food-list">${itemLines(o.items)}</ul>
        <button onclick="finish(${realIndex})">製作完成</button>
      </div>`;
  });

  for (let i = cookingOrders.length; i < 40; i++) {
    ordersDiv.innerHTML += `<div class="grid-cell empty-cell"></div>`;
  }
}

function finish(orderIndex) {
  const order = orders[orderIndex];
  if (!order || order.status !== "製作中") return;

  order.items.forEach(item => {
    const menuItem = menu.find(m => Number(m.id) === Number(item.id));
    if (!menuItem) return;

    const ingredients = menuItem.stockUse || {};
    for (let ing in ingredients) {
      inventory[ing] = (inventory[ing] || 0) - ingredients[ing];
    }
  });

  orders[orderIndex].status = "可結帳";
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  alert("餐點完成，已扣除庫存");
  location.reload();
}

renderOrders();
setInterval(renderOrders, 60000);
