const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("passwrd");
const errorMessage = document.querySelector("p");
const loginL = document.querySelector(".logginL")

function error() {
    errorMessage.innerHTML = "User unkwon, please try again ";
    errorMessage.classList.add("error-message");
};

const myLoginApi = "http://localhost:5678/api/users/login";

form.addEventListener('submit', async function(event) {
    event.preventDefault(); /***** Empêche le rechargement de la page lors de la soumission du formulaire */

    /**** Mes valeurs saisies par l'utilisateur */
    const email = emailInput.value;
    const password = passInput.value;

    const response = await fetch(myLoginApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }) /***** Convertir en JSON */
    });
    /***** Si la connexion est réussie, rediriger vers index.html*/
    if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        window.location.href = "./index.html";
        /**** if not affiche mon message d'erreur */
    } else {
        error();
    }
});