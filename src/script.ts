const app: any = {
  baseUrl: "https://rickandmortyapi.com/api/character",
  elements: {}
};

// Defining app elements
app.elements.searchInput = document.querySelector("#searchInput") as HTMLInputElement;
app.elements.statusFilter = document.querySelector("#statusFilter") as HTMLSelectElement;
app.elements.genderFilter = document.querySelector("#genderFilter") as HTMLSelectElement;
app.elements.speciesFilter = document.querySelector("#speciesFilter") as HTMLSelectElement;
app.elements.clearBtn = document.querySelector("#clearBtn") as HTMLButtonElement;
app.elements.searchBtn = document.querySelector("#searchBtn") as HTMLButtonElement;
app.elements.randomBtn = document.querySelector("#randomBtn") as HTMLButtonElement;
app.elements.cardContainer = document.querySelector("#cardContainer") as HTMLDivElement;

// Clears all cards from the container
app.clearCards = () => {
  app.elements.cardContainer.innerHTML = "";
};

// Shows a message in the card container
app.showMessage = (text: string) => {
  app.clearCards();

  const msg: HTMLParagraphElement = document.createElement("p");
  msg.classList.add("message");
  msg.textContent = text;

  app.elements.cardContainer.appendChild(msg);
};

// Renders character cards to the DOM
app.showCharacters = (characters: any[]) => {
  app.clearCards();

  characters.forEach((character: any) => {
    const card: HTMLDivElement = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <h3>${character.name}</h3>
      <p>Status: ${character.status}</p>
      <p>Species: ${character.species}</p>
      <p>Gender: ${character.gender}</p>
    `;

    app.elements.cardContainer.appendChild(card);
  });
};

// Fetches characters based on search filters
app.getCharacters = async () => {
  app.clearCards();

  const url: URL = new URL(app.baseUrl);
  const params: any = {};

  const name: string = app.elements.searchInput.value.trim();
  const status: string = app.elements.statusFilter.value;
  const gender: string = app.elements.genderFilter.value;
  const species: string = app.elements.speciesFilter.value;

  if (name !== "") params.name = name;
  if (status !== "") params.status = status;
  if (gender !== "") params.gender = gender;
  if (species !== "") params.species = species;

  url.search = new URLSearchParams(params).toString();

  try {
    const res: Response = await fetch(url.toString());

    if (res.status === 429) {
      app.showMessage("Too many requests. Please wait a few seconds.");
      return;
    }

    if (!res.ok) {
      app.showMessage("No characters found.");
      return;
    }

    const data: any = await res.json();

    if (!data.results || data.results.length === 0) {
      app.showMessage("No characters found.");
      return;
    }

    app.showCharacters(data.results);

  } catch (err) {
    app.showMessage("There was a problem loading data.");
  }
};

// Fetches a single random character
app.getRandomCharacter = async () => {
  app.clearCards();

  const maxId: number = 826;
  const randomId: number = Math.floor(Math.random() * maxId) + 1;

  try {
    const res: Response = await fetch(`${app.baseUrl}/${randomId}`);

    if (!res.ok) {
      app.showMessage("Could not load random character.");
      return;
    }

    const character: any = await res.json();
    app.showCharacters([character]);

  } catch (err) {
    app.showMessage("Could not load random character.");
  }
};

// Clears all filters and reloads default characters
app.clearFilters = () => {
  app.elements.searchInput.value = "";
  app.elements.statusFilter.value = "";
  app.elements.genderFilter.value = "";
  app.elements.speciesFilter.value = "";
  app.getCharacters();
};

// Attaches event listeners and loads initial characters
app.init = () => {
  app.elements.searchInput.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") app.getCharacters();
  });

  app.elements.searchBtn.addEventListener("click", () => app.getCharacters());
  app.elements.clearBtn.addEventListener("click", () => app.clearFilters());
  app.elements.randomBtn.addEventListener("click", () => app.getRandomCharacter());

  app.getCharacters();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", app.init);
} else {
  app.init();
}