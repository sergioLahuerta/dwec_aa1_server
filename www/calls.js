// Me pongo comentarios descriptivos para enterarme de lo que voy haciendo, aunque sean un poco "para niños"

const API_URL = 'http://localhost:3000';
const api = new Api(API_URL);
let colorUI;

const renderCategories = (categories) => {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = ''; // Limpio el content del elemento (en este caso el ul con ese id) por si acaso

    categories.forEach(category => {
        const categoryId = `category-${category.id}`;
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
                <i id="icon-${category.id}" 
                   class="bi ${initialIconClass} me-2 fs-5"
                   style="color: ${textColor}">
                </i> 
                ${categoryName}
            </div>
            
            <div>
                <button class="btn btn-sm text-white p-1" data-bs-toggle="modal" data-bs-target="#iconPickerModal" data-target-icon="icon-${category.id}">
                   <i class="bi bi-person-fill fs-5" style="color: ${textColor}"></i> 
                </button>
                
                <button class="btn btn-sm text-white p-1" data-bs-toggle="modal" data-bs-target="#colorPickerModal" data-target-id="${categoryId}">
                    <i class="bi bi-palette-fill fs-5" style="color: ${textColor}"></i>
                </button>
            </div>
        `;

        // Pongo aquí el hover para no tener que crear un archivo .css
        li.addEventListener('mouseover', () => {
            li.style.cursor = 'pointer';
        })
        
        // Adición de la categoría a la lista
        categoryList.appendChild(li); 
    });
};

const renderSitesByCat = (sites) => {
    const sitesListByCat = document.getElementById('sites-by-cat');
    sitesListByCat.innerHTML = ''; // Limpio el content del elemento (en este caso el div con ese id) por si acaso

    sites.sites.forEach(site => {
        const siteId = `site-${site.id}`;
        const siteName = site.name;
        
        // Creación de cada div en el que va cada sitio
        const div = document.createElement('div');
        div.id = siteId;
        div.className = 'p-3 mb-3 rounded bg-secondary bg-opacity-50 border-bottom border-secondary'; // Clases de bootstrap que tenían los sites en estático
        div.style.width = 'calc(50% - 12px)'; // Para que queden bien centrados los sites en su contenedor (no lo he conseguido hacer de otra forma)

        // Contenido del div (el codigo comentado en estatico de los sites en el index.html(sin variables claro))
        div.innerHTML = `
            <h5 class="mb-1 d-flex align-items-center">
                ${siteName}<a href="#" class="ms-2 text-decoration-none small text-primary"><i
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
                  <span class="fw-bold text-white me-2">Contraseña:</span> <span class="text-white">${site.password}</span>
                </div>
                <div>
                  <button class="btn btn-sm btn-outline-light border-secondary me-2"><i
                      class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-sm btn-outline-light border-secondary me-2"><i
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
    
    if (categories && categories.length > 0) {
        console.log('Categorías cargadas con éxito:', categories);
        renderCategories(categories);
        // Ejecución de la carga de colores guardados al finalizar la configuración.
        colorUI.loadColors();
        const firstCategorie = categories[0].id;

        return firstCategorie;
    } else {
        console.log('La carga de categorías falló (el error fue mostrado por SweetAlert).');
    }
}

async function callSitesByCat(categoryId) {
    console.log('Iniciando carga de categorías');

    const sites = await api.getAllSitesByCat(categoryId);
    
    if (sites) {
        console.log('Sitios web cargadas con éxito:', sites);
        renderSitesByCat(sites);
    } else {
        console.log('La carga de sitios web falló (el error fue mostrado por SweetAlert).');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const firstCategoryId = await callCategories();
    if(firstCategoryId) {
        await callSitesByCat(firstCategoryId)
    }
});