// Me pongo comentarios descriptivos para aclararme con todo lo que voy haciendo, aunque sean un poco "para niños"

const API_URL = 'http://localhost:3000';
const api = new Api(API_URL);
let colorUI;
let allCategoriesCache = [];

const renderCategories = (categories) => {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = ''; // Limpio el content del elemento (en este caso el ul con ese id) por si acaso

    categories.forEach(category => {
        const categoryId = `${category.id}`;
        const categoryName = category.name;

        // Colores e iconos por defecto, luego si se quiere pues se cambian en la interfaz web
        const initialIconClass = category.icon || 'bi-folder-fill';
        const initialColor = category.backgroundColor || '#6c757d';
        // Si el background inicial es blnaco, el color del texto en azul, si no, en blanco
        const textColor = (initialColor === '#f8f9fa') ? '#0d6efd' : '#ffffff';

        // Creación de cada li en el que va cada categoría
        const li = document.createElement('li');
        li.id = categoryId;
        li.className = 'p-2 mb-2 rounded d-flex align-items-center justify-content-between'; // Clases de bootstrap que tenían las categ en estático
        li.style.backgroundColor = initialColor;
        li.style.color = textColor;

        // Contenido del li (el codigo comentado en estatico en el index.html(sin variables claro))
        li.innerHTML = `
            <div class="d-flex align-items-center">
        
                <button class="btn btn-sm p-0 me-2" 
                    style="color: ${textColor};" 
                    data-bs-toggle="modal" 
                    data-bs-target="#iconPickerModal" 
                    data-target-icon="icon-${category.id}">

                    <i id="icon-${category.id}" 
                    class="bi ${initialIconClass} fs-5"></i> 
                </button>

                ${categoryName}
            </div>
    
            <div>
                <button class="btn btn-sm text-white p-1" data-bs-toggle="modal" data-bs-target="#colorPickerModal" data-target-id="${categoryId}">
                    <i class="bi bi-palette-fill fs-5" style="color: ${textColor}"></i>
                </button>
            </div>
        `;

        // Pongo aquí el hover para no tener que crear un archivo .css
        li.addEventListener('mouseover', () => {
            li.style.cursor = 'pointer';
        })

        // Evento escuchador que uso para que cuando se haga click en una categoría, que salgan en la web los sites de la misma y que se asigne como categoría activa para ponerle la clase que corresponda programada en extraFunctions.js (linea 114)
        li.addEventListener('click', () => {
            callSitesByCat(categoryId);
            setActiveCategory(categoryId)
        })

        // Adición de la categoría a la lista
        categoryList.appendChild(li);
    });
};

const renderSitesByCat = (sites) => {
    const sitesListByCat = document.getElementById('sites-by-cat');
    sitesListByCat.innerHTML = ''; // Limpio el content del elemento (en este caso el div con ese id)

    sites.sites.forEach(site => {
        const siteId = `${site.id}`;
        const siteName = site.name;

        // Creación de cada div en el que va cada sitio
        const div = document.createElement('div');
        div.id = siteId;
        div.className = 'p-3 mb-3 rounded bg-secondary bg-opacity-50 border-bottom border-secondary'; // Clases de bootstrap que tenían los sites en estático
        div.style.width = 'calc(50% - 12px)'; // Para que queden bien centrados los sites en su contenedor (no lo he conseguido hacer de otra forma)

        // Contenido del div (el codigo comentado en estatico de los sites en el index.html(sin variables claro))
        div.innerHTML = `
            <h5 class="mb-1 d-flex align-items-center">
                ${siteName}<a href="${site.url}"target="blank" class="ms-2 text-decoration-none small text-primary"><i
                    class="bi bi-box-arrow-up-right"></i></a>
              </h5>
              <p class="text-primary small mb-3">${site.url}</p>

              <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span class="fw-bold text-white me-2">Usuario:</span> <span
                    class="text-white">${site.user}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold text-white me-2">Contraseña:</span> <span class="text-white">${maskPassword(site.password)}</span>
                </div>
                <div>
                  <button class="btn btn-sm btn-outline-light border-secondary" onclick="openEditPasswordModal('${siteId}')"><i 
                      class="bi bi-pencil-square"> Editar Contraseña</i></button>
                  <button class="btn btn-sm btn-outline-light border-secondary" onclick="deleteSiteButton('${siteId}')"><i
                      class="bi bi-x-lg"></i></button>
                </div>
              </div>
        `;

        // Adición de la categoría a la lista
        sitesListByCat.appendChild(div);
    });
};

