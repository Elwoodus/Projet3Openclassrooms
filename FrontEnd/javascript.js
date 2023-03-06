let worksData = [];

const fetchWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((promise) => {
      worksData = promise;
    });
};

const worksDisplay = async () => {
  await fetchWorks();

  const displayWorks = (category = "all") => {
    const gallery = document.querySelector(".gallery");
    const filteredWorks = worksData.filter(
      (work) => work.category.name === category || category === "all"
    );

    gallery.innerHTML = filteredWorks
      .map(
        (work) =>
          `<figure id="${work.id}" class="displayOn" data-${work.category.name}>
            <div id="${work.categoryId}"></div>
            <div id="${work.category.name}"></div>
            <div id="${work.userId}"></div>
            <img src="${work.imageUrl}" crossOrigin="anonymous"/>
            <figcaption>${work.title}</figcaption>
          </figure>
        `
      )
      .join("");

    // Ajoute la classe "active" au bouton sélectionné
    const categoryButtons = document.querySelectorAll(".filter-btn");
    categoryButtons.forEach((button) => {
      if (button.dataset.category === category) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };

  const initMenu = () => {
    const menu = document.querySelector(".btn-wrapper");
    menu.innerHTML = '';
  
    fetch("http://localhost:5678/api/categories")
      .then((res) => res.json())
      .then((promise) => {
        if (isLoggedIn) {
          promise = promise.filter((category) => {
            return category.name !== "Objets" && category.name !== "Appartements" && category.name !== "Hotels & restaurants";
          });
        }
        
        menu.innerHTML += promise
          .map(
            (category) =>
              `<li><button class="filter-btn" data-category="${category.name}">${category.name}</button></li>
            `
          )
          .join("");
  
        if (!isLoggedIn) {
          menu.innerHTML = `<li><button class="filter-btn" data-category="all">Tous</button></li>${menu.innerHTML}`;
        }
  
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

worksDisplay();


//Rend visible la bannière noir une fois connecté

let isLoggedIn = sessionStorage.getItem("isLoggedIn");
	if (sessionStorage.getItem("isLoggedIn") === null) {
			isLoggedIn = false;
	};

function displayContent() {
	
	if (isLoggedIn) {
		document.querySelector('.loginlink').innerHTML = "logout";
		document.querySelector('.header_admin_none').classList.replace("header_admin_none", "header_admin_visible");
	  document.querySelector('.modifierAdd_none').classList.replace("modifierAdd_none", "modifierAdd_visible");
    document.getElementById("loginId").addEventListener("click", myFunctionLogout);
	  }
	
	else {
		document.querySelector('.loginlink').innerHTML = "login";
		document.querySelector('.loginlink').addEventListener("click",()=>{
      location.assign("login.html"); 

    });
	};
};
displayContent();
  

		
function myFunctionLogout() {
		sessionStorage.clear();
    location.assign("index.html");
};

		


