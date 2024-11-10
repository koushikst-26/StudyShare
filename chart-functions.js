// Chart initialization and data handling functions
function initializeCharts() {
    // Resources by Subject Chart
    const subjectData = getSubjectDistribution();
    new Chart(document.getElementById('subjectChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(subjectData),
            datasets: [{
                data: Object.values(subjectData),
                backgroundColor: [
                    '#2563eb',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd',
                    '#bfdbfe'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Resources by Subject'
                }
            }
        }
    });

    // Resources Timeline Chart
    const timelineData = getTimelineData();
    new Chart(document.getElementById('timelineChart'), {
        type: 'line',
        data: {
            labels: timelineData.labels,
            datasets: [{
                label: 'Resources Added',
                data: timelineData.data,
                borderColor: '#2563eb',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Most Viewed Resources Chart
    const viewsData = getMostViewedResources();
    new Chart(document.getElementById('viewsChart'), {
        type: 'bar',
        data: {
            labels: viewsData.labels,
            datasets: [{
                label: 'Views',
                data: viewsData.data,
                backgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getSubjectDistribution() {
    return resources.reduce((acc, resource) => {
        acc[resource.subject] = (acc[resource.subject] || 0) + 1;
        return acc;
    }, {});
}

function getTimelineData() {
    const dates = resources.map(r => new Date(r.dateAdded).toLocaleDateString());
    const uniqueDates = [...new Set(dates)].sort();
    
    const data = uniqueDates.map(date => 
        resources.filter(r => 
            new Date(r.dateAdded).toLocaleDateString() === date
        ).length
    );

    return {
        labels: uniqueDates,
        data: data
    };
}

function getMostViewedResources() {
    const topResources = resources
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    return {
        labels: topResources.map(r => r.title),
        data: topResources.map(r => r.views)
    };
}
