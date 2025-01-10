

function toggleResultsTable() {
    const table = document.getElementById('results-table');
    const isChecked = document.getElementById('toggleTable').checked;
    table.style.display = isChecked ? 'table' : 'none';
}

function toggleResultsTable() {
    const table = document.getElementById('gradeTable');
    const isChecked = document.getElementById('toggleTable').checked;
    table.style.display = isChecked ? 'table' : 'none';
}

const gradeScale = [
    { grade: 'O', points: 10, minMarks: 90 },
    { grade: 'A+', points: 9, minMarks: 80 },
    { grade: 'A', points: 8, minMarks: 70 },
    { grade: 'B+', points: 7, minMarks: 60 },
    { grade: 'C+', points: 6, minMarks: 50 },
    { grade: 'C', points: 5, minMarks: 40 },
    { grade: 'F', points: 0, minMarks: 0 }
];

function getInputValue(id) {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
        input.value = '';
        return 0;
    }
    return parseFloat(input.value) || 0;
}

function calculateMarks() {
    // Get input values
    const series1 = getInputValue('series1');
    const series2 = getInputValue('series2');
    const series3 = getInputValue('series3');
    const assignment1 = getInputValue('assignment1');
    const assignment2 = getInputValue('assignment2');
    const module1 = getInputValue('module1');
    const module2 = getInputValue('module2');
    const module3 = getInputValue('module3');
    const graceMarks = getInputValue('graceMarks');

    // Calculate scaled marks
    const seriesAvg = (series1 + series2 + series3) / 3;
    const scaledSeries = (seriesAvg / 50) * 25;

    const assignmentAvg = (assignment1 + assignment2) / 2;
    const scaledAssignments = assignmentAvg;

    const moduleAvg = (module1 + module2 + module3) / 3;
    const scaledModules = (moduleAvg / 10) * 15;

    // Calculate total
    const total = Math.round(scaledSeries + scaledAssignments + scaledModules + graceMarks);

    // Display results
    document.getElementById('results').style.display = 'block';
    document.getElementById('scaledSeries').textContent = scaledSeries.toFixed(2) + '/25';
    document.getElementById('scaledAssignments').textContent = scaledAssignments.toFixed(2) + '/10';
    document.getElementById('scaledModules').textContent = scaledModules.toFixed(2) + '/15';
    document.getElementById('graceMarksDisplay').textContent = graceMarks.toFixed(2);
    document.getElementById('totalMarks').textContent = total + '/50';

    // Update eligibility
    const eligibilityDiv = document.getElementById('eligibility');
    if (total >= 20) {
        eligibilityDiv.className = 'eligibility eligible';
        eligibilityDiv.innerHTML = '<i class="fas fa-check-circle"></i> Eligible to attempt SEE exam';
        calculateRequiredSEE(total);
        document.getElementById('gradeTable').style.display = 'table';
    } else {
        eligibilityDiv.className = 'eligibility not-eligible';
        eligibilityDiv.innerHTML = '<i class="fas fa-times-circle"></i> Not eligible to attempt SEE exam';
        document.getElementById('gradeTable').style.display = 'none';
    }
}

function calculateRequiredSEE(internalMarks) {
    const tbody = document.getElementById('gradeTableBody');
    tbody.innerHTML = '';

    gradeScale.forEach(({grade, points, minMarks}) => {
        const requiredTotal = minMarks;
        const requiredSEE = Math.ceil((requiredTotal - internalMarks) * 2);
        
        if (requiredSEE <= 100 && requiredSEE > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${grade}</td>
                <td>${points}</td>
                <td>${requiredSEE}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Initialize input handling
function initializeInputs() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (!this.value.trim()) {
                this.value = '';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');

    menuButton.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        menuButton.setAttribute('aria-expanded', isExpanded);
    });

    // Initialize input handling
    initializeInputs();
});