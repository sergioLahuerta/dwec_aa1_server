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

// Generar contraseña segura
function generateSecurePassword(length = 8) { 
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    const allChars = lower + upper + numbers + symbols;

    let password = '';
    
    // Requisitos mínimos de la contraseña
    password += lower.charAt(Math.floor(Math.random() * lower.length));
    password += upper.charAt(Math.floor(Math.random() * upper.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    // Rellenar la longitud que falta con randoms
    for (let i = 4; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Mezclar los caracteres de la contraseña para que los que requiero arriba no estén siempre al principio de la misma
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    return password.substring(0, length);
}


// Poner la contraseña generada por la función de arriba
function setGeneratedPassword(inputId = 'sitePassword') {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput) {
        newPassword = generateSecurePassword();
        passwordInput.value = newPassword;
        
        // Cambiar temporalmente de tipo password el input a tipo text para que el usuario la pueda ver
        passwordInput.type = 'text';
        
        setTimeout(() => {
            passwordInput.type = 'password';
        }, 3000); 
    }
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

// Validaciones:
function validateInput(inputElement) {
    const value = inputElement.value.trim();
    const id = inputElement.id;
    let isValid = true;

    // Mínimo 8 caracteres que es lo que puse en el de generar contraseña segura y porque lo pones tu en el doc del classroom
    if (id === 'sitePassword') {
        if (value.length < 8) {
            isValid = false;
        }
    }

    // Campo obligatorio, required
    if (inputElement.required) {
        if (value === '') {
            isValid = false;
        }
    }

    // Que estñe en formato url
    if (id === 'siteUrl' && value !== '') {
        try {
            new URL(value);
        } catch (e) {
            isValid = false;
        }
    }
    return isValid;
}

function handleValidationOnBlur(event) {
    const inputElement = event.target;
    const isValid = validateInput(inputElement);

    // Limpiar clases previas
    inputElement.classList.remove('is-invalid', 'is-valid');

    if (isValid) {
        // Si es válido, aplicar el feedback positivo
        inputElement.classList.add('is-valid');
        removeFeedbackMessage(inputElement);
        
    } else {
        // Si es inválido, aplicar el feedback negativo
        inputElement.classList.add('is-invalid');
        displayFeedbackMessage(inputElement);
    }
}


//Modales:
// Función para hacer funcional el botón de añadir sitio
const addSiteModalElement = document.getElementById('addSiteModal');
async function openAddSiteModal() {
    document.getElementById('siteForm').reset();
    // Apertura del modal del formulario
    const modalInstance = bootstrap.Modal.getOrCreateInstance(addSiteModalElement);
    modalInstance.show();
}

// Hacer visible el modal para editar la contraseña
let siteIdToUpdate = null; // Guardo el ID del sitio que se está editando
function openEditPasswordModal(siteId) {
    siteIdToUpdate = siteId;

    const modalElement = document.getElementById('editPasswordModal');

    if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    } else {
        console.error("Modal #editPasswordModal no encontrado.");
    }
}