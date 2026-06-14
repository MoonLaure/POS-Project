if (guardPage(["waiter", "manager"])) {
  renderNav("members.html");
}

let members = JSON.parse(localStorage.getItem("members")) || [];
const grid = document.getElementById("memberGrid");

function renderMembers() {
  grid.innerHTML = "";
  members.forEach((m, index) => {
    grid.innerHTML += `
      <div class="function-card">
        <div>
          <h3 class="card-title">${m.name}</h3>
          <p class="card-text">電話：${m.phone}</p>
          <p class="card-text">點數：${m.point}</p>
        </div>
        <button onclick="addPoint(${index})">加 1 點</button>
      </div>`;
  });
  for (let i = members.length; i < 40; i++) grid.innerHTML += `<div class="grid-cell empty-cell"></div>`;
}

function addMember() {
  const name = document.getElementById("memberName").value.trim();
  const phone = document.getElementById("memberPhone").value.trim();
  if (!name) return alert("請輸入會員姓名");
  members.push({ name, phone: phone || "未填", point: 0 });
  localStorage.setItem("members", JSON.stringify(members));
  location.reload();
}

function addPoint(index) {
  members[index].point += 1;
  localStorage.setItem("members", JSON.stringify(members));
  location.reload();
}

renderMembers();
