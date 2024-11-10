// Data Storage
let resources = JSON.parse(localStorage.getItem('resources')) || [];

// DOM Elements
const navLinks = document.querySelector('.nav-links');
const mainContent = document.querySelector('.main-content');

// Navigation Handler
function handleNavigation(e) {
    e.preventDefault();
    const path = e.target.getAttribute('data-path');
    renderPage(path);
    window.history.pushState({}, '', path);
}

// Page Rendering
function renderPage(path) {
    switch(path) {
        case '/':
            renderHome();
            break;
        case '/share':
            renderShareResource();
            break;
        case '/find':
            renderFindResource();
            break;
        case '/charts':
            renderCharts();
            break;
        case '/about':
            renderAbout();
            break;
        default:
            renderHome();
    }
}

// Resource Management
function addResource(resource) {
    resources.push({
        ...resource,
        id: Date.now(),
        dateAdded: new Date().toISOString(),
        views: 0
    });
    localStorage.setItem('resources', JSON.stringify(resources));
    return true;
}

function getResources(filters = {}) {
    let filteredResources = [...resources];
    
    if (filters.subject) {
        filteredResources = filteredResources.filter(r => 
            r.subject.toLowerCase() === filters.subject.toLowerCase()
        );
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredResources = filteredResources.filter(r => 
            r.title.toLowerCase().includes(searchTerm) ||
            r.description.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredResources;
}

// Page Render Functions
function renderHome() {
    const template = `
        <div class="hero">
            <h1>Students Shared Resource Library</h1>
            <p>Share and discover the best learning resources</p>
            <div class="btn-group">
                <a href="/find" class="btn btn-primary" data-path="/find">Find Resources</a>
                <a href="/share" class="btn btn-secondary" data-path="/share">Share Resource</a>
            </div>
        </div>
        <div class="container">
            <h2>Recent Resources</h2>
            <div class="resource-grid">
                ${getRecentResources()}
            </div>
        </div>
    `;
    mainContent.innerHTML = template;
    attachEventListeners();
}

function renderShareResource() {
    const template = `
        <div class="container">
            <div class="form-container">
                <h2>Share a Resource</h2>
                <form id="shareForm">
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" id="title" required>
                    </div>
                    <div class="form-group">
                        <label for="url">URL</label>
                        <input type="url" id="url" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <select id="subject" required>
                            <option value="">Select a subject</option>
                            <option value="math">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="programming">Programming</option>
                            <option value="languages">Languages</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Share Resource</button>
                </form>
            </div>
        </div>
    `;
    mainContent.innerHTML = template;
    attachShareFormListener();
}

function renderFindResource() {
    const template = `
        <div class="container">
            <div class="search-container">
                <input type="text" id="searchInput" class="search-input" placeholder="Search resources...">
                <div class="filter-group">
                    <select id="subjectFilter">
                        <option value="">All Subjects</option>
                        <option value="math">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="programming">Programming</option>
                        <option value="languages">Languages</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="resource-grid" id="resourceGrid">
                ${renderResourceCards(resources)}
            </div>
        </div>
    `;
    mainContent.innerHTML = template;
    attachSearchListeners();
}

function renderCharts() {
    const template = `
        <div class="container">
            <div class="charts-container">
                <div class="chart-card">
                    <h3>Resources by Subject</h3>
                    <canvas id="subjectChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Resource Additions Over Time</h3>
                    <canvas id="timelineChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Most Viewed Resources</h3>
                    <canvas id="viewsChart"></canvas>
                </div>
            </div>
        </div>
    `;
    mainContent.innerHTML = template;
    initializeCharts();
}

// Helper Functions
function getRecentResources() {
    return resources
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 6)
        .map(resource => createResourceCard(resource))
        .join('');
}

function createResourceCard(resource) {
    return `
        <div class="resource-card">
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <div class="resource-meta">
                <span>${resource.subject}</span>
                <span>${new Date(resource.dateAdded).toLocaleDateString()}</span>
            </div>
            <a href="${resource.url}" target="_blank" class="btn btn-primary">View Resource</a>
        </div>
    `;
}

// Event Listeners
function attachEventListeners() {
    document.querySelectorAll('[data-path]').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function attachShareFormListener() {
    const form = document.getElementById('shareForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const resource = {
                title: document.getElementById('title').value,
                url: document.getElementById('url').value,
                description: document.getElementById('description').value,
                subject: document.getElementById('subject').value
            };
            if (addResource(resource)) {
                alert('Resource shared successfully!');
                renderPage('/find');
            }
        });
    }
}

function attachSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const subjectFilter = document.getElementById('subjectFilter');
    
    if (searchInput && subjectFilter) {
        const handleSearch = () => {
            const filters = {
                search: searchInput.value,
                subject: subjectFilter.value
            };
            const filteredResources = getResources(filters);
            document.getElementById('resourceGrid').innerHTML = 
                renderResourceCards(filteredResources);
        };
        
        searchInput.addEventListener('input', handleSearch);
        subjectFilter.addEventListener('change', handleSearch);
    }
}

// Charts Initialization
function initializeCharts() {
    // Using Chart.js for visualizations
    const subjectChart = document.getElementById('subjectChart');
    const timelineChart = document.getElementById('timelineChart');
    const viewsChart = document.getElementById('viewsChart');
    
    if (subjectChart && timelineChart && viewsChart) {
        // Initialize charts with data from resources array
        // Implementation depends on Chart.js being loaded
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderPage(window.location.pathname);
    attachEventListeners();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    renderPage(window.location.pathname);
});
