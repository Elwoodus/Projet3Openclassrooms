// On crée un objet 'form' qui contient des références aux éléments HTML de notre formulaire
const form = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  submit: document.getElementById('submit'),
  errorMessage: document.getElementById('error-message'),
};

// On ajoute un écouteur d'événement sur le bouton 'submit' du formulaire
let button = form.submit.addEventListener("click", (e) => {
  // On empêche l'action par défaut du bouton 'submit' qui est de recharger la page
  e.preventDefault();
  // On crée une variable qui contient l'URL de l'API de connexion
  const login = "http://localhost:5678/api/users/login";

  // On utilise l'API Fetch pour envoyer les informations de connexion à l'API de connexion
  fetch(login, {
    method: "POST", // On utilise la méthode HTTP POST pour envoyer les données
    headers: {
      'Accept': 'application/json, text/plain, */*', // On spécifie le type de données qu'on attend en retour
      'Content-Type': 'application/json', // On spécifie le type de données qu'on envoie dans la requête
    },
    body: JSON.stringify({ // On envoie les données de connexion au format JSON
      email: form.email.value,
      password: form.password.value,
    }),
  })
    .then((response) => response.json()) // On convertit la réponse de l'API en objet JSON
    .then((data) => { // On traite la réponse de l'API
      var token = data.token; // On récupère le token d'authentification
      var isLoggedIn = true; // On définit la variable qui indique si l'utilisateur est connecté
      if (token == undefined) { // Si l'API retourne un message d'erreur
        form.errorMessage.innerHTML = "Erreur dans l’identifiant ou le mot de passe"; // On affiche un message d'erreur
      }
      else { // Si l'API retourne une réponse valide
        sessionStorage.setItem("isLoggedIn", isLoggedIn); // On enregistre que l'utilisateur est connecté dans le stockage de session
        sessionStorage.setItem("token", token); // On enregistre le token d'authentification dans le stockage de session
        //open("index.html");
        location.assign("index.html"); // On redirige l'utilisateur vers la page d'accueil
      }
      console.log(token, isLoggedIn); // On affiche le token et l'état de connexion dans la console
    })
    .catch((err) => { // Si une erreur se produit pendant la connexion à l'API
      console.log(err); // On affiche l'erreur dans la console
    });
});