async function callCategories() {
    colorUI = changeColorCategories();

    console.log('Iniciando carga de categorías');

    const categories = await api.getAllCategories();


    if (categories) {
        allCategoriesCache = categories;
        if (categories && categories.length === 0) {
            console.log('No hay categorías, crea una para empezar.')
        } else {
            console.log('Categorías cargadas con éxito:', categories);
            renderCategories(categories);
            // Ejecución de la carga de colores guardados al finalizar la configuración.
            colorUI.loadColors();
            const firstCategorie = categories[0].id;

            return firstCategorie;
        }
    } else {
        console.log('La carga de categorías falló.');
    }
}

// Variables globales necesarias para luego definir la función que permite crear categorías
let selectedNewCategoryColor = '#6c757d';
let currentActiveCategoryId = null;
const addCategoryModalElement = document.getElementById('addCategoryModal');
async function createCategory() {
    const categoryNameInput = document.getElementById('newCategoryName');
    const name = categoryNameInput.value.trim();
    const color = selectedNewCategoryColor;

    if (!name) {
        alert('Ponle un nombre a la categoría')
        return null;
    }

    console.log("Creando categoría con color:", color);

    const newCategory = await api.postCategorie(name, color);

    if (newCategory) {
        const newCategoryId = newCategory.id;
        const finalCategoryIdWithPrefix = `${newCategoryId}`;

        // Color elegido en localStorage temporalmente
        const STORAGE_KEY = 'categoryColors';
        const savedColorsJSON = localStorage.getItem(STORAGE_KEY) || '{}';
        const savedColors = JSON.parse(savedColorsJSON);

        // Guardado del color elegido en localStorage con el ID que devolvió el POST
        savedColors[finalCategoryIdWithPrefix] = color;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedColors));

        currentActiveCategoryId = null; // Lo pongo porque cuando estoy creando una nueva categoría el color que elijo al crearla se pone también en la categoría activa que es una de las que ya hay creadas

        const modal = bootstrap.Modal.getInstance(addCategoryModalElement);
        if (modal) {
            modal.hide();
        }

        const newCatSwatches = document.querySelectorAll('.new-cat-swatch');
        newCatSwatches.forEach(s => {
            s.style.border = '2px solid transparent';
        });

        selectedNewCategoryColor = '#6c757d';

        await callCategories();

        const finalCategoryId = newCategory.id;

        // Carga de los sitios de la nueva categoría y ponerle el borde activo.
        await callSitesByCat(finalCategoryId);
        setActiveCategory(finalCategoryId);
    }
}

function initializeNewCategoryColorPicker() {
    const newCatSwatches = document.querySelectorAll('.new-cat-swatch');

    newCatSwatches.forEach(swatch => {
        swatch.addEventListener('click', (event) => {
            const clickedElement = event.currentTarget;
            const newColor = clickedElement.getAttribute('data-color');

            // Limpiar el borde 'activo' de todos los swatches
            newCatSwatches.forEach(s => {
                s.style.border = '2px solid transparent';
            });

            // Aplicar el borde al swatch seleccionado
            clickedElement.style.border = '2px solid white';

            // Guardar el color en la variable global para usarlo en el POST
            selectedNewCategoryColor = newColor;

            console.log("Color para nueva categoría seleccionado:", selectedNewCategoryColor);
        });
    });

    // Seleccionar el color por defecto al inicio
    // Seleccionar el primer swatch (o el gris #6c757d) al cargar
    const defaultSwatch = document.querySelector('[data-color="#6c757d"]');
    if (defaultSwatch) {
        selectedNewCategoryColor = '#6c757d';
        defaultSwatch.style.border = '2px solid white';
    }
    currentActiveCategoryId = null;
}

