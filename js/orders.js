if (guardPage(["waiter", "kitchen", "manager"])) {
  renderNav("orders.html");
}

const list = document.getElementById("ordersList");
const orders = getOrders();

orders.forEach((o, index) => {
  const total = calcItemsTotal(o.items);
  list.innerHTML += `
    <div class="order-card">
      <div>
        <h3 class="card-title">訂單 ${index + 1}</h3>
        <p class="card-text">桌號：${o.tableNo || "未指定"}</p>
        <p class="card-text">餐點：${formatItemList(o.items)}</p>
        <p class="card-text">金額：$${total}</p>
        <p class="card-text">員工號：${o.employeeNo || "未記錄"}</p>
        <p class="card-text">進單時間：${o.createdAt || "未記錄"}</p>
        <p class="card-text">狀態：${o.status}</p>
      </div>
    </div>`;
});

for (let i = orders.length; i < 40; i++) {
  list.innerHTML += `<div class="grid-cell empty-cell"></div>`;
}
