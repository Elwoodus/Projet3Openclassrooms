let worksData = [];


//Fonction permettant de récupérer l'array du serveur dans "works"


// Définition d'une fonction asynchrone nommée getWorks
async function getWorks() {
  // Récupération des données en utilisant l'API Fetch, à partir de l'URL http://localhost:5678/api/works
  return fetch("http://localhost:5678/api/works")
    .then(function (res) {
      // Vérification que la requête a réussi
      if (res.ok) {
        // Si la réponse est valide, renvoie les données au format JSON
        return res.json();
      }
    });
}

//Fonction permettant de récupérer l'array du serveur dans "categories"

async function getCategories() {
  return fetch("http://localhost:5678/api/categories")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
}

//===== AJOUT DES WORKS / Filtres =====//

// Définition d'une fonction asynchrone nommée worksDisplay
const worksDisplay = async () => {
  // Appel de la fonction asynchrone getWorks et assignation de la valeur retournée à la variable worksData
  const worksData = await getWorks();
  // Sélection de l'élément HTML ayant la classe "gallery" et assignation à la variable gallery
  const gallery = document.querySelector(".gallery");

  // Définition d'une fonction nommée displayWorks prenant en paramètre une chaîne de caractères et ayant une valeur par défaut de "all"
  const displayWorks = (category = "all") => {
    // Filtrage des éléments de worksData en fonction de la catégorie donnée en paramètre ou de tous les éléments si la catégorie est "all"
    const filteredWorks = worksData.filter(
      (work) => work.category.name === category || category === "all"
    );
    // Construction d'une chaîne de caractères HTML représentant les éléments filtrés et assignation à l'élément HTML gallery
    gallery.innerHTML = filteredWorks
      .map(
        (work) =>
          `<figure id="${work.id}" class="displayOn" data-${work.category.name}>
            <div id="${work.categoryId}"></div>
            <div id="${work.category.name}"></div>
            <div id="${work.userId}"></div>
            <img src="${work.imageUrl}" crossOrigin="anonymous"/>
            <figcaption>${work.title}</figcaption>
          </figure>`
      )
      .join("");
    // Sélection de tous les boutons ayant la classe "filter-btn" et assignation à la variable categoryButtons
    const categoryButtons = document.querySelectorAll(".filter-btn");
    // Pour chaque bouton, ajoute ou supprime la classe "active" en fonction de la catégorie donnée en paramètre ou de tous les éléments si la catégorie est "all"
    categoryButtons.forEach((button) => {
      if (button.dataset.category === category) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };

  // Définition d'une fonction nommée initMenu
  const initMenu = () => {
    // Sélection de l'élément HTML ayant la classe "btn-wrapper" et assignation à la variable menu
    const menu = document.querySelector(".btn-wrapper");
    // Suppression du contenu HTML de l'élément menu
    menu.innerHTML = '';
    // Appel de la fonction asynchrone getCategories
    getCategories()
      .then((categories) => {
        // Si l'utilisateur est connecté, filtre les catégories pour enlever celles ayant les noms "Objets", "Appartements" et "Hotels & restaurants"
        if (isLoggedIn) {
          categories = categories.filter((category) => category.name !== "Objets" && category.name !== "Appartements" && category.name !== "Hotels & restaurants");
        }                               
        // Construction d'une chaîne de caractères HTML représentant les boutons de catégories et assignation à la variable btnsHtml
        const btnsHtml = categories.map((category) =>
          `<li><button class="filter-btn" data-category="${category.name}">${category.name}</button></li>`
        ).join("");
        
        const allBtnHtml = !isLoggedIn ? '<li><button class="filter-btn" data-category="all">Tous</button></li>' : '';

        menu.innerHTML = `${allBtnHtml}${btnsHtml}`;

        const categoryButtons = document.querySelectorAll(".filter-btn");
        categoryButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const category = button.dataset.category;
            displayWorks(category);
          });
        });

        displayWorks();
      });
  };

  initMenu();
};

// Appel de la fonction worksDisplay
worksDisplay();


//Rend visible la bannière noir une fois connecté et ajoute le bouton modifier / ajoute également le bouton logout

let isLoggedIn = sessionStorage.getItem("isLoggedIn");
if (sessionStorage.getItem("isLoggedIn") === null) {
  isLoggedIn = false;
};

