class Api {
    constructor(endpoint) {
        this.endpoint = endpoint
    }

    async getAllCategories() {
        const path = '/categories'
        const url = `${this.endpoint}${path}`

        try {
            const response = await fetch(url)
             
            if(!response.ok) {
                throw new Error (`Error HTTP: ${response.status}, el servidor no responde.`)
            }
            
            return response.json();
        }

        catch (error){
            console.error('Error en la API para:', path, error);
            return null;
        }
    }

    async postCategorie(name, color) {
        const path = '/categories'
        const url = `${this.endpoint}${path}`

        const categoryData = {
            name: name,
            backgroundColor: color
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            if(!response.ok) {
                throw new Error (`Error HTTP: ${response.status}, el servidor no responde.`)
            }
            
            console.log(response);
            return response.json();
        }

        catch (error){
            console.error('Error en la API para:', path, error);
            return null;
        }
    }

    async deleteCategory(id) {
        const path = '/categories'
        const url = `${this.endpoint}${path}${id}`

        try {
            const response = await fetch(url)
             
            if(!response.ok) {
                throw new Error (`Error HTTP: ${response.status}, el servidor no responde.`)
            }
            
            return response.json();
        }

        catch (error){
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
            const response = await fetch(url);

            if(!response.ok) {
                throw new Error(`Error HTTP: ${response.status}, el servidor no responde.`)
            }

            return response.json();
        }
        
        catch(error) {
            console.log('Error en la api para: ', path, error);
            return null;
        }
    }

    // getSites(category) {

    // }
}