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
    menu.innerHTML = '<li><button class="filter-btn active" data-category="all">Tous</button></li>';

    fetch("http://localhost:5678/api/categories")
      .then((res) => res.json())
      .then((promise) => {
        menu.innerHTML += promise
          .map(
            (category) =>
              `<li><button class="filter-btn" data-category="${category.name}">${category.name}</button></li>
            `
          )
          .join("");

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