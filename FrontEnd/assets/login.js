const baseUrl = "http://localhost:5678/api";

async function responseApi(loginData) {
  try {
    const askingLogin = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    return await askingLogin.json();
  } catch (error) {
    const errorHtml = document.querySelector(".errorSubmit");
    errorHtml.innerHTML = `(service non opérationnel, veuillez réessayer ultérieurement)${error}`;
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
    console.log(token);
    localStorage.setItem("localToken", token);
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
