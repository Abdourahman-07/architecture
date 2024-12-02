const baseUrl = "http://localhost:5678/api";

export async function getWorks() {
  const worksApi = await fetch(`${baseUrl}/works`);
  return await worksApi.json(worksApi);
}

export async function getCategories() {
  const categoriesApi = await fetch(`${baseUrl}/categories`);
  return await categoriesApi.json(categoriesApi);
}
