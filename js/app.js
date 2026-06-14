const ROLE_TEXT = {
  waiter: "服務生",
  kitchen: "廚房",
  manager: "管理者"
};

const ROLE_PAGES = {
  waiter: ["order.html", "tables.html", "checkout.html", "orders.html", "members.html", "index.html"],
  kitchen: ["kitchen.html", "orders.html", "index.html"],
  manager: ["inventory.html", "tables.html", "checkout.html", "orders.html", "reports.html", "members.html", "settings.html", "index.html"]
};

const NAV_ITEMS = [
  { text: "點餐", href: "order.html" },
  { text: "廚房", href: "kitchen.html" },
  { text: "庫存", href: "inventory.html" },
  { text: "桌況", href: "tables.html" },
  { text: "結帳", href: "checkout.html" },
  { text: "訂單", href: "orders.html" },
  { text: "報表", href: "reports.html" },
  { text: "會員", href: "members.html" },
  { text: "設定", href: "settings.html" },
  { text: "登出", href: "index.html", logout: true }
];

function getRole() {
  return localStorage.getItem("role") || "";
}

function canOpen(page) {
  const role = getRole();
  if (page === "index.html") return true;
  return ROLE_PAGES[role] && ROLE_PAGES[role].includes(page);
}

function guardPage(allowedRoles) {
  const role = getRole();
  if (!role) {
    alert("請先登入");
    location.href = "index.html";
    return false;
  }
  if (!allowedRoles.includes(role)) {
    alert("此身分無法使用這個功能");
    if (role === "waiter") location.href = "order.html";
    else if (role === "kitchen") location.href = "kitchen.html";
    else location.href = "inventory.html";
    return false;
  }
  return true;
}

function renderNav(activePage) {
  const nav = document.getElementById("bottomNav");
  if (!nav) return;
  const role = getRole();
  nav.innerHTML = NAV_ITEMS.map(item => {
    const active = item.href === activePage ? "active" : "";
    const allowed = item.logout || (ROLE_PAGES[role] && ROLE_PAGES[role].includes(item.href));
    const disabled = allowed ? "" : "disabled";
    const href = allowed ? item.href : "#";
    const click = item.logout ? "onclick=\"logout()\"" : "";
    return `<a class="nav-key ${active} ${disabled}" href="${href}" ${click}>${item.text}</a>`;
  }).join("");
}

function logout() {
  localStorage.removeItem("role");
}

function roleLabel() {
  return ROLE_TEXT[getRole()] || "未登入";
}

function makeTableNumbers() {
  const tableNumbers = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 10; col++) {
      tableNumbers.push(col < 5 ? row * 10 + col + 1 : null);
    }
  }
  return tableNumbers;
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function setOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function getTableStatus(tableNo) {
  const orders = getOrders();
  const activeOrder = orders.find(o => Number(o.tableNo) === Number(tableNo) && o.status !== "完成" && o.status !== "已結帳");
  if (!activeOrder) return "空桌";
  if (activeOrder.status === "製作中") return "製作中";
  if (activeOrder.status === "可結帳") return "可結帳";
  return activeOrder.status || "使用中";
}

function renderTableGrid(containerId, onClickName, selectedTable) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  makeTableNumbers().forEach(no => {
    if (!no) {
      container.innerHTML += `<div class="grid-cell empty-cell"></div>`;
      return;
    }
    const status = getTableStatus(no);
    const selected = Number(selectedTable) === Number(no) ? "selected" : "";
    container.innerHTML += `
      <div class="table-cell ${selected}" onclick="${onClickName}(${no})">
        <div class="table-no">${no}</div>
        <div class="table-status">${status}</div>
      </div>`;
  });
}


function groupItems(items) {
  const grouped = {};
  (items || []).forEach(item => {
    if (!item) return;
    const key = item.id || item.name;
    if (!grouped[key]) grouped[key] = { ...item, qty: 0 };
    grouped[key].qty += 1;
  });
  return Object.values(grouped);
}

function formatItemList(items) {
  const groups = groupItems(items);
  if (groups.length === 0) return "無餐點";
  return groups.map(item => `${item.name} × ${item.qty}`).join("、");
}

function calcItemsTotal(items) {
  return (items || []).reduce((sum, item) => sum + (Number(item.price) || 0), 0);
}
