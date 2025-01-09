import { getWorks, saveWork, getCategories, deleteWork } from "./api.js";
import { getToken } from "./helpers.js";

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

function setFirstPageModale() {
  const modale = document.querySelector(".modale");
  modale.innerHTML = `<i class="fa-solid fa-xmark"></i>
    <h2 class="modale-title">Gallerie photo</h2>
    <div class="modale-gallery"></div>
    <hr></hr>
    <button class="add-picture">Ajouter une photo</button>
    <div class="confMes-hide"><p>Êtes vous sûr de votre choix ?</p><button class="delete">Supprimer</button><button class="no-delete">Annuler</button></div>`;
}

function closeModale() {
  const boxModale = document.querySelector(".box-modale");
  setFirstPageModale();
  boxModale.classList.add("hide");
}

function listenArrowBack() {
  const arrow = document.querySelector(".fa-arrow-left");
  arrow.addEventListener("click", () => {
    setFirstPageModale();
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

async function setPictureModale() {
  const modale = document.querySelector(".modale");
  modale.innerHTML = `<i class="fa-solid fa-arrow-left"></i><i class="fa-solid fa-xmark"></i>
    <h2 class="modale-title">Ajout photo</h2>
    <div class="picture">
      <i class="fa-regular fa-image"></i>
      <div class="box-new-picture hide"><img src="" alt="photo ajoutée" class="pictureShow"></div>
      <div class="fakeBtn"><span>+ Ajouter photo</span><input class="addPictBtn" type="file" accept=".jpg, .png"></div>
      <p>jpg, png : 4mo max</p>
    </div>
    <div class="title"><label for="titleInp">Titre</label><input class="titleInp" type="text"></div>
    <div class="category"><label for="catInp">Catégorie</label><select class="catInp"></select></div>
    <hr></hr>
    <button class="valid-picture valid-picture-disabled">Valider</button>
    <p class="errorSubmit hide">(Assurez vous d'ajouter une image valide ainsi qu'un titre à votre projet.)</p>`;
  const listCategories = document.querySelector("select");
  try {
    const allCategories = await getCategories();
    allCategories.forEach((categorie) => {
      const optionCategorie = `<option id="${categorie.id}">${categorie.name}</option>`;
      listCategories.innerHTML += optionCategorie;
    });
  } catch (error) {
    const galleryModale = document.querySelector(".modale");
    galleryModale.innerHTML += `<p class="errorSubmit">(Service non opérationnel, veuillez rechargez la page ultérieurement)</p>`;
  }
}

function listenInputPicture() {
  const input = document.querySelector(".addPictBtn");
  input.addEventListener("change", () => {
    const maxSizeFile = 4 * 1024 * 1024;
    const newPicture = input.files[0];
    if (
      newPicture.size <= maxSizeFile &&
      (newPicture.name.endsWith(".png") || newPicture.name.endsWith(".jpg"))
    ) {
      const newPictureBox = document.querySelector(".box-new-picture");
      const newImage = document.querySelector(".pictureShow");
      const readerPict = new FileReader();
      readerPict.readAsDataURL(newPicture);
      readerPict.onload = (e) => {
        newPictureBox.classList.remove("hide");
        newImage.setAttribute("src", e.target.result);
        input.setAttribute("class", "addPictBtnNew");
      };
    } else {
      input.value = null;
    }
  });
}

async function addNewWork(title, category, image, token) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category + 1);
  try {
    const responseApiJson = await saveWork(token, formData);
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML += `<figure class="maFigure figure${responseApiJson.id}"><img src="${responseApiJson.imageUrl}" alt="${title}" /><figcaption>${title}</figcaption></figure>`;
    closeModale();
  } catch (error) {
    const pictureModale = document.querySelector(".modale");
    pictureModale.innerHTML += `<p class="errorSubmit">(Service non opérationnel, veuillez rechargez la page ultérieurement)</p>`;
  }
}

function safeString(string) {
  return string.replace(/[=.<>/]/g, "");
}

function listenSubmit() {
  const submitBtn = document.querySelector(".valid-picture");
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const newTitle = document.querySelector(".titleInp").value;
    const list = document.querySelector("select");
    const categorySelected = list.selectedIndex;
    const newPicture = document.querySelector(".fakeBtn input").files[0];
    if (newTitle.trim() && newPicture !== undefined) {
      addNewWork(
        safeString(newTitle),
        categorySelected,
        newPicture,
        getToken()
      );
    } else {
      const pictureModale = document.querySelector(".modale .errorSubmit");
      pictureModale.classList.remove("hide");
    }
  });
}

function styleSubmit() {
  const inputs = document.querySelectorAll(".modale input");
  const submitBtn = document.querySelector(".valid-picture");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      let allInputsFilled = true;
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          allInputsFilled = false;
        }
      });
      if (allInputsFilled) {
        submitBtn.setAttribute("class", "valid-picture-enabled");
      } else {
        submitBtn.setAttribute("class", "valid-picture-disabled");
      }
    });
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
    styleSubmit();
  });
}

function deleteWorkHtml(idWork) {
  const figureToDelete = document.querySelector(`.figure${idWork}`);
  figureToDelete.remove();
}

async function listenDeleteBtn(event) {
  const trashElement = event.target;
  const id = trashElement.parentElement.id;
  try {
    await deleteWork(getToken(), id);
    deleteWorkHtml(id);
    closeModale();
  } catch (error) {
    const confirmataionMessage = document.querySelector(".confMes");
    confirmataionMessage.innerHTML = `<p class="errorSubmit">(Service non opérationnel, veuillez rechargez la page ultérieurement)</p>`;
  }
}

function listenTrash() {
  const trashBox = document.querySelectorAll(".fa-trash-can");
  trashBox.forEach((trash) => {
    trash.addEventListener("click", (event) => {
      const confMessageSelected = document.querySelector(".confMes-hide");
      confMessageSelected.setAttribute("class", "confMes");
      const deleteBtn = document.querySelector(".delete");
      const noDeleteBtn = document.querySelector(".no-delete");
      deleteBtn.addEventListener("click", () => {
        listenDeleteBtn(event);
      });
      noDeleteBtn.addEventListener("click", () => {
        confMessageSelected.setAttribute("class", "confMes-hide");
      });
    });
  });
}

async function modale() {
  try {
    const allWorks = await getWorks();
    addWorks(allWorks);
  } catch (error) {
    const galleryModale = document.querySelector(".modale");
    galleryModale.innerHTML += `<p class="errorSubmit">(Service non opérationnel, les projets ne peuvent s'afficher, veuillez rechargez la page ultérieurement)</p>`;
  }

  listenCloseModale();
  listenAddPict();
  listenTrash();
}

function setEditHtml() {
  const editBox = document.querySelector("#portfolio h2");
  const header = document.querySelector("header");
  const filters = document.querySelector(".filters");
  if (getToken()) {
    editBox.innerHTML +=
      '<a class="edit" href="#"><i class="fa-regular fa-pen-to-square"></i>modifier</a>';
    header.innerHTML +=
      '<div class="box-titleEdit"><span class="titleEdit"><i class="fa-regular fa-pen-to-square"></i>mode édition</span><div>';
    header.classList.add("headerEdit");
    filters.classList.add("hide");
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
