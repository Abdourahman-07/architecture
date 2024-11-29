const baseUrl = "http://localhost:5678/api";

export async function getWorks() {
  const worksApi = await fetch(`http://localhost:5678/api/works`);
  return await worksApi.json(worksApi);
}
