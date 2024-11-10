// Resource management functionality
class ResourceManager {
    constructor() {
        this.resources = JSON.parse(localStorage.getItem('resources')) || [];
        this.savedResources = JSON.parse(localStorage.getItem('savedResources')) || [];
    }

    addResource(resource) {
        const newResource = {
            ...resource,
            id: Date.now(),
            dateAdded: new Date().toISOString(),
            views: 0,
            likes: 0
        };

        this.resources.push(newResource);
        this.saveToStorage();
        return newResource;
    }

    incrementViews(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            resource.views++;
            this.saveToStorage();
        }
    }

    saveResource(resourceId) {
        if (!this.savedResources.includes(resourceId)) {
            this.savedResources.push(resourceId);
            localStorage.setItem('savedResources', JSON.stringify(this.savedResources));
        }
    }

    getSavedResources() {
        return this.resources.filter(r => 
            this.savedResources.includes(r.id)
        );
    }

    validateResource(resource) {
        const errors = [];
        
        if (!resource.title || resource.title.length < 3) {
            errors.push('Title must be at least 3 characters long');
        }

        if (!resource.url || !this.isValidUrl(resource.url)) {
            errors.push('Please enter a valid URL');
        }

        if (!resource.description || resource.description.length < 10) {
            errors.push('Description must be at least 10 characters long');
        }

        if (!resource.subject) {
            errors.push('Please select a subject');
        }

        return errors;
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    saveToStorage() {
        localStorage.setItem('resources', JSON.stringify(this.resources));
    }
}

// Initialize Resource Manager
const resourceManager = new ResourceManager();