function displayContent() {

  if (isLoggedIn) {
    document.querySelector('.loginlink').innerHTML = "logout";
    document.querySelector('.header_admin_none').classList.replace("header_admin_none", "header_admin_visible");
    document.querySelector('.modifierAdd_none').classList.replace("modifierAdd_none", "modifierAdd_visible");

    //Génération du premier bouton "Modifier"
    document
      .getElementById("image_edit_location")
      .appendChild(createModifyingButton());

    //Génération du deuxième bouton "Modifier"
    document
      .getElementById("project_edit_location")
      .appendChild(createModifyingButton());

    //On rajoute au deuxième bouton la classe permettant d'ouvrir la modale
    document
      .querySelector("#project_edit_location button")
      .setAttribute("class", "edit js_modal");

    document.getElementById("loginId").addEventListener("click", myFunctionLogout);
  }

  else {
    document.querySelector('.loginlink').innerHTML = "login";
    document.querySelector('.loginlink').addEventListener("click", () => {
      location.assign("login.html");

    });
  };
};
displayContent();

function myFunctionLogout() {
  sessionStorage.clear();
  location.assign("index.html");
};



//Fonction permettant la création d'une carte d'oeuvre
function createCard(work, location) {
  let newFigure = document.createElement("figure");
  let newImg = document.createElement("img");
  let newFigcaption = document.createElement("figcaption");

  newFigure.appendChild(newImg);
  newFigure.appendChild(newFigcaption);

  newFigure.setAttribute("category", work.categoryId);

  newImg.setAttribute("crossorigin", "anonymous");
  newImg.setAttribute("src", work.imageUrl);
  newImg.setAttribute("alt", work.title);

  if (location === document.querySelector("#modal .gallery")) {
    newFigcaption.innerText = "éditer";

    let iconContainer = document.createElement("button");
    let icon = document.createElement("i");

    iconContainer.setAttribute("class", "icon_container");
    iconContainer.setAttribute("workid", work.id);
    icon.setAttribute("class", "fa-solid fa-trash-can");

    //Création de l'évènement de suppression d'un work lors du clic sur l'icône poubelle
    iconContainer.addEventListener("click", async function (e) {
      e.preventDefault();

      if (window.confirm("Voulez-vous vraiment supprimer ce travail ?")) {
        await deleteWorks(work.id);
        window.location.reload();
      }
    })

    newFigure.appendChild(iconContainer);
    iconContainer.appendChild(icon);
  }
  else {
    newFigcaption.innerText = work.title;
  }

  return newFigure;
}

//Fonction permettant de générer la galerie
async function createGallery(location) {
  const items = await getWorks();
  let gallery = location;

  for (i in items) {
    gallery.appendChild(this.createCard(items[i], location));
  }
}




// Fonction permettant de générer les catégories dans le champ select de la modale
function createSelectOption(category) {
  let newOption = document.createElement("option");

  newOption.setAttribute("category", category.id);

  newOption.innerText = category.name;

  return newOption;
}

async function generateSelectOptions() {
  const select = document.getElementById("category"); // utiliser l'id "category"
  const categories = await getCategories();

  categories.forEach((category) => {
    const option = createSelectOption(category);
    select.appendChild(option);
  });
}

generateSelectOptions();



//Fonction permettant de générer un bouton "Modifier"
function createModifyingButton(button) {
  button = document.createElement("button");
  button.setAttribute("class", "edit");
  button.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>Modifier"
  return button;
}

//Fonction permettant de créer une oeuvre sur l'API
async function postWork(image, title, category) {
  let data = new FormData();
  data.append("image", image);
  data.append("title", title);
  data.append("category", category);

  return await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    },
    body: data
  })
}

//Fonction permettant de supprimer une oeuvre de l'API
async function deleteWorks(id) {
  return fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionStorage.getItem("token")

    }
  });
}

//Création des galeries
createGallery(document.querySelector("#portfolio .gallery"));
createGallery(document.querySelector("#modal .gallery"));

//============ FENÊTRE MODALE ============

//initialisation de la variable qui stockera le chemin vers l'élément "modal"
let openedModal = null;

