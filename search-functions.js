// Advanced search and filter functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const subjectFilter = document.getElementById('subjectFilter');
    const sortSelect = document.getElementById('sortSelect');
    const resourceGrid = document.getElementById('resourceGrid');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const subject = subjectFilter.value;
        const sortBy = sortSelect.value;

        let filteredResources = resources.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                                resource.description.toLowerCase().includes(searchTerm);
            const matchesSubject = !subject || resource.subject === subject;
            return matchesSearch && matchesSubject;
        });

        // Sort results
        switch(sortBy) {
            case 'date':
                filteredResources.sort((a, b) => 
                    new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'views':
                filteredResources.sort((a, b) => b.views - a.views);
                break;
            case 'title':
                filteredResources.sort((a, b) => 
                    a.title.localeCompare(b.title));
                break;
        }

        renderSearchResults(filteredResources);
    }

    function renderSearchResults(results) {
        if (results.length === 0) {
            resourceGrid.innerHTML = `
                <div class="no-results">
                    <h3>No resources found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
            return;
        }

        resourceGrid.innerHTML = results.map(resource => `
            <div class="resource-card" data-id="${resource.id}">
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <div class="resource-meta">
                    <span class="subject">${resource.subject}</span>
                    <span class="date">${new Date(resource.dateAdded).toLocaleDateString()}</span>
                    <span class="views">${resource.views} views</span>
                </div>
                <div class="resource-actions">
                    <a href="${resource.url}" target="_blank" 
                       class="btn btn-primary" 
                       onclick="incrementViews(${resource.id})">
                        View Resource
                    </a>
                    <button onclick="saveResource(${resource.id})" 
                            class="btn btn-secondary">
                        Save for Later
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Event listeners
    searchInput.addEventListener('input', debounce(performSearch, 300));
    subjectFilter.addEventListener('change', performSearch);
    sortSelect.addEventListener('change', performSearch);
}

// Utility function for debouncing search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
