// ------------ Colores Categorías -----------------
// La clave para guardar los colores en localStorage
const STORAGE_KEY = 'categoryColors';

// Contraseña:
// Ocultar contraseña
function maskPassword(password) {
    if (typeof password === 'string' && password.length > 0) {
        return '•'.repeat(password.length);
    }
    return 'N/A';
}

// Cambiar el color de las categorías
function changeColorCategories() {
    const styleCard = document.createElement('style');
    styleCard.innerHTML = `
        .color-swatch {
            width: 35px;
            height: 35px;
            border: 2px solid transparent;
            cursor: pointer;
            transition: border-color 0.15s ease-in-out;
        }
        .color-swatch:hover {
            border-color: #fff;
        }
    `;
    document.head.appendChild(styleCard);

    let targetCategoryId = null;

    const modalElement = document.getElementById('colorPickerModal');
    if (!modalElement) return;

    // Lectura los colores guardados
    function loadSavedColors() {
        const savedColorsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedColorsJSON) {
            const savedColors = JSON.parse(savedColorsJSON);
            for (const categoryId in savedColors) {
                const targetLi = document.getElementById(categoryId);
                const newColor = savedColors[categoryId];
                
                if (targetLi) {
                    applyColor(targetLi, newColor);
                }
            }
        }
    }

    // Función auxiliar para aplicar colores y cambiar el texto/icono a blanco o azul
    function applyColor(targetElement, newColor) {
        targetElement.style.backgroundColor = newColor;

        const icons = targetElement.querySelectorAll('i');
        
        // Determinar si usar texto azul (para fondo claro) o blanco (para fondo oscuro)
        if (newColor === '#f8f9fa') { // Color claro de Bootstrap
            targetElement.style.color = '#0d6efd'; // Texto en azul primario (bg-primary)
            icons.forEach(icon => {
                icon.style.color = '#0d6efd';
            });
        } else {
            targetElement.style.color = '#ffffff'; // Texto en color blanco
            icons.forEach(icon => {
                icon.style.color = '#ffffff';
            });
        }
    }

    // Listener para guardar el id antes de que se muestre el modal (show.bs.modal)
    modalElement.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        targetCategoryId = button.getAttribute('data-target-id');
        console.log(`Modal abierto para: ${targetCategoryId}`);
    });

    // Listener para cuando se hace clic en un cuadradito de color
    const colorSwatches = document.querySelectorAll('.color-swatch');

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (event) => {
            const clickedElement = event.currentTarget;
            
            if (targetCategoryId) {
                const newColor = clickedElement.getAttribute('data-color');
                const targetLi = document.getElementById(targetCategoryId);

                if (targetLi) {
                    // Aplicación del color y cambio del contraste por lo de que cuando esté el fondo blanco que no se ponga en blanco el texto ni el icono, sino que cambien estos a azul.
                    applyColor(targetLi, newColor);

                    // Almacenaje del nuevo color
                    // Lectura de los colores existentes
                    const savedColorsJSON = localStorage.getItem(STORAGE_KEY) || '{}';
                    const savedColors = JSON.parse(savedColorsJSON);

                    // Actualización del color para la categoría actual
                    savedColors[targetCategoryId] = newColor;

                    // Guardado de la lista actualizada
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedColors));

                    // Cierre del modal de Bootstrap
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();

                    if (targetLi.classList.contains('category-active') || targetLi.classList.contains('category-active-whiteBack')) {
                        // Uso la función de setActiveCategorie para que detecte que cuando se cambia el color del fondo se ponga el borde del color correspondiente al elegido.
                        setActiveCategory(targetCategoryId); 
                    }
                }
            }
        });
    });

    // Hago que la función loadSavedColors sea accesible haciendo que changeColorCategories retorne el objeto loadColors que permite que la función principalmente mencionada sea llamada desde otro archivo como en este caso calls.js (que lo necesito para que la lógica de que se guarden los colores de las categorías se ejecute o cargue después de las propias categorías)
    return {
        loadColors: loadSavedColors
    }
}

// Asignar qué catego´ria es la que está activa
function setActiveCategory(activeCategoryId) {
    const allCategories = document.querySelectorAll('#category-list li');
    allCategories.forEach(li => li.classList.remove('category-active', 'category-active-whiteBack'));
    
    const currentActiveLi = document.getElementById(activeCategoryId);
    if(currentActiveLi) {
        const bgColor = currentActiveLi.style.backgroundColor;
        if (bgColor === 'rgb(248, 249, 250)' || bgColor === '#f8f9fa') {
            // Si el fondo es blanco, en azul (el bg-primary de Bootstrap)
            currentActiveLi.classList.add('category-active-whiteBack');
        } else {
            // Si el fondo es oscuro, en blanco
            currentActiveLi.classList.add('category-active');
        }
    }
}
