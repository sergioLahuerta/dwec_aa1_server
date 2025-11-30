class Api {
    constructor(endpoint) {
        this.endpoint = endpoint
    }

    // ------------ Prueba de plantilla para funciones de llamada a la api ------------
    // async _get(path) {
    //     const url = `${this.endpoint}${path}`;
        
    //     try {
    //         Swal.fire({
    //             title: "Cargando",
    //             text: "Obteniendo datos del servidor...",
    //             icon: "info"
    //         });

    //         const response = await fetch(url);

    //         Swal.close(); 
            
    //         if (!response.ok) {
    //             throw new Error(`Error HTTP: ${response.status}. El servidor recoge este error.`);
    //         }

    //         return response.json();

    //     } catch (error) {
    //         Swal.fire({
    //             title: "Error de Conexión",
    //             text: `Fallo al obtener datos de ${path}. ¿Está el backend (npm start) activo?`,
    //             icon: "error"
    //         });
    //         console.error('Error en la API para:', path, error);
    //         // Devuelvo null para que la función que llama (getAllCategories) sepa que falló
    //         return null; 
    //     }
    // }

    async getAllCategories() {
        const path = '/categories'
        const url = `${this.endpoint}${path}`

        try {
            Swal.fire({
                    title: "Cargando",
                    text: "Obteniendo datos del servidor...",
                    icon: "info"
            })

            const response = await fetch(url)
             
            if(!response.ok) {
                throw new Error (`Error HTTP: ${response.status}, el servidor no responde.`)
            }
            
            Swal.close();
            return response.json();

        }

        catch (error){
            Swal.fire({
                title: "Error de Conexión",
                text: `Fallo al obtener datos de ${path}. ¿Está el backend (npm start) activo?`,
                icon: "error"
            });
            console.error('Error en la API para:', path, error);
            return null;
        }
    }

    // async getCategorieById(categorie) {
    //     return this._get('/')
    // }

    async getAllSitesByCat(categoryId) {
        const path = `/categories/${categoryId}`
        const url = `${this.endpoint}${path}`

        try {
            Swal.fire({
                title: "Cargando",
                    text: "Obteniendo datos del servidor...",
                    icon: "info"
            })

            const response = await fetch(url);

            if(!response.ok) {
                throw new Error(`Error HTTP: ${response.status}, el servidor no responde.`)
            }

            Swal.close();

            return response.json();
        }
        
        catch(error) {
            Swal.fire({
                title: "Error de Conexión",
                text: `Fallo al obtener datos de ${path}. ¿Está el backend (npm start) activo?`,
                icon: "error"
            })
            console.log('Error en la api para: ', path, error);
            return null;
        }
    }

    // getSites(category) {

    // }
}