if (guardPage(["manager"])) {
  renderNav("reports.html");
}

const orders = getOrders();
const paidOrders = orders.filter(o => o.status === "已結帳");
const revenue = paidOrders.flatMap(o => o.items).reduce((sum, item) => sum + item.price, 0);
const totalOrders = orders.length;
const unpaid = orders.filter(o => o.status !== "已結帳").length;

const reportGrid = document.getElementById("reportGrid");
const cards = [
  ["總訂單數", totalOrders],
  ["已結帳訂單", paidOrders.length],
  ["未結帳訂單", unpaid],
  ["營業額", `$${revenue}`]
];

cards.forEach(c => {
  reportGrid.innerHTML += `<div class="function-card"><h3 class="card-title">${c[0]}</h3><p class="table-no">${c[1]}</p></div>`;
});
for (let i = cards.length; i < 40; i++) reportGrid.innerHTML += `<div class="grid-cell empty-cell"></div>`;
