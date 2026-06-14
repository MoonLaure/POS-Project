function login(){
  const roleSelect = document.getElementById("role");
  if(!roleSelect){
    alert("找不到身分選單，請確認 index.html 是否完整解壓縮。");
    return;
  }

  const role = roleSelect.value;
  if(!role){
    alert("請先選擇登入身分");
    return;
  }

  localStorage.setItem("role", role);

  if(role === "waiter") window.location.href = "order.html";
  else if(role === "kitchen") window.location.href = "kitchen.html";
  else if(role === "manager") window.location.href = "inventory.html";
  else alert("身分設定錯誤，請重新選擇。");
}

window.login = login;
