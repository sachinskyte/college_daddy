// Grade scale definition
const gradeScale = [
    { grade: 'O', points: 10, minMarks: 90 },
    { grade: 'A+', points: 9, minMarks: 80 },
    { grade: 'A', points: 8, minMarks: 70 },
    { grade: 'B+', points: 7, minMarks: 60 },
    { grade: 'C+', points: 6, minMarks: 50 },
    { grade: 'C', points: 5, minMarks: 40 },
    { grade: 'F', points: 0, minMarks: 0 }
];

// Utility function to safely get input values with error handling
function getInputValue(id) {
    try {
        const input = document.getElementById(id);
        if (!input) {
            console.warn(`Input element with id '${id}' not found`);
            return 0;
        }
        const value = input.value.trim();
        if (!value) return 0;
        
        const numValue = parseFloat(value);
        return isNaN(numValue) ? 0 : numValue;
    } catch (error) {
        console.error(`Error getting input value for ${id}:`, error);
        return 0;
    }
}

// Toggle lab assessment section visibility
function toggleLabSection() {
    try {
        const isLabMode = document.getElementById('labMode')?.checked || false;
        const labSection = document.getElementById('labSection');
        const labResults = document.getElementById('labResults');
        const totalMarks = document.getElementById('totalMarks');
        const gradeTable = document.getElementById('gradeTable');
        const resultsSection = document.getElementById('results');

        if (labSection) {
            labSection.style.display = isLabMode ? 'block' : 'none';
        }
        if (labResults) {
            labResults.style.display = isLabMode ? 'block' : 'none';
        }
        if (totalMarks) {
            totalMarks.textContent = `0/${isLabMode ? '100' : '50'}`;
        }
        if (gradeTable) {
            const thirdHeader = gradeTable.querySelector('thead th:last-child');
            if (thirdHeader) {
                thirdHeader.textContent = isLabMode ? 'Achievable Grade' : 'Required SEE Marks';
            }
            gradeTable.style.display = 'none';
        }
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }

        // Reset form
        document.getElementById('marksForm').reset();
        
        // Reset all result displays
        resetDisplays();
    } catch (error) {
        console.error('Error in toggleLabSection:', error);
    }
}

// Reset all displays
function resetDisplays() {
    try {
        const elements = {
            'scaledSeries': '0/25',
            'scaledAssignments': '0/10',
            'scaledModules': '0/15',
            'graceMarksDisplay': '0',
            'labInternalMarks': '0/25',
            'labExternalMarks': '0/25',
            'theoryExternalMarks': '0/25'
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }

        const eligibilityDiv = document.getElementById('eligibility');
        if (eligibilityDiv) {
            eligibilityDiv.innerHTML = '';
            eligibilityDiv.className = 'eligibility';
        }
    } catch (error) {
        console.error('Error in resetDisplays:', error);
    }
}

