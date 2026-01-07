const params = new URLSearchParams(location.search);
const id = params.get("id");
const container = document.getElementById("detail");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const item = data.find(i => i.id === id);
    if (!item) return;

    if (item.type === "music") {
      container.innerHTML = `
        <h1>${item.title}</h1>
        <iframe src="https://www.youtube.com/embed/${item.youtubeId}" allowfullscreen></iframe>
        <p>${item.description}</p>
      `;
    } else {
      container.innerHTML = `
        <h1>${item.title}</h1>
        <img src="${item.image}">
        <p>${item.description}</p>
      `;
    }
  });
