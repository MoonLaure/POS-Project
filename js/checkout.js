if (guardPage(["waiter", "manager"])) {
  renderNav("checkout.html");
}

let selectedTable = null;

function selectCheckoutTable(no) {
  selectedTable = no;
  renderTableGrid("tableGrid", "selectCheckoutTable", selectedTable);
  renderCheckoutInfo();
}

function renderCheckoutInfo() {
  const panel = document.getElementById("checkoutInfo");
  const orders = getOrders().filter(o => Number(o.tableNo) === Number(selectedTable) && o.status !== "已結帳");
  if (!selectedTable) {
    panel.innerHTML = `<h2>結帳</h2><p>請選擇桌號</p>`;
    return;
  }
  if (orders.length === 0) {
    panel.innerHTML = `<h2>第 ${selectedTable} 桌</h2><p>沒有未結帳訂單</p>`;
    return;
  }
  const total = orders.flatMap(o => o.items).reduce((sum, item) => sum + item.price, 0);
  panel.innerHTML = `
    <h2>第 ${selectedTable} 桌結帳</h2>
    <div class="notice">${orders.map(o => `<p>${formatItemList(o.items)}｜${o.status}</p>`).join("")}</div>
    <h3>總金額：$${total}</h3>
    <button onclick="checkout()">確認結帳</button>`;
}

function checkout() {
  let orders = getOrders();
  orders = orders.map(o => {
    if (Number(o.tableNo) === Number(selectedTable) && o.status !== "已結帳") {
      return { ...o, status: "已結帳", paidAt: new Date().toLocaleString() };
    }
    return o;
  });
  setOrders(orders);
  alert(`第 ${selectedTable} 桌已結帳`);
  selectedTable = null;
  renderTableGrid("tableGrid", "selectCheckoutTable", selectedTable);
  renderCheckoutInfo();
}

renderTableGrid("tableGrid", "selectCheckoutTable", selectedTable);
renderCheckoutInfo();
