if (guardPage(["waiter", "manager"])) {
  renderNav("tables.html");
}

function viewTable(no) {
  const orders = getOrders().filter(o => Number(o.tableNo) === Number(no) && o.status !== "已結帳");
  const info = document.getElementById("tableInfo");
  if (orders.length === 0) {
    info.innerHTML = `<h2>第 ${no} 桌</h2><p>目前空桌</p>`;
    return;
  }
  info.innerHTML = `<h2>第 ${no} 桌</h2>` + orders.map(o => `
    <div class="notice">
      <p>狀態：${o.status}</p>
      <p>員工號：${o.employeeNo || "未記錄"}</p>
      <p>餐點：${formatItemList(o.items)}</p>
      <p>進單時間：${o.createdAt || "未記錄"}</p>
    </div>`).join("");
}

renderTableGrid("tableGrid", "viewTable", null);
