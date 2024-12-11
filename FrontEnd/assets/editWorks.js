import { getWorks } from "./api.js";
import { getCategories } from "./api.js";

function addWorks(works) {
  const gallery = document.querySelector(".modale-gallery");
  const createHtmlWork = (works) => {
    return works
      .map((work) => {
        return `<figure id="${work.id}"><img " src="${work.imageUrl}" alt="${work.title}" /><i class="fa-solid fa-trash-can"></i></figure>`;
      })
      .join("");
  };
  const htmlWork = createHtmlWork(works);
  gallery.innerHTML = htmlWork;
}

function closeModale() {
  const boxModale = document.querySelector(".box-modale");
  const modale = document.querySelector(".modale");
  modale.innerHTML = `<i class="fa-solid fa-xmark"></i>
    <h2 class="modale-title">Gallerie photo</h2>
    <div class="modale-gallery"></div>
    <hr></hr>
    <button class="add-picture">Ajouter une photo</button>`;
  boxModale.classList.add("hide");
}

function listenArrowBack() {
  const arrow = document.querySelector(".fa-arrow-left");
  arrow.addEventListener("click", () => {
    const modalePage = document.querySelector(".modale"); //en faire une seule fonction
    modalePage.innerHTML = `<i class="fa-solid fa-xmark"></i>
    <h2 class="modale-title">Gallerie photo</h2>
    <div class="modale-gallery"></div>
    <hr></hr>
    <button class="add-picture">Ajouter une photo</button>`;
    modale();
  });
}

function listenCloseModale() {
  const closeIcon = document.querySelector(".fa-xmark");
  const opacityBox = document.querySelector(".background-modale");
  closeIcon.addEventListener("click", () => {
    closeModale();
  });
  opacityBox.addEventListener("click", () => {
    closeModale();
  });
}

//https://developer.mozilla.org/fr/docs/Web/API/File_API/Using_files_from_web_applications

async function setPictureModale() {
  const modale = document.querySelector(".modale");
  modale.innerHTML = `<i class="fa-solid fa-arrow-left"></i><i class="fa-solid fa-xmark"></i>
    <h2 class="modale-title">Ajout photo</h2>
    <div class="picture">
      <i class="fa-regular fa-image"></i>
      <div class="box-new-picture hide"><img src="" alt="photo ajoutée" class="pictureShow"></div>
      <div class="fakeBtn"><span>+ Ajouter photo</span><input class="addPictBtn" type="file"></div>
      <p>jpg, png : 4mo max</p>
    </div>
    <div class="title"><label for="titleInp">Titre</label><input class="titleInp" type="text"></div>
    <div class="category"><label for="catInp">Catégorie</label><select class="catInp"></select></div>
    <hr></hr>
    <button class="valid-picture">Valider</button>`;
  const listCategories = document.querySelector("select");
  const allCategories = await getCategories();
  allCategories.forEach((categorie) => {
    const optionCategorie = `<option id="${categorie.id}">${categorie.name}</option>`;
    listCategories.innerHTML += optionCategorie;
  });
}

function listenInputPicture() {
  const input = document.querySelector(".addPictBtn");
  input.addEventListener("change", () => {
    const newPicture = input.files[0];
    const newPictureBox = document.querySelector(".box-new-picture");
    const newImage = document.querySelector(".pictureShow");
    const readerPict = new FileReader();
    readerPict.readAsDataURL(newPicture);
    readerPict.onload = (e) => {
      newPictureBox.classList.remove("hide");
      newImage.setAttribute("src", e.target.result);
      input.setAttribute("class", "addPictBtnNew");
    };
  });
}

async function addNewWork(title, category, image, tokenUser) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category + 1);

  const responseApi = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenUser}`,
    },
    body: formData,
  });
  const responseApiJson = await responseApi.json();

  console.log(responseApiJson);
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML += `<figure class="maFigure figure${responseApiJson.id}"><img src="${responseApiJson.imageUrl}" alt="${title}" /><figcaption>${title}</figcaption></figure>`;
}

function listenSubmit() {
  const submitBtn = document.querySelector(".valid-picture");
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const token = localStorage.getItem("localToken");
    const newTitle = document.querySelector(".titleInp").value;
    const list = document.querySelector("select");
    const categorySelected = list.selectedIndex;
    const newPicture = document.querySelector(".fakeBtn input").files[0];
    if (newTitle === "" || newPicture === undefined) {
      console.log("erreur, un champ est incomplet");
    } else {
      addNewWork(newTitle, categorySelected, newPicture, token);
      console.log();
      closeModale();
    }
  });
}

function listenAddPict() {
  const addBtn = document.querySelector(".add-picture");
  addBtn.addEventListener("click", () => {
    setPictureModale();
    listenArrowBack();
    listenCloseModale();
    listenInputPicture();
    listenSubmit();
  });
}

function deleteWork(idWork) {
  const figureToDelete = document.querySelector(`.figure${idWork}`);
  figureToDelete.remove();
}

function listenTrash() {
  const trashBox = document.querySelectorAll(".fa-trash-can");
  trashBox.forEach((trash) => {
    trash.addEventListener("click", (event) => {
      const trashElement = event.target;
      const id = trashElement.parentElement.id;
      const token = localStorage.getItem("localToken");
      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      closeModale();
      deleteWork(id);
    });
  });
}

async function modale() {
  const allWorks = await getWorks();
  addWorks(allWorks);
  listenCloseModale();
  listenAddPict();
  listenTrash();
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
  const boxModale = document.querySelector(".box-modale");
  editBtn.addEventListener("click", (event) => {
    event.preventDefault();
    boxModale.classList.remove("hide");
    modale();
  });
}

export function initEdit() {
  setEditHtml();
  listenEditBtn();
}
