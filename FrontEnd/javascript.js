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
        // Si l'utilisateur n'est pas connecté, ajoute un bouton "Tous"
        // Sinon, ne montre pas ce bouton
        const allBtnHtml = !isLoggedIn ? '<li><button class="filter-btn" data-category="all">Tous</button></li>' : '';
        // Ajoute le HTML des boutons de catégorie au menu
        // Utilise la chaîne de caractères générée précédemment pour les boutons de catégorie
        menu.innerHTML = `${allBtnHtml}${btnsHtml}`;
        // Sélectionne tous les boutons de catégorie
        const categoryButtons = document.querySelectorAll(".filter-btn");
        // Ajoute un écouteur d'événement "click" à chaque bouton de catégorie
        // Lorsqu'un bouton est cliqué, appelle la fonction 'displayWorks' en lui passant la catégorie correspondante
        categoryButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const category = button.dataset.category;
            displayWorks(category);
          });
        });
        // Appelle la fonction 'displayWorks' sans argument pour afficher tous les travaux par défaut

        displayWorks();
      });
  };
  //Cette fonction est appelée au chargement de la page et permet de mettre en place l'interface utilisateur en créant les boutons de filtre pour les catégories de travaux et en y ajoutant des écouteurs d'événements pour l'utilisateur.

  initMenu();
};

// Appelle la fonction 'worksDisplay' pour démarrer l'application
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

    //Génération du troisième bouton "Modifier"
    document
      .getElementById("thirdbutton1")
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

  // Création d'un élément HTML <figure>
  let newFigure = document.createElement("figure");

  // Création d'un élément HTML <img>
  let newImg = document.createElement("img");

  // Création d'un élément HTML <figcaption>
  let newFigcaption = document.createElement("figcaption");

  // Ajout des éléments <img> et <figcaption> à l'élément <figure>
  newFigure.appendChild(newImg);
  newFigure.appendChild(newFigcaption);

  // Ajout d'un attribut "category" à l'élément <figure>, dont la valeur est l'ID de la catégorie du travail
  newFigure.setAttribute("category", work.categoryId);

  // Ajout d'attributs à l'élément <img>
  newImg.setAttribute("crossorigin", "anonymous");
  newImg.setAttribute("src", work.imageUrl);
  newImg.setAttribute("alt", work.title);

  // Si l'emplacement est la galerie modale
  if (location === document.querySelector("#modal .gallery")) {

    // Ajout du texte "éditer" à l'élément <figcaption>
    newFigcaption.innerText = "éditer";

    // Création d'un élément HTML <button> pour contenir l'icône de suppression
    let iconContainer = document.createElement("button");

    // Création d'un élément HTML <i> pour l'icône de suppression
    let icon = document.createElement("i");

    // Ajout de deux attributs à l'élément <button> pour stocker l'ID du travail
    iconContainer.setAttribute("class", "icon_container");
    iconContainer.setAttribute("workid", work.id);

    // Ajout de deux classes à l'élément <i> pour afficher l'icône de suppression
    icon.setAttribute("class", "fa-solid fa-trash-can");

    //Création de l'évènement de suppression d'un work lors du clic sur l'icône poubelle
    iconContainer.addEventListener("click", async function (e) {
      e.preventDefault();
    
      // Affiche une fenêtre de confirmation pour demander à l'utilisateur s'il veut vraiment supprimer le travail.
      if (window.confirm("Voulez-vous vraiment supprimer ce travail ?")) {
        // Si l'utilisateur clique sur OK dans la fenêtre de confirmation, supprime le travail en appelant la fonction deleteWorks() avec l'ID du travail.
        const reponseDelete = await deleteWorks(work.id);
        //Ajout de createGallery dans la constante reponseDelete 
        createGallery(document.querySelector("#portfolio .gallery"));
        createGallery(document.querySelector("#modal .gallery"));
       
        console.log (reponseDelete)
        
        
        
      }
    })
    // Ajout du conteneur d'icône à l'élément figure.
    newFigure.appendChild(iconContainer);
    // Ajout de l'icône à son conteneur.
    iconContainer.appendChild(icon);
  }
  else {
    // Si aucune image n'est disponible pour le travail, ajoute simplement le titre du travail à la balise figcaption.
    newFigcaption.innerText = work.title;
  }
  // Retourne l'élément figure créé, avec l'image et l'icône poubelle si disponibles, ou avec le titre du travail si aucune image n'est disponible.
  return newFigure;
}

//Fonction permettant de générer la galerie
async function createGallery(location) {
  location.innerHTML = ""
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

// Fonction permettant de créer une oeuvre sur l'API
async function postWork(image, title, category) {
  // Création d'un objet FormData
  let data = new FormData();
  // Ajout des données (image, titre, catégorie) à l'objet FormData
  data.append("image", image);
  data.append("title", title);
  data.append("category", category);

  // Envoi d'une requête POST à l'API pour créer une nouvelle oeuvre
  return await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      // Ajout du token d'authentification à l'en-tête de la requête
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    },
    body: data // Ajout des données à la requête
  })
}

// Fonction permettant de supprimer une oeuvre de l'API
async function deleteWorks(id) {
  // Envoi d'une requête DELETE à l'API pour supprimer l'oeuvre avec l'ID spécifié
  return fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      // Spécification du type de données acceptées par l'API
      "Accept": "application/json",
      // Spécification du type de données envoyées dans le corps de la requête
      "Content-Type": "application/json",
      // Ajout du token d'authentification à l'en-tête de la requête
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  });
}

//Création des galeries , crée une galerie d'images à l'emplacement spécifié dans le document HTML.
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

  //Ajout de createGallery dans awaitpostWork 
  createGallery(document.querySelector("#portfolio .gallery"));
  createGallery(document.querySelector("#modal .gallery"));

  
});

// Ajoute un écouteur d'événements pour le changement de fichier dans le bouton "Ajouter une photo"
addPhotoButton.addEventListener("change",function changefile(){
  if (addPhotoButton.value !== null){ // Si un fichier est sélectionné, définir la variable imageExist sur true
    imageExist = true
  }else{ // Sinon, définir la variable imageExist sur false
    imageExist = false
  }
  activeButton(imageExist, titleExist) 
  console.log (addPhotoButton.value) 
})

// Récupère l'élément de titre et ajoute un écouteur d'événements pour l'entrée d'informations
let titreAddValidation = document.getElementById('title');
titreAddValidation.addEventListener("input",function changefile(){
  if (titreAddValidation.value !== ""){ 
    titleExist = true
  }else{ 
    titleExist = false
  }
  activeButton(imageExist, titleExist) // Appelle la fonction activeButton avec les variables imageExist et titleExist
  console.log (titreAddValidation.value) // Affiche la valeur de l'entrée de titre dans la console
})

let imageExist = false // Initialise la variable imageExist à false
let titleExist = false 

// Définit la fonction activeButton pour activer ou désactiver le bouton "Valider" en fonction des variables imageExist et titleExist
function activeButton(imageExist, titleExist){
  if (imageExist && titleExist){ // Si les deux variables sont true, activer le bouton "Valider"
    document.getElementById("validate_post_work").classList.remove("validate_button_off");
    document.getElementById("validate_post_work").classList.add("validate_button_on");
    document.getElementById("validate_post_work").removeAttribute("disabled")
  }else{ // Sinon, désactiver le bouton "Valider"
    document.getElementById("validate_post_work").classList.remove("validate_button_on");
    document.getElementById("validate_post_work").classList.add("validate_button_off");
    document.getElementById("validate_post_work").setAttribute("disabled", "" )
  }
}












