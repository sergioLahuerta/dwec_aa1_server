// La clave para guardar los colores en localStorage
const STORAGE_KEY = 'categoryColors';

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
            targetElement.style.color = '#0d6efd'; // Texto Azul Primario
            icons.forEach(icon => {
                icon.style.color = '#0d6efd';
            });
        } else {
            targetElement.style.color = '#ffffff'; // Texto Blanco
            icons.forEach(icon => {
                icon.style.color = '#ffffff';
            });
        }
    }

    // Listener para guardar el ID ANTES de que se muestre el modal (show.bs.modal)
    modalElement.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        targetCategoryId = button.getAttribute('data-target-id');
        console.log(`Modal abierto para: ${targetCategoryId}`);
    });

    // Listener para cuando se hace clic en un cuadrado de color
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
                }
            }
        });
    });

    // LLAMADA FINAL: Ejecutar la carga de colores guardados al finalizar la configuración.
    loadSavedColors();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    changeColorCategories();
});