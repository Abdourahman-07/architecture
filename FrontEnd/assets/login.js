import { connectUser } from "./api.js";
import { setToken } from "./helpers.js";

async function responseApi(loginData) {
  try {
    return await connectUser(loginData);
  } catch (error) {
    const errorHtml = document.querySelector(".errorSubmit");
    errorHtml.innerHTML = `(service non opérationnel, veuillez réessayer ultérieurement)`;
  }
}

function getValuesLogin() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  return { email, password };
}

function responseManagement(response) {
  const errorHtml = document.querySelector(".errorSubmit");
  if (response.userId === undefined) {
    switch (response.message) {
      case undefined:
        errorHtml.innerHTML = "(Mot de passe incorrect)";
        break;
      case "user not found":
        errorHtml.innerHTML = "(Adresse mail non reconnue)";
        break;
    }
  } else {
    errorHtml.innerHTML = "";
    const token = response.token;
    setToken(token);
    window.location.replace("index.html");
    return token;
  }
}

function login() {
  const submitButton = document.querySelector("#form");
  submitButton.addEventListener("submit", async function (event) {
    event.preventDefault();
    const response = await responseApi(getValuesLogin());
    responseManagement(response);
  });
}

login();