// Calculate marks based on the selected mode
function calculateMarks(event) {
    try {
        // Prevent form submission if called from form
        if (event) {
            event.preventDefault();
        }

        const isLabMode = document.getElementById('labMode')?.checked || false;
        const resultsSection = document.getElementById('results');
        
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }

        isLabMode ? calculateLabMode() : calculateRegularMode();
    } catch (error) {
        console.error('Error in calculateMarks:', error);
    }
}
function calculateRegularMode() {
    try {
        // Get all marks
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
        const assignmentTotal = assignment1 + assignment2;
        const scaledAssignments = (assignmentTotal / 20) * 10;
        const moduleTotal = module1 + module2 + module3;
        const scaledModules = (moduleTotal / 30) * 15;

        // Update displays
        updateScaledMarksDisplay(scaledSeries, scaledAssignments, scaledModules, graceMarks);

        // Calculate total
        const total = scaledSeries + scaledAssignments + scaledModules + graceMarks;
        
        // Update total display
        const totalMarksElement = document.getElementById('totalMarks');
        if (totalMarksElement) {
            totalMarksElement.textContent = `${total.toFixed(2)}/50`;
        }

        // Check eligibility and display grades
        checkEligibilityAndDisplayGrades(total, false);
    } catch (error) {
        console.error('Error in calculateRegularMode:', error);
    }
}
// Calculate marks in regular mode
function calculateLabMode() {
    try {
        // Helper to get and parse input values
        const getInputValue = (id) => {
            const value = parseFloat(document.getElementById(id)?.value || "0");
            if (isNaN(value)) throw new Error(`Invalid input for ${id}`);
            return value;
        };

        // Get all marks
        const series1 = getInputValue('series1');
        const series2 = getInputValue('series2');
        const series3 = getInputValue('series3');
        const assignment1 = getInputValue('assignment1');
        const assignment2 = getInputValue('assignment2');
        const module1 = getInputValue('module1');
        const module2 = getInputValue('module2');
        const module3 = getInputValue('module3');
        const labInternal = getInputValue('labInternal');
        const labExternal = getInputValue('labExternal');
        const theoryExternal = getInputValue('theoryExternal');

        // Series Test: (50 + 50 + 50) / 3 / 2 = 25
        const seriesAvg = ((series1 + series2 + series3) / 3) / 2;

        // Module Test: (30 / 2 = 15)
        const moduleTotal = (module1 + module2 + module3) / 2;

        // Assignment: (10 + 10) / 2 = 10
        const assignmentAvg = (assignment1 + assignment2) / 2;

        // Total Internal: 25 + 15 + 10 = 50, scaled to 25
        const totalInternal = (seriesAvg + moduleTotal + assignmentAvg) / 2;

        // Lab Internal: (50 / 2 = 25)
        const labInternalMarks = labInternal / 2;

        // Lab External: (50 / 2 = 25)
        const labExternalMarks = labExternal / 2;

        // Theory External: Convert 100 to 25
        const theoryExternalMarks = (theoryExternal / 100) * 25;

        // Calculate Final Total
        const total = totalInternal + labInternalMarks + labExternalMarks + theoryExternalMarks;

        // Update UI (Assume these functions exist and are defined elsewhere)
        updateScaledMarksDisplay(totalInternal, assignmentAvg, moduleTotal, 0);
        updateLabMarksDisplay(labInternalMarks, labExternalMarks, theoryExternalMarks);

        // Update total marks display
        const totalMarksElement = document.getElementById('totalMarks');
        if (totalMarksElement) {
            totalMarksElement.textContent = `${total.toFixed(2)}/100`;
        }

        // Check eligibility and display grades
        checkEligibilityAndDisplayGrades(total, true);
    } catch (error) {
        console.error('Error in calculateLabMode:', error.message);
        alert('An error occurred while calculating marks. Please check your inputs and try again.');
    }
}


// Calculate marks in lab mode
// Calculate marks in lab mode
function calculateLabMode() {
    try {
        // Helper to get and parse input values
        const getInputValue = (id) => {
            const value = parseFloat(document.getElementById(id)?.value || "0");
            if (isNaN(value)) throw new Error(`Invalid input for ${id}`);
            return value;
        };

        // Get all marks
        const series1 = getInputValue('series1');
        const series2 = getInputValue('series2');
        const series3 = getInputValue('series3');
        const assignment1 = getInputValue('assignment1');
        const assignment2 = getInputValue('assignment2');
        const module1 = getInputValue('module1');
        const module2 = getInputValue('module2');
        const module3 = getInputValue('module3');
        const labInternal = getInputValue('labInternal');
        const labExternal = getInputValue('labExternal');
        const theoryExternal = getInputValue('theoryExternal');

        // Series Test: (50 + 50 + 50) / 3 / 2 = 25
        const seriesAvg = ((series1 + series2 + series3) / 3) / 2;

        // Module Test: (30 / 2 = 15)
        const moduleTotal = (module1 + module2 + module3) / 2;

        // Assignment: (10 + 10) / 2 = 10
        const assignmentAvg = (assignment1 + assignment2) / 2;

        // Total Internal: 25 + 15 + 10 = 50, scaled to 25
        const totalInternal = (seriesAvg + moduleTotal + assignmentAvg) / 2;

        // Lab Internal: (50 / 2 = 25)
        const labInternalMarks = labInternal / 2;

        // Lab External: (50 / 2 = 25)
        const labExternalMarks = labExternal / 2;

        // Theory External: Convert 100 to 25
        const theoryExternalMarks = (theoryExternal / 100) * 25;

        // Calculate Final Total
        const total = totalInternal + labInternalMarks + labExternalMarks + theoryExternalMarks;

        // Update UI (Assume these functions exist and are defined elsewhere)
        updateScaledMarksDisplay(totalInternal, assignmentAvg, moduleTotal, 0);
        updateLabMarksDisplay(labInternalMarks, labExternalMarks, theoryExternalMarks);

        // Update total marks display
        const totalMarksElement = document.getElementById('totalMarks');
        if (totalMarksElement) {
            totalMarksElement.textContent = `${total.toFixed(2)}/100`;
        }

        // Check eligibility and display grades
        checkEligibilityAndDisplayGrades(total, true);
    } catch (error) {
        console.error('Error in calculateLabMode:', error.message);
        alert('An error occurred while calculating marks. Please check your inputs and try again.');
    }
}