//Constante contenant une fonction permettant d'ouvir la modale
const openModal = function (event) {
  event.preventDefault();

  //Remise à zéro de la boîte modale
  document.getElementById("photo_gallery_page").removeAttribute("style", "display: none;");
  document.getElementById("add_photo_page").setAttribute("style", "display: none;");
  document.getElementById("js_modal_return").setAttribute("style", "display: none;");

  //Remise à zéro des champs de "add_photo_page"
  document.getElementById("photo_visualizer_text").removeAttribute("style", "display: none;");
  document.getElementById("photo_visualizer_img").setAttribute("style", "display: none;");
  document.getElementById("title").value = "";
  document.getElementById("category").value = "Objets";

  const modal = document.getElementById("modal");

  //Affichage de la boîte modale
  modal.style.display = null;

  modal.setAttribute("class", "opened");

  //Au clic en dehors de la modale ou sur le bouton "js_modal_close", la modale se ferme
  openedModal = modal;
  openedModal.addEventListener("click", closeModal);
  document.getElementById("js_modal_close").addEventListener("click", closeModal);
  document.querySelector(".js_modal_stop").addEventListener("click", stopPropagation);
}

//Constante contenant une fonction permettant de fermer la modale
const closeModal = function (event) {
  //Si la modal n'existe pas on s'arrête ici
  if (openedModal === null) return;

  event.preventDefault();

  //Fermeture de la boîte modale avec un décalage correspondant à la durée de l'animation CSS puis remise à zéro de la variable "openedModal"
  window.setTimeout(function () {
    openedModal.style.display = "none";
    openedModal = null;
  }, 500);

  modal.setAttribute("class", "closed");

  //Supression des évènements au clic
  openedModal.removeEventListener("click", closeModal);
  document.getElementById("js_modal_close").removeEventListener("click", closeModal);
  document.querySelector(".js_modal_stop").removeEventListener("click", stopPropagation);
}

//Constante contenant une fonction permettant de ne pas fermer la modale lors d'un clic à l'intérieur
const stopPropagation = function (event) {
  event.stopPropagation();
}

//On rajoute un évènement permettant d'exécuter la fonction contenue dans "openModal" à tous les éléments possédant la classe "js_modal"
document.querySelectorAll(".js_modal").forEach(button => {
  button.addEventListener("click", openModal)
});

//Fermeture de la modale lors de l'appui sur la touche "Echap"
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
})

//Au clic sur "Ajouter une photo", on cache la page actuelle et on affiche la suivante
document.getElementById("to_add_photo_page").addEventListener("click", function (event) {
  event.preventDefault();

  document.getElementById("photo_gallery_page").setAttribute("style", "display: none;");
  document.getElementById("add_photo_page").removeAttribute("style", "display: none;");
  document.getElementById("js_modal_return").removeAttribute("style", "display: none;");

  //Remise à zéro des champs de "add_photo_page"
  document.getElementById("photo_visualizer_text").removeAttribute("style", "display: none;");
  document.getElementById("photo_visualizer_img").setAttribute("style", "display: none;");
  document.getElementById("title").value = "";
  document.getElementById("category").value = "Objets";

});

//Au clic sur la flèche de retour, on cache la page actuelle et on affiche la précédente
document.getElementById("js_modal_return").addEventListener("click", function (event) {
  event.preventDefault();

  document.getElementById("photo_gallery_page").removeAttribute("style", "display: none;");
  document.getElementById("add_photo_page").setAttribute("style", "display: none;");
  document.getElementById("js_modal_return").setAttribute("style", "display: none;");
});

//Code gérant l'affichage des éléments et de la prévisualisation de la photo dans "photo_visualizer"
let addPhotoButton = document.getElementById("add_photo_button");
let chosenImage = document.getElementById("chosen_image");

addPhotoButton.onchange = () => {
  let reader = new FileReader();
  reader.readAsDataURL(addPhotoButton.files[0]);
  reader.onload = () => {
    document.getElementById("photo_visualizer_text").setAttribute("style", "display: none;");
    document.getElementById("photo_visualizer_img").removeAttribute("style", "display: none;");
    chosenImage.setAttribute("src", reader.result);
  }
}

//Au clic sur le bouton valider, appel à la fonction "postWork()" pour envoyer les informations rentrées au serveur
document.getElementById("validate_post_work").addEventListener("click", async function (event) {
  event.preventDefault();

  //Await sinon la page se reload avant d'avoir pu faire la requête
  await postWork(
    addPhotoButton.files[0],
    document.getElementById("title").value,
    document.getElementById("category").options[document.getElementById("category").selectedIndex].getAttribute("category")
  );

  window.location.reload();
});









