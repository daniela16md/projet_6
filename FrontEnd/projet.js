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

});
