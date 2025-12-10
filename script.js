// Rick and Morty Explorer (versão sem "app")

// API base URL
const baseUrl = "https://rickandmortyapi.com/api/character";

// Get HTML elements
const searchInput   = document.querySelector("#searchInput");
const statusFilter  = document.querySelector("#statusFilter");
const genderFilter  = document.querySelector("#genderFilter");
const speciesFilter = document.querySelector("#speciesFilter");

const clearBtn  = document.querySelector("#clearBtn");
const randomBtn = document.querySelector("#randomBtn");

const cardContainer = document.querySelector("#cardContainer");

// Search and filter characters
function getCharacters() {
  clearCards();

  const url = new URL(baseUrl);
  const params = {};

  const name   = searchInput.value.trim();
  const status = statusFilter.value;
  const gender = genderFilter.value;
  const species = speciesFilter.value;

  if (name !== "") params.name = name;
  if (status !== "") params.status = status;
  if (gender !== "") params.gender = gender;
  if (species !== "") params.species = species;

  url.search = new URLSearchParams(params);

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("No characters found.");
      return res.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        showMessage("No characters found. Try something else.");
        return;
      }
      showCharacters(data.results);
    })
    .catch(() => {
      showMessage("There was a problem loading data.");
    });
}

// Show character cards
function showCharacters(characters) {
  clearCards();

  characters.forEach((character) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <h3>${character.name}</h3>
      <p>Status: ${character.status}</p>
      <p>Species: ${character.species}</p>
      <p>Gender: ${character.gender}</p>
    `;

    cardContainer.appendChild(card);
  });
}

// Show a random character
function getRandomCharacter() {
  clearCards();

  const maxId = 826;
  const randomId = Math.floor(Math.random() * maxId) + 1;

  fetch(`${baseUrl}/${randomId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Error loading random character.");
      return res.json();
    })
    .then((character) => showCharacters([character]))
    .catch(() => {
      showMessage("Could not load random character.");
    });
}

// Remove all cards
function clearCards() {
  cardContainer.innerHTML = "";
}

// Show a message
function showMessage(text) {
  clearCards();

  const msg = document.createElement("p");
  msg.classList.add("message");
  msg.textContent = text;

  cardContainer.appendChild(msg);
}

// Clear all filters
function clearFilters() {
  searchInput.value = "";
  statusFilter.value = "";
  genderFilter.value = "";
  speciesFilter.value = "";
  clearCards();
}

// Start the app and set up events
function init() {
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") getCharacters();
  });

  statusFilter.addEventListener("change", getCharacters);
  genderFilter.addEventListener("change", getCharacters);
  speciesFilter.addEventListener("change", getCharacters);

  clearBtn.addEventListener("click", clearFilters);
  randomBtn.addEventListener("click", getRandomCharacter);

  // Load characters at start
  getCharacters();
}

// Run app when HTML is loaded
document.addEventListener("DOMContentLoaded", init);
