
let progressChart = null;
let semesterChart = null;

// Initialize tooltips
document.querySelectorAll('.tooltip i').forEach(tooltip => {
    tooltip.addEventListener('mouseenter', (e) => {
        const title = e.target.getAttribute('title');
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'absolute bg-gray-800 text-white p-2 rounded text-sm z-10 -mt-12 -ml-2';
        tooltipDiv.style.whiteSpace = 'nowrap';
        tooltipDiv.textContent = title;
        e.target.parentNode.appendChild(tooltipDiv);
        e.target.removeAttribute('title');
    });

    tooltip.addEventListener('mouseleave', (e) => {
        const tooltipDiv = e.target.parentNode.querySelector('div');
        if (tooltipDiv) {
            e.target.setAttribute('title', tooltipDiv.textContent);
            tooltipDiv.remove();
        }
    });
});

function calculate() {
    // Reset previous results
    document.getElementById('error').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    
    // Get input values
    const currentCGPA = parseFloat(document.getElementById('currentCGPA').value);
    const completedSem = parseInt(document.getElementById('completedSem').value);
    const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
    
    // Validate inputs
    if (!currentCGPA || !completedSem || !targetCGPA) {
        showError('Please fill in all fields');
        return;
    }
    
    if (currentCGPA < 0 || currentCGPA > 10 || targetCGPA < 0 || targetCGPA > 10) {
        showError('CGPA must be between 0 and 10');
        return;
    }
    
    if (completedSem < 1 || completedSem >= 8) {
        showError('Completed semesters must be between 1 and 7');
        return;
    }
    
    // Calculate
    const remainingSem = 8 - completedSem;
    const requiredCGPA = ((targetCGPA * 8) - (currentCGPA * completedSem)) / remainingSem;
    
    if (requiredCGPA > 10) {
        const maxPossible = ((currentCGPA * completedSem + 10 * remainingSem) / 8).toFixed(2);
        showError(`Target CGPA is not achievable. Maximum possible CGPA is ${maxPossible}`);
        return;
    }
    
    // Display results
    document.getElementById('requiredCGPA').textContent = requiredCGPA.toFixed(2);
    document.getElementById('remainingSem').textContent = remainingSem;
    document.getElementById('result').style.display = 'block';
    
    // Update charts
    updateCharts(currentCGPA, completedSem, targetCGPA, requiredCGPA, remainingSem);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function updateCharts(currentCGPA, completedSem, targetCGPA, requiredCGPA, remainingSem) {
    // Progress Chart
    const ctxProgress = document.getElementById('progressChart').getContext('2d');
    if (progressChart) progressChart.destroy();

    progressChart = new Chart(ctxProgress, {
        type: 'line',
        data: {
            labels: ['Current', 'Target'],
            datasets: [{
                label: 'CGPA Progress',
                data: [currentCGPA, targetCGPA],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'CGPA Progress Trajectory',
                    color: '#fff'
                },
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: { color: '#333' },
                    ticks: { color: '#fff' }
                },
                x: {
                    grid: { color: '#333' },
                    ticks: { color: '#fff' }
                }
            }
        }
    });

    // Semester Chart
    const ctxSemester = document.getElementById('semesterChart').getContext('2d');
    if (semesterChart) semesterChart.destroy();

    const semesterLabels = Array.from({ length: remainingSem }, (_, i) => `Sem ${completedSem + i + 1}`);
    const requiredCGPAs = Array(remainingSem).fill(requiredCGPA);

    semesterChart = new Chart(ctxSemester, {
        type: 'bar',
        data: {
            labels: semesterLabels,
            datasets: [{
                label: 'Required CGPA',
                data: requiredCGPAs,
                backgroundColor: '#009dff',
                borderColor: '#0088cc',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Required CGPA per Semester',
                    color: '#fff'
                },
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: { color: '#333' },
                    ticks: { color: '#fff' }
                },
                x: {
                    grid: { color: '#333' },
                    ticks: { color: '#fff' }
                }
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');

    menuButton.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
        }
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
        }
    });
});