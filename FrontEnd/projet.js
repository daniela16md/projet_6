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
/*
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
            return true /***est ce mon token est valide */
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
   
    const mymodal = document.querySelector(".backgroundmodal");
    console.log(mymodal);
    const buttonopen = document.querySelector(".divprojets");

    if (buttonopen) buttonopen.addEventListener("click", openModal);

    async function openModal() {
        mymodal.style.display = "flex";
       
        const works = await getMyWorks(); 
        showWorksModal(works);
    
    }
   
    function closeModal() {
        mymodal.style.display = "none";
    }

    window.addEventListener("click", function(event) {
        if (event.target === mymodal) {
            closeModal();
        }
    });

    function backView() {
       const modalct1 = document.querySelector(".modalcontent");
       const modalct2 = document.querySelector(".modalcontent2");
       modalct1.style.display = "flex"
       modalct2.style.display = "none"
       const arrowEL = document.querySelector(".fa-arrow-left");
       arrowEL.classList.add("hide");
    }

   
    async function createMyModal() { 
        const modal = document.getElementById("modal");
        console.log(modal);
       
        const arrowElement = document.createElement("i");
        arrowElement.classList.add("fa-solid", "fa-arrow-left", "hide");
      
        arrowElement.addEventListener("click", backView);
        console.log(arrowElement);
        const elementX = document.createElement("i");
        elementX.classList.add("fa-solid", "fa-xmark");
        elementX.addEventListener("click", closeModal);
        modal.appendChild(arrowElement);
        modal.appendChild(elementX);

        const modalcontent = document.createElement("div");
        modal.appendChild(modalcontent);
        modalcontent.classList.add("modalcontent");
        const modalTitle = document.createElement("h3");
        modalTitle.innerText = "Galerie photo";
        modalcontent.appendChild(modalTitle);
        modalTitle.classList.add("modaltitle");
        const modalGallery = document.createElement("div");
        modalcontent.appendChild(modalGallery);
        modalGallery.classList.add("modalgallery");

        const borderbottom = document.createElement("div");
        borderbottom.classList.add("borderbottom");
        modalcontent.appendChild(borderbottom);
        
        const buttonModal = document.createElement("button");
        modalcontent.appendChild(buttonModal);
        buttonModal.classList.add("buttonmodal");
        buttonModal.innerText = "Ajouter une photo";
        buttonModal.addEventListener("click", newView);
        
    
        const works = await getMyWorks();
        showWorksModal(works);
       
    }
    createMyModal();

    function newView() {
        const modalcontent = document.querySelector(".modalcontent");
        modalcontent.classList.add("hide");
        const modal1 = document.getElementById("modal");
        const arrowE = document.querySelector(".fa-arrow-left");
        console.log(arrowE);
        arrowE.classList.remove("hide");
        const modalcontent2 = document.createElement("div");
        modal1.appendChild(modalcontent2);
        modalcontent2.classList.add("modalcontent2");
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
        divform.appendChild(formbutton);
        const inputform = document.createElement("input");
        inputform.type = "file";
        inputform.accept = ".jpg, .png";
        inputform.classList.add("inputform");
        divform.appendChild(inputform);
        const photoPreview = document.createElement("img");
        photoPreview.id = "photoPreview";
        divform.appendChild(photoPreview);
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
        
        const borderbottom = document.createElement("div");
        borderbottom.classList.add("borderbottom");
        modalcontent2.appendChild(borderbottom);

        const buttonModal2 = document.createElement("button");
        modalcontent2.appendChild(buttonModal2);
        buttonModal2.classList.add("buttonmodalgrey");
        buttonModal2.innerText = "Valider";
       /* showArrow();*/
    }
   

    async function showWorksModal(works) {
        const showworksM = document.querySelector(".modalgallery");
        showworksM.innerHTML = "";
        for (const work of works) {
            const divimagetrash = document.createElement("div");
            divimagetrash.classList.add("divimagetrash");
            const imageModale = document.createElement("img");
            imageModale.src = work.imageUrl;
            imageModale.setAttribute = work.id;
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

    /*const buttonM = document.querySelector("buttonmodal")
    buttonM.addEventListener("click", newView);*/
   /*function newView() {
        const modalview = document.getElementById("modal");
        if(mymodal === ok){
            modalview.classList.add("hide");
        }
        console.log(modalview);
        const modalarrowX = document.createElement("div");
        modalarrowX.classList.add("modalarrowX");
        modalview.appendChild(modalarrowX);
        const arrowElement = document.createElement("i");
        arrowElement.classList.add("fa-solid", "fa-arrow-left");
        arrowElement.addEventListener("click", createMyModal);
        const elementX = document.createElement("i");
        elementX.classList.add("fa-solid", "fa-xmark");
        elementX.addEventListener("click", closeModal);
        modalarrowX.appendChild(arrowElement);
        modalarrowX.appendChild(elementX);
        const modalcontent = document.createElement("div");
        modalview.appendChild(modalcontent);
        modalcontent.classList.add("modalcontent");
        const modalTitle = document.createElement("h3");
        modalTitle.innerText = "Ajout photo";
        modalcontent.appendChild(modalTitle);
        modalTitle.classList.add("modaltitle");
        const modalform = document.createElement("form");
        modalform.classList.add("modalform");
        modalcontent.appendChild(modalform);
        const divform = document.createElement("div");
        divform.classList.add("divform");
        modalform.appendChild(divform);
        const formI = document.createElement("i");
        formI.classList.add("fa-regular", "fa-image");
        divform.appendChild(formI);
        const formbutton = document.createElement("button");
        formbutton.innerText = "+ Ajouter photo";
        formbutton.classList.add("formbutton");
        divform.appendChild(formbutton);
        const inputform = document.createElement("input");
        inputform.innerText = "file";
        inputform.accept = ".jpg, .png";
        inputform.classList.add("inputform");
        divform.appendChild(inputform);
        const photoPreview = document.createElement("img");
        photoPreview.id = "photoPreview"
        divform.appendChild(photoPreview);
        const formtext = document.createElement("p");
        formtext.innerText = "jpg, png : 4mo max";
        formtext.classList.add("formtext");
        divform.appendChild(formtext);
        const divtitre = document.createElement("div");
        divtitre.classList.add("divtitre");
        modalcontent.appendChild(divtitre);
        const labeltitre = document.createElement("label");
        labeltitre.setAttribute("for", "Title");
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
        const borderbottom = document.createElement("div");
        borderbottom.classList.add("borderbottom");
        modalcontent.appendChild(borderbottom);
        const buttonModal2 = document.createElement("button");
        modalcontent.appendChild(buttonModal2);
        buttonModal2.classList.add("buttonmodalgrey");
        buttonModal2.innerText = "Valider";
        

    };
    newView();*/
    
}); 