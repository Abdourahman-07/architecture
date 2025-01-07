const baseUrl = "http://localhost:5678/api";

export async function getWorks() {
  const worksApi = await fetch(`${baseUrl}/works`);
  return await worksApi.json(worksApi);
}

export async function getCategories() {
  const categoriesApi = await fetch(`${baseUrl}/categories`);
  return await categoriesApi.json(categoriesApi);
}

export async function saveWork(tokenUser, formData) {
  const responseNewWork = await fetch(`${baseUrl}/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenUser}`,
    },
    body: formData,
  });
  return await responseNewWork.json(responseNewWork);
}

export async function deleteWork(token, id) {
  return await fetch(`${baseUrl}/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function connectUser(loginData) {
  const askingLogin = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  return await askingLogin.json(askingLogin);
}
