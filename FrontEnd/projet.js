document.addEventListener("DOMContentLoaded", async function() {
    // Premiere partie les works et les filtres
    const gallery = document.querySelector(".gallery");
    const filters = document.querySelector(".filters");

    
    async function getMyWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        return await response.json();
    }
    const showallmyworks = getMyWorks();
    console.log(showallmyworks);


    
    async function getMyCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        return await response.json();
    }

    /*****  afficher les "works" dans la galerie */
    function showApiWorks(arrayApiWorks) {
       
        gallery.innerHTML = "";
        
       
        arrayApiWorks.forEach(work=> {
           
            const figureEL = document.createElement("figure");
            const imgEL = document.createElement("img");
            const figcaption = document.createElement("figcaption");

            imgEL.src = work.imageUrl;
            figcaption.textContent = work.title;

            figureEL.appendChild(imgEL);
            figureEL.appendChild(figcaption);

            gallery.appendChild(figureEL);
        });
    }

    function createButton(name, categoryId) {
        const button = document.createElement("button");
        button.classList.add("button");

        button.innerText = name;

        filters.appendChild(button);

        button.addEventListener("click", async () => {
            document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("button_selected"));
            button.classList.add("button_selected");

            console.log(categoryId);

            const works = await getMyWorks();
            const selectedWorks = categoryId === undefined ? works : works.filter(work => work.categoryId === categoryId);
            console.log(categoryId, selectedWorks);

            showApiWorks(selectedWorks);
        });
    }

    /***** afficher les filtres */
    async function displayFilters() {
        createButton("Tous", undefined);

        document.querySelector(".filters button").classList.add("button_selected");

        const categories = await getMyCategories();

        categories.forEach(category => createButton(category.name, category.id));
        console.log(categories);
    }

    /***** Afficher works and filters */
    await displayFilters();

    const works = await getMyWorks();
    showApiWorks(works);
    console.log(works);

    // Deuxieme partie login => login.html et login.js

    //Troisieme partie mode edition, admin

    /***** verifier si le token est tujours active dans la function isconnected */

    function isconnected() {
        const mytoken = localStorage.getItem("token");
        console.log(mytoken);
        if (mytoken === null) {
            return { isValid: false, message: "Token not found" };
        } else {
            const tokenPayload = parseJwt(mytoken);
            const currentTime = Math.floor(Date.now() / 1000); 
    
            // Vérifie si le jeton n'a pas expiré
            if (tokenPayload.exp && tokenPayload.exp > currentTime) {
                return { isValid: true, message: "Token valid" };
            } else {
                console.log("Token Payload:", tokenPayload);
                console.log("Current Time:", currentTime);
                return { isValid: false, message: "Token expired" };
            }
        }
    }
    
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    }
    
   
    const connectionStatus = isconnected();
    console.log("Connection Status:", connectionStatus);
    if (connectionStatus.isValid) {
        console.log(connectionStatus.message);
    } else {
        console.error(connectionStatus.message);
        
    }
   
    /***** le banner */

    function borderTop() {
        const banner = document.querySelector(".edit_mode"); 
    
        const iconeElement = document.createElement("i");
        const textElement = document.createElement("p");
    
        console.log(banner, iconeElement, textElement);
    
        iconeElement.classList.add("fa-regular", "fa-pen-to-square");
        iconeElement.classList.add("mode-edition", "i");
        textElement.innerText = "Mode édition";
        textElement.classList.add("mode-edition", "p");
    
        banner.appendChild(iconeElement);
        banner.appendChild(textElement);
    
        const loginLink = document.querySelector(".loginL"); 
        

        const mytitle = document.querySelector(".divprojets");
        console.log(mytitle);
        const mytitlediv = document.createElement("div");
        mytitlediv.classList.add(".divprojetsdiv");
        const mytitleicone = document.createElement('i');
        mytitleicone.classList.add("fa-regular", "fa-pen-to-square");
        const mytitleelemment = document.createElement("p");
        mytitleelemment.innerText = "modifier"
       

        mytitle.appendChild(mytitlediv);
        mytitlediv.appendChild(mytitleicone);
        mytitlediv.appendChild(mytitleelemment); 
    
        if (isconnected()) {

            banner.style.display = "flex";
            iconeElement.style.display = "flex";
            mytitlediv.style.display = "flex"
           
            loginLink.innerText = "logout"
            filters.style.display = "none";

        } else {
            banner.style.display = "none";
            iconeElement.style.display = "none";
            mytitleelemment.style.display = "none"
            mytitleicone.style.display = "none"
    
            if (loginLink) loginLink.style.display = "block";
            
        }; 
    
    };
    
    borderTop();  


    // Quatrieme partie Modal
   
    
    const mymodal = document.querySelector(".backgroundmodal");
    const buttonopen = document.querySelector(".divprojets");

    if (buttonopen) buttonopen.addEventListener("click", openModal);

    async function openModal() {
        if (mymodal) {
            mymodal.style.display = "flex"; // Afficher la modal

            const modal = document.getElementById("modal");
            if (modal) {
                modal.innerHTML = ''; // Nettoyer le contenu de la modal

                // Créer le contenu de la modal
                await createMyModal();

                const works = await getMyWorks();
                showWorksModal(works);
            }
        }
    }

    function closeModal() {
        if (mymodal) {
            mymodal.style.display = 'none'; // Cacher la modal
            console.log("Modal closed.");
        }
    }
    window.addEventListener("click", function(event) {
        if (event.target === mymodal) {
            closeModal();
        }
    });
    function backView() {
        const modalcontent2 = document.querySelector(".modalcontent2");
        if (modalcontent2) {
            modalcontent2.remove();
        }
        const arrowElement = document.querySelector(".fa-arrow-left");
        if (arrowElement) {
            arrowElement.classList.add("hide");
        }
        createMyModal();
    }

   /***** creer ma modal avec le visuel first */
   
    async function createMyModal() {
        const modal = document.getElementById("modal");
        modal.innerHTML = ''; // Nettoyer le contenu de la modal

        // Création des éléments de la modal
        const arrowElement = document.createElement("i");
        arrowElement.classList.add("fa-solid", "fa-arrow-left", "hide");
        arrowElement.addEventListener("click", backView);

        const elementX = document.createElement("i");
        elementX.classList.add("fa-solid", "fa-xmark");
        elementX.addEventListener("click", closeModal);
        modal.appendChild(arrowElement);
        modal.appendChild(elementX);

        const modalcontent = document.createElement("div");
        modalcontent.classList.add("modalcontent");
        modal.appendChild(modalcontent);

        const modalTitle = document.createElement("h3");
        modalTitle.innerText = "Galerie photo";
        modalcontent.appendChild(modalTitle);
        modalTitle.classList.add("modaltitle");

        const modalGallery = document.createElement("div");
        modalGallery.classList.add("modalgallery");
        modalcontent.appendChild(modalGallery);

        const borderbottom = document.createElement("div");
        borderbottom.classList.add("borderbottom");
        modalcontent.appendChild(borderbottom);

        const buttonModal = document.createElement("button");
        buttonModal.classList.add("buttonmodal");
        buttonModal.innerText = "Ajouter une photo";
        buttonModal.addEventListener("click", newView);
        modalcontent.appendChild(buttonModal);

        const works = await getMyWorks();
        showWorksModal(works);
    }

    async function newView() {
        const modalcontent = document.querySelector(".modalcontent");
        if (modalcontent) {
            modalcontent.remove(); // Supprimez la vue actuelle
        }

        const modal1 = document.getElementById("modal");
        const arrowE = document.querySelector(".fa-arrow-left");
        arrowE.classList.remove("hide");

        const modalcontent2 = document.createElement("div");
        modalcontent2.classList.add("modalcontent2");
        modal1.appendChild(modalcontent2);

        const modalTitle2 = document.createElement("h3");
        modalTitle2.innerText = "Ajout photo";
        modalcontent2.appendChild(modalTitle2);
        modalTitle2.classList.add("modaltitle");

        const modalform = document.createElement("form");
        modalform.classList.add("modalform");
        modalcontent2.appendChild(modalform);

        const divform = document.createElement("div");
        divform.classList.add("divform");
        modalform.appendChild(divform);

        const formI = document.createElement("i");
        formI.classList.add("fa-regular", "fa-image");
        divform.appendChild(formI);

        const formbutton = document.createElement("button");
        formbutton.innerText = "+ Ajouter photo";
        formbutton.classList.add("formbutton");
        formbutton.type = "button"; // Assurez-vous que ce bouton n'est pas de type submit
        divform.appendChild(formbutton);

        const inputform = document.createElement("input");
        inputform.type = "file";
        inputform.accept = ".jpg, .png";
        inputform.classList.add("inputform");
        divform.appendChild(inputform);

        const photoPreview = document.createElement("img");
        photoPreview.id = "photoPreview";
        divform.appendChild(photoPreview);

        inputform.addEventListener("change", () => {
            const [file] = inputform.files;
            if (file) {
                photoPreview.src = URL.createObjectURL(file);
                formbutton.classList.add("hide");
                formtext.classList.add("hide");
                formI.classList.add("hide");
                photoPreview.classList.add("displayflex");
            }
        });

        const formtext = document.createElement("p");
        formtext.innerText = "jpg, png : 4mo max";
        formtext.classList.add("formtext");
        divform.appendChild(formtext);

        const divtitre = document.createElement("div");
        divtitre.classList.add("divtitre");
        modalcontent2.appendChild(divtitre);

        const labeltitre = document.createElement("label");
        labeltitre.setAttribute("for", "Titre");
        labeltitre.innerText = "Titre";
        divtitre.appendChild(labeltitre);

        const inputtitre = document.createElement("input");
        inputtitre.id = "Titre";
        inputtitre.type = "text";
        divtitre.appendChild(inputtitre);

        const labelcategory = document.createElement("label");
        labelcategory.setAttribute("for", "category");
        labelcategory.innerText = "Catégorie";
        divtitre.appendChild(labelcategory);

        const selectCategory = document.createElement("select");
        selectCategory.id = "category";
        divtitre.appendChild(selectCategory);

        const categoryM = await getMyCategories();
        categoryM.forEach(category => {
            const optioncategory = document.createElement("option");
            optioncategory.value = category.id;
            optioncategory.text = category.name;
            selectCategory.appendChild(optioncategory);
        });

        const borderbottom = document.createElement("div");
        borderbottom.classList.add("borderbottom");
        modalcontent2.appendChild(borderbottom);

        const buttonModal2 = document.createElement("button");
        buttonModal2.classList.add("buttonmodalgrey");
        buttonModal2.type = "submit";
        buttonModal2.innerText = "Valider";
        modalcontent2.appendChild(buttonModal2);

        inputform.addEventListener("change", validation);
        inputtitre.addEventListener("input", validation);
        selectCategory.addEventListener("change", validation);

        function validation() {
            if (inputform.value !== "" && inputtitre.value !== "" && selectCategory.value !== "0") {
                buttonModal2.classList.add("buttongreen");
            } else {
                buttonModal2.classList.remove("buttongreen");
            }
        }

        buttonModal2.addEventListener("click", (event) => {
            postWorks(inputform, inputtitre, selectCategory);
            event.preventDefault();
        });
    }

    async function showWorksModal(works) {
        const showworksM = document.querySelector(".modalgallery");
        showworksM.innerHTML = "";
        for (const work of works) {
            const divimagetrash = document.createElement("div");
            divimagetrash.classList.add("divimagetrash");
            const imageModale = document.createElement("img");
            imageModale.src = work.imageUrl;
            imageModale.setAttribute("data-id", work.id);
            let id = work.id;
            const trash = document.createElement("i");
            trash.classList.add("fa-solid", "fa-trash-can");
            showworksM.appendChild(divimagetrash);
            divimagetrash.appendChild(imageModale);
            divimagetrash.appendChild(trash);
            trash.addEventListener("click", () => deleteW(id));
        }
    }

    function getUserToken() {
        return localStorage.getItem("token");
    }

    async function deleteW(id) {
        const token = getUserToken();
        console.log("Token:", token);
        console.log("Work ID:", id);
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                console.log("Deletion successful");
                const works = await getMyWorks();
                showWorksModal(works);
                showApiWorks(works);
            } else {
                console.error("Deletion failed:", response.statusText);
            }
        } catch (error) {
            console.error("Deletion error:", error);
        }
    }

    async function postWorks(inputform, inputtitre, selectCategory) {
        const token = getUserToken();

        if (!token) {
            console.error("Token not found");
            return;
        }

        if (!inputform.files[0] || !inputtitre.value || !selectCategory.value) {
            console.error("Missing required fields");
            return;
        }

        const formData = new FormData();
        const postworksimg = inputform.files[0];
        const postWorkstitle = inputtitre.value;
        const postWorkscategory = selectCategory.value;

        formData.append("image", postworksimg);
        formData.append("title", postWorkstitle);
        formData.append("category", postWorkscategory);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                console.log("Upload successful");
                createMyModal();
                const works = await getMyWorks();
                showApiWorks(works);
                showWorksModal(works);
            } else {
                const errorData = await response.json();
                console.error("Failed to upload work:", response.statusText, errorData);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    
});