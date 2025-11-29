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
        
        // Adición de la categoría a la lista
        categoryList.appendChild(li); 
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    colorUI = changeColorCategories();

    console.log('Iniciando carga de categorías');

    const categories = await api.getAllCategories();
    
    if (categories) {
        console.log('Categorías cargadas con éxito:', categories);
        renderCategories(categories);
        // Ejecución de la carga de colores guardados al finalizar la configuración.
        colorUI.loadColors();
    } else {
        console.log('La carga de categorías falló (el error fue mostrado por SweetAlert).');
    }
});