// Función para cuando se presione el botón de eliminar categoría, que se elimine
async function deleteCategoryButton() {
    // Creación de variable succes al metodo de la api deleteCategory y se le pasa el id de la varibale currentActiveCategoryId que es la categpría activa en ese momento
    const succes = await api.deleteCategory(currentActiveCategoryId);

    if (succes) {
        const newFirstCategoryId = await callCategories();
        if (newFirstCategoryId) {
            await callSitesByCat(newFirstCategoryId);
            setActiveCategory(newFirstCategoryId)
            currentActiveCategoryId = newFirstCategoryId;
        }
    } else {
        // Si no quedan categorías (la lista está vacía)
        // Opcional: Limpiar el panel de sitios, si callSitesByCat() no lo hace automáticamente
        document.getElementById('sites-by-cat').innerHTML = '';
        document.getElementById('nameCategory').textContent = 'No hay categorías';
        document.getElementById('sitesCount').textContent = '0 sitios guardados';
        currentActiveCategoryId = null;
    }
}

function filterCategories(searchTerm) {
    // Convierto el término de búsqueda en minúsculas y lo limpio
    const term = searchTerm.trim().toLowerCase();
    
    // Si el buscador está vacío, mostrar todas las categorías
    if (term === '') {
        renderCategories(allCategoriesCache);
        return;
    }
    
    // Filtrar la lista global = allCategoriesCache
    const filteredList = allCategoriesCache.filter(category => {
        // Devuelve true si el nombre de la categoría incluye el término de búsqueda
        return category.name.toLowerCase().includes(term);
    });
    
    renderCategories(filteredList);

    if (colorUI && colorUI.loadColors) {
        colorUI.loadColors(); 
    }

    if (currentActiveCategoryId) {
        setActiveCategory(currentActiveCategoryId);
    }
}

async function callSitesByCat(categoryId) {
    console.log('Iniciando carga de categorías');
    // Le paso la variable global currentActiveCategoryId para que sea accesible todo el archivo a la categoria activa en todo momento (la implemento para el deleteCategories más que nada)
    currentActiveCategoryId = categoryId;
    const categoryData = await api.getAllSitesByCat(categoryId);

    if (categoryData) {
        const categoryTitleElement = document.getElementById('nameCategory');
        if (categoryTitleElement && categoryData.name) {
            categoryTitleElement.textContent = categoryData.name;
        }

        // Actualización del contador de sitios
        const sitesCount = categoryData.sites ? categoryData.sites.length : 0;
        const countElement = document.getElementById('sitesCount');
        if (countElement) {
            countElement.textContent = `${sitesCount} sitios guardados`;
        }

        console.log('Sitios web cargados con éxito:', categoryData);
        // Llamada a la función de renderizado para dibujar las tarjetas de sitios
        renderSitesByCat(categoryData);
    } else {
        console.log('La carga de sitios web falló.');
    }
}

// Función para crear sitios
async function createSite() {
    // Recojo los valores del form
    const name = document.getElementById('siteName').value.trim();
    const url = document.getElementById('siteUrl').value.trim();
    const user = document.getElementById('siteUser').value.trim();
    const password = document.getElementById('sitePassword').value.trim();
    const categoryId = currentActiveCategoryId;

    // Validación minima
    if (!name || !url || !user || !password) {
        alert(`No se precisan los datos necesarios para crear el sitio ->
            Nombre: ${name}
            Url: ${url}
            Usuario: ${user}
            Contraseña: ${password}`)
        return;
    }

    // Llamada a la API
    const newSite = await api.postSite(
        categoryId,
        name,
        url,
        user,
        password,
    );

    if (newSite) {
        // Cierre del modal
        const modalInstance = bootstrap.Modal.getInstance(addSiteModalElement);
        modalInstance.hide();
        document.getElementById('siteForm').reset(); // Limpia el formulario

        await callSitesByCat(categoryId);
    }
}

