var baseUrl = "https://games-world.herokuapp.com";

class ServerApi {
  static async getGames() {
    const response = await fetch(baseUrl + "/games", { method: "GET" });
    return response.json();
  }

  static async saveGame(game) {
    const response = await fetch(baseUrl + "/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      },
      body: `title=${game.title}&description=${game.description}`,
    });
    return response.json();
  }

  static async deleteGame(gameId) {
    const response = await fetch(baseUrl + `/games/${gameId}`, {
      method: "DELETE",
    });
    return response.text();
  }
}

class GameDOM {
  constructor(title, description, _id) {
    this.title = title;
    this.description = description;
    this.id = _id;
  }

  createGameDOM() {
    const gameDOM = document.createElement("div");
    gameDOM.innerHTML = `
      <h3>${this.title}</h3>
      <p>${this.description}<p>`;

    gameDOM.classList.add("gamesList");

    return gameDOM;
  }
}

displayGames();

const container = document.querySelector("#container");

async function displayGames() {
  try {
    const games = await ServerApi.getGames();
    console.log(games);

    games.forEach(function (game) {
      const gameDOM = new GameDOM(game.title, game.description).createGameDOM();
      const deleteButton = createDeleteButton();
      deleteButton.addEventListener("click", function () {
        ServerApi.deleteGame(game._id).then(function (response) {
          console.log(response);
          container.removeChild(gameDOM);
        });
      });
      gameDOM.appendChild(deleteButton);
      container.appendChild(gameDOM);
    });
  } catch (error) {
    console.log(error);
    container.innerHTML = "Server error";
  }
}

const addGameButton = document.querySelector("#addGameButton");
addGameButton.addEventListener("click", addGame);

function addGame() {
  const game = getGameData();
  const container = document.querySelector("#container");
  container.innerHTML = "";
  ServerApi.saveGame(game)
    .then(function (response) {
      console.log(response);
      displayGames(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getGameData() {
  const gameTitle = document.querySelector("#gameTitle").value;
  const gameDescription = document.querySelector("#gameDescription").value;

  return {
    title: gameTitle,
    description: gameDescription,
  };
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-button");
  return deleteButton;
}
