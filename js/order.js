if (guardPage(["waiter"])) {
  renderNav("order.html");
}

let cart = [];
let selectedTable = null;
let employeeNo = "";
let people = "";
const menu = JSON.parse(localStorage.getItem("menu")) || [];

function selectTable(no) {
  selectedTable = no;
  employeeNo = "";
  people = "";
  cart = [];
  document.getElementById("selectedTableText").textContent = `目前桌號：${no}`;
  document.getElementById("employeeText").textContent = "員工號 / 人數：尚未輸入";
  renderTableGrid("tableGrid", "selectTable", selectedTable);
  renderCart();
  lockOrderPanel();
  openEmployeeModal(no);
}

function openEmployeeModal(no) {
  document.getElementById("employeeModal").classList.remove("hidden");
  document.getElementById("modalTableText").textContent = `第 ${no} 桌`;
  document.getElementById("employeeNoInput").value = "";
  document.getElementById("peopleInput").value = "";
  document.getElementById("employeeError").textContent = "";
  setTimeout(() => document.getElementById("employeeNoInput").focus(), 50);
}

function cancelEmployeeInput() {
  document.getElementById("employeeModal").classList.add("hidden");
  selectedTable = null;
  employeeNo = "";
  people = "";
  cart = [];
  document.getElementById("selectedTableText").textContent = "目前桌號：尚未選擇";
  renderTableGrid("tableGrid", "selectTable", selectedTable);
  renderCart();
  lockOrderPanel();
}

function confirmEmployeeNo() {
  const input = document.getElementById("employeeNoInput");
  const peopleInput = document.getElementById("peopleInput");
  const error = document.getElementById("employeeError");
  const value = input.value.trim();
  const peopleValue = peopleInput.value.trim();

  if (!value) {
    error.textContent = "請輸入員工號，不能空白。";
    input.focus();
    return;
  }
  if (!/^\d{4,8}$/.test(value)) {
    error.textContent = "員工號格式錯誤，請輸入 4～8 位數字。";
    input.focus();
    return;
  }
  if (!/^\d+$/.test(peopleValue) || Number(peopleValue) < 1 || Number(peopleValue) > 20) {
    error.textContent = "人數格式錯誤，請輸入 1～20 的數字。";
    peopleInput.focus();
    return;
  }
  employeeNo = value;
  people = Number(peopleValue);
  document.getElementById("employeeModal").classList.add("hidden");
  document.getElementById("employeeText").textContent = `員工號：${employeeNo}｜人數：${people}`;
  unlockOrderPanel();
}

function lockOrderPanel() {
  document.getElementById("orderLockedPanel").classList.remove("hidden");
  document.getElementById("orderPanel").classList.add("hidden");
}

function unlockOrderPanel() {
  document.getElementById("orderLockedPanel").classList.add("hidden");
  document.getElementById("orderPanel").classList.remove("hidden");
}

function renderMenu() {
  const menuDiv = document.getElementById("menuButtons");
  menuDiv.innerHTML = "";
  menu.forEach(item => {
    menuDiv.innerHTML += `<button class="menu-btn" onclick="addToCart(${item.id})">${item.name}　$${item.price}</button>`;
  });
}

function addToCart(id) {
  if (!selectedTable) {
    alert("請先點選桌號");
    return;
  }
  if (!employeeNo || !people) {
    alert("請先輸入員工號與人數");
    openEmployeeModal(selectedTable);
    return;
  }
  const item = menu.find(m => m.id === id);
  if (!item) return;
  cart.push(item);
  renderCart();
}

function renderCart() {
  const cartUl = document.getElementById("cart");
  const total = calcItemsTotal(cart);
  cartUl.innerHTML = "";

  groupItems(cart).forEach(item => {
    cartUl.innerHTML += `
      <li>
        <span>${item.name} × ${item.qty}　$${item.price * item.qty}</span>
        <button onclick="removeOneItem(${item.id})">減 1</button>
      </li>`;
  });

  if (cart.length === 0) {
    cartUl.innerHTML = `<li>尚未加入餐點</li>`;
  }
  document.getElementById("totalText").textContent = `合計：$${total}`;
}

function removeOneItem(id) {
  const index = cart.findIndex(item => Number(item.id) === Number(id));
  if (index !== -1) cart.splice(index, 1);
  renderCart();
}

function submitOrder() {
  if (!selectedTable) {
    alert("請先點選桌號");
    return;
  }
  if (!employeeNo || !people) {
    alert("請先輸入員工號與人數");
    openEmployeeModal(selectedTable);
    return;
  }
  if (cart.length === 0) {
    alert("請先加入餐點");
    return;
  }

  let orders = getOrders();
  orders.push({
    tableNo: selectedTable,
    employeeNo: employeeNo,
    people: people,
    items: cart,
    status: "製作中",
    createdAt: new Date().toLocaleString(),
    createdAtMs: Date.now()
  });
  setOrders(orders);

  alert(`第 ${selectedTable} 桌訂單已送出`);
  cart = [];
  selectedTable = null;
  employeeNo = "";
  people = "";
  renderCart();
  document.getElementById("selectedTableText").textContent = "目前桌號：尚未選擇";
  document.getElementById("employeeText").textContent = "員工號 / 人數：尚未輸入";
  renderTableGrid("tableGrid", "selectTable", selectedTable);
  lockOrderPanel();
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !document.getElementById("employeeModal").classList.contains("hidden")) {
    confirmEmployeeNo();
  }
});

renderTableGrid("tableGrid", "selectTable", selectedTable);
renderMenu();
renderCart();
lockOrderPanel();
