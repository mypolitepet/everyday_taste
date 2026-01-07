const params = new URLSearchParams(location.search);
const id = params.get("id");

const image = document.getElementById("detailImage");
const title = document.getElementById("detailTitle");
const desc = document.getElementById("detailDesc");
const tags = document.getElementById("detailTags");

Promise.all([
  fetch("data.json").then(r => r.json()),
  JSON.parse(localStorage.getItem("localTaste")) || []
]).then(([data, local]) => {
  const all = [...data, ...local];
  const item = all.find(i => i.id === id);

  if (!item) {
    title.textContent = "존재하지 않는 카드입니다";
    return;
  }

  image.src = item.image || item.thumbnail;
  title.textContent = item.title;
  desc.textContent = item.description;
  tags.innerHTML = item.tags.map(t => `<span>#${t}</span>`).join(" ");
});

