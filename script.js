document.addEventListener("DOMContentLoaded", () => {
const grid = document.getElementById("cardGrid");
const tagContainer = document.getElementById("tagFilters");
const categoryButtons = document.querySelectorAll(".filter-buttons button");

let allData = [];
let currentCategory = "all";
let currentTag = "all";

fetch("data.json")
  .then(res => res.json())
  .then(data => {
  const localData = JSON.parse(localStorage.getItem("localTaste")) || [];
  allData = [...data, ...localData];
  renderCards(allData);
  renderTagFilters(allData);
});

function renderCards(data) {
  grid.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.thumbnail}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="tags">
        ${item.tags.map(t => `<span>#${t}</span>`).join("")}
      </div>
    `;
    card.onclick = () => {
      location.href = \`detail.html?id=\${item.id}\`;
    };
    grid.appendChild(card);
  });
}

function renderTagFilters(data) {
  const tags = new Set();
  data.forEach(item => item.tags.forEach(tag => tags.add(tag)));

  tagContainer.innerHTML = `<button data-tag="all" class="active">전체 태그</button>`;

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = `#${tag}`;
    btn.dataset.tag = tag;
    tagContainer.appendChild(btn);
  });

  tagContainer.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      currentTag = btn.dataset.tag;
      tagContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    };
  });
}

categoryButtons.forEach(btn => {
  btn.onclick = () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.filter;
    applyFilters();
  };
});

function applyFilters() {
  let filtered = allData;
  if (currentCategory !== "all") {
    filtered = filtered.filter(item => item.type === currentCategory);
  }
  if (currentTag !== "all") {
    filtered = filtered.filter(item => item.tags.includes(currentTag));
  }
  renderCards(filtered);
}
const addButton = document.getElementById("addButton");
const modal = document.getElementById("addModal");
const saveButton = document.getElementById("saveTaste");

addButton.onclick = () => {
  modal.classList.remove("hidden");
};

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
};

saveButton.onclick = () => {
  const newItem = {
    id: "local-" + Date.now(),
    type: document.getElementById("typeInput").value,
    title: document.getElementById("titleInput").value,
    description: document.getElementById("descInput").value,
    thumbnail: document.getElementById("thumbInput").value,
    tags: document.getElementById("tagsInput").value.split(",").map(t => t.trim())
  };

  allData.push(newItem);
  localStorage.setItem("localTaste", JSON.stringify(allData));

  renderCards(allData);
  renderTagFilters(allData);
  modal.classList.add("hidden");
};
});
