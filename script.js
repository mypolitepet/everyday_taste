document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("cardGrid");
  const tagContainer = document.getElementById("tagFilters");
  const categoryButtons = document.querySelectorAll(".filter-buttons button");

  const modal = document.getElementById("addModal");
  const addButton = document.getElementById("addButton");
  const saveButton = document.getElementById("saveTaste");
  const modalTitle = document.getElementById("modalTitle");

  const typeInput = document.getElementById("typeInput");
  const titleInput = document.getElementById("titleInput");
  const descInput = document.getElementById("descInput");
  const thumbInput = document.getElementById("thumbInput");
  const tagsInput = document.getElementById("tagsInput");

  let allData = [];
  let currentCategory = "all";
  let currentTag = "all";
  let editTargetId = null;

 fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const localData = JSON.parse(localStorage.getItem("localTaste")) || [];
    allData = [...data, ...localData];
    applyFilters();
    renderTagFilters(allData);
  });

  function renderCards(data) {
    grid.innerHTML = "";
    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      const isLocal = item.id.startsWith("local-");

      card.innerHTML = `
        ${isLocal ? `<div class="card-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">×</button>
        </div>` : ""}
        <img src="${item.thumbnail}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="tags">
          ${item.tags.map(t => `<span>#${t}</span>`).join("")}
        </div>
      `;

      if (isLocal) {
        card.querySelector(".delete-btn").onclick = (e) => {
          e.stopPropagation();
          deleteCard(item.id);
        };

        card.querySelector(".edit-btn").onclick = (e) => {
          e.stopPropagation();
          openEditModal(item);
        };
      }
      card.onclick = () => {
        location.href = `detail.html?id=${item.id}`;
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
  let filtered = [...allData];

  if (currentCategory !== "all") {
    filtered = filtered.filter(item => item.type === currentCategory);
  }

  if (currentTag !== "all") {
    filtered = filtered.filter(item => item.tags.includes(currentTag));
  }

  renderCards(filtered);
}

  addButton.onclick = () => {
    openAddModal();
  };

  saveButton.onclick = () => {
    const tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);

    if (editTargetId) {
      const target = allData.find(item => item.id === editTargetId);
      target.type = typeInput.value;
      target.title = titleInput.value;
      target.description = descInput.value;
      target.thumbnail = thumbInput.value;
      target.tags = tags;
    } else {
      allData.push({
        id: "local-" + Date.now(),
        type: typeInput.value,
        title: titleInput.value,
        description: descInput.value,
        thumbnail: thumbInput.value,
        tags
      });
    }

    const localOnly = allData.filter(item => item.id.startsWith("local-"));
    localStorage.setItem("localTaste", JSON.stringify(localOnly));

    currentCategory = "all";
    currentTag = "all";

    closeModal();
    applyFilters();
    renderTagFilters(allData);
  };

 function deleteCard(id) {
  if (!confirm("삭제할까요?")) return;

  allData = allData.filter(item => item.id !== id);

  localStorage.setItem(
    "localTaste",
    JSON.stringify(allData.filter(i => i.id.startsWith("local-")))
  );

  applyFilters();
  renderTagFilters(allData);
}

  function openAddModal() {
    editTargetId = null;
    modalTitle.textContent = "취향 추가";
    typeInput.value = "music";
    titleInput.value = "";
    descInput.value = "";
    thumbInput.value = "";
    tagsInput.value = "";
    modal.classList.remove("hidden");
  }

  function openEditModal(item) {
    editTargetId = item.id;
    modalTitle.textContent = "취향 수정";
    typeInput.value = item.type;
    titleInput.value = item.title;
    descInput.value = item.description;
    thumbInput.value = item.thumbnail;
    tagsInput.value = item.tags.join(", ");
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
});