async function saveNewPassword() {
    const newPassword = document.getElementById('newPasswordInput').value.trim();
    const targetId = siteIdToUpdate;

    if (!targetId || !newPassword) {
        alert('El Id del site y la contraseña son obligatorios');
        return null;
    }

    const updatedSite = await api.putPasswordSite(targetId, newPassword);

    if (updatedSite) {
        const modalElement = document.getElementById('editPasswordModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        await callSitesByCat(currentActiveCategoryId);

        alert("Contraseña actualizada con éxito.");
    }
    siteIdToUpdate = null;
}

// Función para eliminar el sitio a través de su botón correspondiente
async function deleteSiteButton(siteId) {
    if (!siteId) {
        console.error('Id de sitio no encontrado.');
        return null;
    }

    // Ventana para confirmar la eliminación
    const isConfirmed = confirm(`¿Estás seguro de eliminar el sitio con ID ${siteId} de la categoría activa? ¡Esta acción es irreversible!`);

    if (isConfirmed) {
        const categoryIdToReload = currentActiveCategoryId;

        console.log(`Sitio eliminando ${siteId}...`);

        const success = await api.deleteSite(siteId);

        if (success) {
            alert("Eliminado!, el sitio ha sido eliminado correctamentre.");

            await callSitesByCat(categoryIdToReload);

            return true;
        } else {
            alert("Error de Eliminación: No se pudo eliminar el sitio web, verifica el servidor.");
            return false;
        }
    }
    return false; // False solo si el usuario cancela la eliminación
}

function attachModalValidationListeners() {
    // Seleccionar todos los inputs dentro del formulario de sitios
    const form = document.getElementById('siteForm'); 
    
    if (form) {
        const inputs = form.querySelectorAll('input[required], input#sitePassword, input#siteUrl');
        
        inputs.forEach(input => {
            input.addEventListener('blur', handleValidationOnBlur);
            
            input.addEventListener('focus', (e) => {
                e.target.classList.remove('is-invalid', 'is-valid');
                removeFeedbackMessage(e.target);
            });
        });
    }
}

// LLamadas a las funciones con el dom cargado para que no haya errores en el proceso de llamada
document.addEventListener('DOMContentLoaded', async () => {
    initializeNewCategoryColorPicker()
    const btnSave = document.getElementById('btnSaveNewCategory');
    if (btnSave) {
        btnSave.addEventListener('click', createCategory)
    }

    const firstCategoryId = await callCategories();
    // Que por defecto salgan los sites de la primera categoría y que se ponga esta primera como activa
    if (firstCategoryId) {
        await callSitesByCat(firstCategoryId);
        setActiveCategory(firstCategoryId);
    }

    const btnDelete = document.getElementById('btnDeleteCategory');
    if (btnDelete) {
        btnDelete.addEventListener('click', deleteCategoryButton);
    }

    const btnAddSite = document.querySelector('.card-header .bg-primary');
    if (btnAddSite) {
        btnAddSite.addEventListener('click', openAddSiteModal);
    }

    const btnSaveSite = document.getElementById('btnSaveNewSite');
    if (btnSaveSite) {
        btnSaveSite.addEventListener('click', createSite);
    }

    const btnSavePassword = document.getElementById('btnSavePassword');
    if (btnSavePassword) {
        btnSavePassword.addEventListener('click', saveNewPassword);
    }

    const btnGenerate = document.getElementById('btnGeneratePassword');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', () => setGeneratedPassword('sitePassword')); 
    }

    const btnGenerateEditP = document.getElementById('btnGeneratePasswordEdit');
    if (btnGenerateEditP) {
        btnGenerateEditP.addEventListener('click', () => setGeneratedPassword('newPasswordInput')); 
    }

    attachModalValidationListeners();

    const searchInput = document.querySelector('.card-body input[type="text"]');
    if (searchInput) {
        // Uso evento 'input' para filtrar en tiempo real
        searchInput.addEventListener('input', (event) => {
            // Llamo a la función de filtro con el valor actual del input
            filterCategories(event.target.value);
        });

        const searchButton = document.querySelector('.card-body button[type="button"]');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                filterCategories(searchInput.value);
            });
        }
    }
});