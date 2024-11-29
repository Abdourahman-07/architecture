import { getWorks } from "./api.js";

function addWorks(works) {
  const createHtmlWork = (works) => {
    return works
      .map((work) => {
        return `<figure><img src="${work.imageUrl}" alt="${work.title}" /><i class="fa-solid fa-trash-can"></i></figure>`;
      })
      .join("");
  };
  const htmlWork = createHtmlWork(works);
  const gallery = document.querySelector(".modale-gallery");
  gallery.innerHTML = htmlWork;
}

function listenCloseModale() {
  const closeIcon = document.querySelector(".box-modale .modale i");
  const modale = document.querySelector(".modale");
  closeIcon.addEventListener("click", () => {
    modale.remove();
  });
}

function listenAddPict() {
  const addBtn = document.querySelector(".add-picture");
  addBtn.addEventListener("click", () => {
    const modale = document.querySelector(".modale");
    modale.innerHTML = `<i class="fa-solid fa-xmark"></i>
      <h2 class="modale-title">Ajout photo</h2>
      <div class="picture">
        <i class="fa-regular fa-image"></i>
        <button>+ Ajouter photo</button>
        <p>jpg, png : 4mo max</p>
      </div>
      <div class="title"><label for="titleInp">Titre</label><input class="titleInp" type="text"></div>
      <div class="category"><label for="catInp">Catégorie</label><input class="catInp" type="text"></div>
      <hr></hr>
      <button class="valid-picture">Valider</button>`;
    listenCloseModale();
  });
}
//: todo: ne pas regénérer l'icone de fermeture

async function modale() {
  const allWorks = await getWorks();
  addWorks(allWorks);
  listenAddPict();
  listenCloseModale();
}

function setEditHtml() {
  const editBox = document.querySelector("#portfolio h2");
  const header = document.querySelector("header");
  const userToken = localStorage.getItem("localToken");
  if (userToken) {
    editBox.innerHTML +=
      '<a class="edit" href="#"><i class="fa-regular fa-pen-to-square"></i>modifier</a>';
    header.innerHTML +=
      '<div class="box-titleEdit"><span class="titleEdit"><i class="fa-regular fa-pen-to-square"></i>mode édition</span><div>';
    header.classList.add("headerEdit");
  }
}

function listenEditBtn() {
  const editBtn = document.querySelector(".edit");
  const box = document.querySelector(".box-modale");
  editBtn.addEventListener("click", (event) => {
    event.preventDefault();
    box.innerHTML +=
      '<div class="modale"><i class="fa-solid fa-xmark"></i><h2 class="modale-title">Gallerie photo</h2><div class="modale-gallery"></div><hr></hr><button class="add-picture">Ajouter une photo</button></div>';
    modale();
  });
}

export function initEdit() {
  setEditHtml();
  listenEditBtn();
}
