import { getWorks, getCategories } from "./api.js";
import { initEdit } from "./editWorks.js";
import { getToken, removeToken } from "./helpers.js";

function setErrorGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = `<p class="errorSubmit">(Service non opérationnel, veuillez rechargez la page ultérieurement)</p>`;
}

const createHtmlWork = (works) => {
  return works
    .map((work) => {
      return `<figure class="maFigure figure${work.id}">
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
        </figure>`;
    })
    .join("");
};

const displayWorks = (works) => {
  const htmlWork = createHtmlWork(works);
  const nodeGallery = document.querySelector(".gallery");
  nodeGallery.innerHTML = htmlWork;
};

function filterWorksByCategory(categoryBtn, works) {
  return works.filter((work) => work.category.name === categoryBtn);
}

const createHtmlCategories = (categories) => {
  return categories
    .map((categorie) => {
      return `<button class="filter filter${categorie.id}">${categorie.name}</button>`;
    })
    .join("");
};

const displayCategories = (categories) => {
  const htmlWork = createHtmlCategories(categories);
  const nodeFilters = document.querySelector(".filters");
  nodeFilters.innerHTML += htmlWork;
};

const resetStyleButtonFilter = (selectedButton) => {
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((otherButton) => {
    otherButton.classList.remove("filter-selected");
  });
  selectedButton.classList.add("filter-selected");
};

function listenFilters() {
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      try {
        const works = await getWorks();
        const categoryBtn = button.textContent;
        resetStyleButtonFilter(this);
        const filterWorks = filterWorksByCategory(categoryBtn, works);
        if (button.textContent !== "Tous") {
          displayWorks(filterWorks);
        } else {
          displayWorks(works);
        }
      } catch (error) {
        setErrorGallery();
      }
    });
  });
}

function listenLogoutBtn() {
  const logoutBtn = document.querySelector(".login");
  logoutBtn.addEventListener("click", function (event) {
    const edit = document.querySelector(".edit");
    const boxTitleEdit = document.querySelector(".box-titleEdit");
    const header = document.querySelector("header");
    const filters = document.querySelector(".filters");
    if (this.textContent === "logout") {
      event.preventDefault();
      removeToken();
      this.innerHTML = "login";
      edit.remove();
      boxTitleEdit.remove();
      header.classList.remove("headerEdit");
      filters.classList.remove("hide");
    }
  });
}

function checkLogin() {
  const loginLink = document.querySelector(".login");
  if (getToken()) {
    loginLink.innerHTML = "logout";
    initEdit();
  } else {
    loginLink.innerHTML = "login";
  }
}

const initApplication = async () => {
  try {
    const allWorks = await getWorks();
    const allCategories = await getCategories();
    displayWorks(allWorks);
    displayCategories(allCategories);
  } catch (error) {
    setErrorGallery();
  }

  listenFilters();
  checkLogin();
  listenLogoutBtn();
};

initApplication();
