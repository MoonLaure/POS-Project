if (guardPage(["manager"])) {
  renderNav("settings.html");
}

function clearOrders() {
  if (!confirm("確定要清除所有訂單紀錄嗎？")) return;
  localStorage.setItem("orders", JSON.stringify([]));
  alert("訂單已清除");
  location.reload();
}

function resetAll() {
  if (!confirm("確定要重置全部資料嗎？")) return;
  localStorage.clear();
  alert("資料已重置，請重新登入");
  location.href = "index.html";
}
