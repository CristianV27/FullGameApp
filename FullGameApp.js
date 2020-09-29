var baseUrl = "https://games-world.herokuapp.com";

class ServerApi {
  static getGames() {
    fetch(baseUrl + "/games", { method: "GET" })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        const games = jsonResponse;
        games.forEach(function (game) {
          displayGame(game);
        });
      });
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

ServerApi.getGames();

const container = document.querySelector("#container");

function displayGame(game) {
  const gameDOM = createGameDOM(game);
  const deleteButton = createDeleteButton();

  deleteButton.addEventListener("click", function () {
    ServerApi.deleteGame(game._id)
      .then(function (response) {
        console.log(response);
        container.removeChild(gameDOM);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  container.appendChild(gameDOM);
  gameDOM.appendChild(deleteButton);
}

function createGameDOM(game) {
  const gameDOM = document.createElement("div");
  gameDOM.innerHTML = `
    <h3>${game.title}</h3>
    <p>${game.description}<p>`;

  gameDOM.classList.add("gamesList");

  return gameDOM;
}

function getGameData() {
  const gameTitle = document.querySelector("#gameTitle").value;
  const gameDescription = document.querySelector("#gameDescription").value;

  return {
    title: gameTitle,
    description: gameDescription,
  };
}

const addGameButton = document.querySelector("#addGameButton");
addGameButton.addEventListener("click", addGame);

function addGame() {
  const game = getGameData();
  ServerApi.saveGame(game)
    .then(function (response) {
      console.log(response);
      displayGame(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-button");
  return deleteButton;
}
