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
        const url = `${this.endpoint}${path}/${id}`

        try {
            const response = await fetch(url, {
                method: 'DELETE'
            })
             
            if(!response.ok) {
                throw new Error (`Error HTTP: ${response.status}, el servidor no responde.`)
            }
            
            if (response.status === 204) {
                return {}; // Devuelvo un objeto vacío para indicar éxito sin contenido
            }

            return true;
        }

        catch (error){
            console.error('Error en la API para:', path, error);
            return null;
        }
    }

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

    async postSite(categoryId, siteName, siteUrl, user, password) {
        const path = `/categories/${categoryId}`
        const apiUrl = `${this.endpoint}${path}`

        const siteData = {
            name: siteName,
            url: siteUrl,
            user: user,
            password: password,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(siteData)
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

    async putPasswordSite(id, password) {
        const path = "/sites"
        const url = `${this.endpoint}${path}/${id}`

        const updateSiteData = {
            password: password
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateSiteData)
            })

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}, error en el servidor.`)
            }

            console.log(response);
            return response.json();
            
        } catch (error) {
            console.error('Error en la Api para: ', path, error)
            return null;
        }
    } 

    async deleteSite(id) {
        const path = '/sites'
        const url = `${this.endpoint}${path}/${id}`

        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`ERROR HTTP: ${response.status}, el servidor no responde`)
            }

            return true;

        } catch (error) {
            console.log('Error en la Api para: ', path, error);
        }
    }
}