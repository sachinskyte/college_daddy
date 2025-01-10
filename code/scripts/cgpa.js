let progressChart = null;
let semesterChart = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
            }
        });

        // Close menu when window is resized
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Initialize tooltips
    document.querySelectorAll('.tooltip i').forEach(tooltip => {
        const title = tooltip.getAttribute('title');
        
        tooltip.addEventListener('mouseenter', (e) => {
            const tooltipDiv = document.createElement('div');
            tooltipDiv.className = 'tooltip-content';
            tooltipDiv.style.cssText = `
                position: absolute;
                background: var(--bg-darker);
                color: var(--text-light);
                padding: 0.75rem 1rem;
                border-radius: 6px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 1000;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            tooltipDiv.textContent = title;
            tooltip.parentNode.appendChild(tooltipDiv);
            tooltip.removeAttribute('title');
        });

        tooltip.addEventListener('mouseleave', (e) => {
            const tooltipDiv = e.target.parentNode.querySelector('.tooltip-content');
            if (tooltipDiv) {
                tooltip.setAttribute('title', tooltipDiv.textContent);
                tooltipDiv.remove();
            }
        });
    });
});

function calculate() {
    // Reset previous results
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');
    
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    
    // Get input values
    const currentCGPA = parseFloat(document.getElementById('currentCGPA').value);
    const completedSem = parseInt(document.getElementById('completedSem').value);
    const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
    
    // Validate inputs
    if (isNaN(currentCGPA) || isNaN(completedSem) || isNaN(targetCGPA)) {
        showError('Please fill in all fields with valid numbers');
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
    resultDiv.style.display = 'block';
    
    // Update charts
    updateCharts(currentCGPA, completedSem, targetCGPA, requiredCGPA, remainingSem);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.padding = '1rem';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginTop = '1rem';
}

function updateCharts(currentCGPA, completedSem, targetCGPA, requiredCGPA, remainingSem) {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
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
    };

    // Progress Chart
    const ctxProgress = document.getElementById('progressChart');
    if (progressChart) {
        progressChart.destroy();
    }
    
    if (ctxProgress) {
        progressChart = new Chart(ctxProgress.getContext('2d'), {
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
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    title: {
                        display: true,
                        text: 'CGPA Progress Trajectory',
                        color: '#fff'
                    }
                }
            }
        });
    }

    // Semester Chart
    const ctxSemester = document.getElementById('semesterChart');
    if (semesterChart) {
        semesterChart.destroy();
    }
    
    if (ctxSemester) {
        const semesterLabels = Array.from(
            { length: remainingSem },
            (_, i) => `Sem ${completedSem + i + 1}`
        );
        
        semesterChart = new Chart(ctxSemester.getContext('2d'), {
            type: 'bar',
            data: {
                labels: semesterLabels,
                datasets: [{
                    label: 'Required CGPA',
                    data: Array(remainingSem).fill(requiredCGPA),
                    backgroundColor: '#009dff',
                    borderColor: '#0088cc',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    title: {
                        display: true,
                        text: 'Required CGPA per Semester',
                        color: '#fff'
                    }
                }
            }
        });
    }
}