document.addEventListener("DOMContentLoaded", async function() {
    // premiere partie les works et les filtres
    const gallery = document.querySelector(".gallery");
    const filters = document.querySelector(".filters");

    
    async function getMyWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        return await response.json();
    }

    
    async function getMyCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        return await response.json();
    }

    /***** Fonction pour afficher les "works" dans la galerie */
    function showApiWorks(arrayApiWorks) {
       
        gallery.innerHTML = "";
        
       
        arrayApiWorks.forEach((work) => {
           
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

    /***** Fonction pour afficher les filtres */
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

    // deuxieme partie login => login.html et login.js

    // troisieme partie mode edition, admin

    function isconnected() {
        const mytoken = localStorage.getItem("token");
        if (mytoken === null) { 
            return false
        } else {
            return true
        };
    
    };

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
    
    borderTop(); // Call myBannerOn function after DOMContentLoaded  


    // quatrieme partie Modal
    /*****Method delete  */

    const modal = document.getElementById("modal");
    const modalFirst = document.getElementById("modal1");
    const modalSecond = document.getElementById("modal2");
    const buttonAddPhoto = document.getElementById("addPhoto");
    const buttonClose = document.querySelectorAll(".fa-xmark");
    const myTitle = document.querySelector(".divprojets");
    const arrowLeft = document.querySelector(".fa-arrow-left");


    // Add event listeners
    if (myTitle) myTitle.addEventListener("click", showMyModal);
    if (buttonAddPhoto) buttonAddPhoto.addEventListener("click", openModal2);
    if (arrowLeft) arrowLeft.addEventListener("click", showMyModal);
    if (buttonClose) buttonClose.forEach(btn =>btn.addEventListener("click", closeModal));

    // Show the first modal
    async function showMyModal() {
        modal.style.display = "block";
        modalFirst.style.display = "block";
        modalSecond.style.display = "none"; 

        const works = await getMyWorks();
        ImagesModal1(works);
    };

    // Close the modal
    function closeModal() {
        modal.style.display = "none";
        modalFirst.style.display = "none";
        modalSecond.style.display = "none";
    };

    // Open the second modal
    function openModal2() {
        modalFirst.style.display = "none";
        modalSecond.style.display = "block";
    };

    // Close the modal when clicking outside of it
    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    function ImagesModal1(works) {
        const mydivPhoto = document.querySelector(".showImages")
        mydivPhoto.innerHTML = "";
        works.forEach(work => {
            const showImg = document.querySelector(".showImages");
            const figureEL = document.createElement("figure");

            const IM1button = document.createElement("button");
            IM1button.classList.add("fa-solid", "fa-arrow-up-down-left-right", "trash-icon")
            IM1button.id = "btnmove";
            IM1button.dataset.idimage = work.id

            const btnDelete = document.createElement("button");
            btnDelete.classList.add("fa-solid", "fa-trash-can");
            btnDelete.id = "btndelete";
            btnDelete.dataset.idimage = work.id;

            const imageM1 = document.createElement("img");
            imageM1.src = work.imageUrl;
            

            const editBtn = document.createElement("button");
            editBtn.innerHTML = "éditer";
            editBtn.id = "buttonedit";

            showImg.appendChild(figureEL);
            figureEL.appendChild(IM1button);
            figureEL.appendChild(btnDelete);
            figureEL.appendChild(imageM1);
            /*figureEL.appendChild(editBtn);*/

            btnDelete.addEventListener("click", async (event) => {
                const workId = event.target.dataset.workId;
                await deleteW(workId);
                figureEL.remove();
            });
          
        });
    };

    function getUserToken() {
        return localStorage.getItem('token');
    };

    async function deleteW(workId) {
        const myToken = getUserToken();
        console.log("Token d'utilisateur :", myToken); 
        if (!myToken) {
            console.error("Token d'utilisateur introuvable");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${getUserToken()}`,
                },
            });
            if (response.status === 204) {
                console.log("item deleted.");
                removeWorkFromDOM(workId);
            } else {
                console.error("Failed to delete.");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    } deleteW();

    

    function removeWorkFromDOM(workId) {
        /*****  Sélectionne l'élément avec l'icône de la corbeille qui a l'ID du travail spécifié*/
        const trashIcon = document.querySelector(`.trash-icon[data-work-id="${workId}"]`);
    
        if (trashIcon) {
            // Sélectionne l'élément parent de l'icône de la corbeille (le conteneur du travail)
            const workElement = trashIcon.parentElement;
    
            // Supprime cet élément parent du DOM
            workElement.remove();
        };
    };

    


    // Method Post 


}); 