// Update scaled marks display
function updateScaledMarksDisplay(series, assignments, modules, grace) {
    try {
        const elements = {
            'scaledSeries': `${series.toFixed(2)}/25`,
            'scaledAssignments': `${assignments.toFixed(2)}/10`,
            'scaledModules': `${modules.toFixed(2)}/15`,
            'graceMarksDisplay': grace.toFixed(2)
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    } catch (error) {
        console.error('Error in updateScaledMarksDisplay:', error);
    }
}

// Update lab marks display
function updateLabMarksDisplay(internal, external, theory) {
    try {
        const elements = {
            'labInternalMarks': `${internal.toFixed(2)}/25`,
            'labExternalMarks': `${external.toFixed(2)}/25`,
            'theoryExternalMarks': `${theory.toFixed(2)}/25`
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    } catch (error) {
        console.error('Error in updateLabMarksDisplay:', error);
    }
}

// Check eligibility and display grades
function checkEligibilityAndDisplayGrades(total, isLabMode) {
    try {
        const eligibilityDiv = document.getElementById('eligibility');
        const gradeTable = document.getElementById('gradeTable');
        
        if (!eligibilityDiv || !gradeTable) return;

        const threshold = isLabMode ? 40 : 20;
        const isEligible = total >= threshold;

        eligibilityDiv.className = `eligibility ${isEligible ? 'eligible' : 'not-eligible'}`;
        eligibilityDiv.innerHTML = isEligible ?
            '<i class="fas fa-check-circle"></i> Eligible to attempt SEE exam' :
            '<i class="fas fa-times-circle"></i> Not eligible to attempt SEE exam';

        gradeTable.style.display = isEligible ? 'table' : 'none';
        
        if (isEligible) {
            displayGradeTable(total, isLabMode);
        }
    } catch (error) {
        console.error('Error in checkEligibilityAndDisplayGrades:', error);
    }
}

// Display grade table
function displayGradeTable(currentMarks, isLabMode) {
    try {
        const tbody = document.getElementById('gradeTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        gradeScale.forEach(({ grade, points, minMarks }) => {
            if (isLabMode) {
                if (currentMarks >= minMarks) {
                    addGradeRow(tbody, grade, points, minMarks);
                }
            } else {
                const requiredSEE = Math.ceil((minMarks - currentMarks) * 2);
                if (requiredSEE <= 100 && requiredSEE > 0) {
                    addGradeRow(tbody, grade, points, requiredSEE);
                }
            }
        });
    } catch (error) {
        console.error('Error in displayGradeTable:', error);
    }
}

// Add a row to the grade table
function addGradeRow(tbody, grade, points, marks) {
    try {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade}</td>
            <td>${points}</td>
            <td>${marks}</td>
        `;
        tbody.appendChild(row);
    } catch (error) {
        console.error('Error in addGradeRow:', error);
    }
}

// Validate number input
function validateInput(input) {
    try {
        if (!input) return;
        
        if (input.value.trim() === '') {
            input.value = '';
            return;
        }

        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || 100;
        const step = parseFloat(input.step) || 0.5;
        let value = parseFloat(input.value);

        if (!isNaN(value)) {
            // Round to the nearest step
            value = Math.round(value / step) * step;
            // Clamp between min and max
            value = Math.min(Math.max(value, min), max);
            input.value = value;
        }
    } catch (error) {
        console.error('Error in validateInput:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize menu button
        const menuButton = document.querySelector('.menu-button');
        const navLinks = document.querySelector('.nav-links');

        if (menuButton && navLinks) {
            menuButton.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                this.setAttribute('aria-expanded', navLinks.classList.contains('active'));
            });
        }

        // Initialize form
        const form = document.getElementById('marksForm');
        if (form) {
            form.addEventListener('submit', calculateMarks);
        }

        // Initialize lab mode toggle
        const labMode = document.getElementById('labMode');
        if (labMode) {
            labMode.addEventListener('change', toggleLabSection);
        }

        // Initialize input validation
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateInput(this);
            });
        });

        // Initial setup
        toggleLabSection();
    } catch (error) {
        console.error('Error in initialization:', error);
    }
});
