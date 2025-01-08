
function calculateMarks() {
    // Get input values
    const series1 = parseFloat(document.getElementById('series1').value) || 0;
    const series2 = parseFloat(document.getElementById('series2').value) || 0;
    const series3 = parseFloat(document.getElementById('series3').value) || 0;
    const assignment1 = parseFloat(document.getElementById('assignment1').value) || 0;
    const assignment2 = parseFloat(document.getElementById('assignment2').value) || 0;
    const module1 = parseFloat(document.getElementById('module1').value) || 0;
    const module2 = parseFloat(document.getElementById('module2').value) || 0;
    const module3 = parseFloat(document.getElementById('module3').value) || 0;
    const graceMarks = parseFloat(document.getElementById('graceMarks').value) || 0;

    // Calculate scaled marks
    const seriesAvg = (series1 + series2 + series3) / 3;
    const scaledSeries = (seriesAvg / 50) * 25;

    const assignmentAvg = (assignment1 + assignment2) / 2;
    const scaledAssignments = assignmentAvg;

    const moduleAvg = (module1 + module2 + module3) / 3;
    const scaledModules = (moduleAvg / 10) * 15;

    // Calculate total
    const total = Math.round(scaledSeries + scaledAssignments + scaledModules + graceMarks);

    // Display results with smooth animation
    const results = document.getElementById('results');
    results.style.display = 'block';
    results.style.opacity = '0';
    setTimeout(() => {
        results.style.opacity = '1';
        results.style.transition = 'opacity 0.3s ease';
    }, 50);

    // Update all result values
    document.getElementById('scaledSeries').textContent = scaledSeries.toFixed(2) + '/25';
    document.getElementById('scaledAssignments').textContent = scaledAssignments.toFixed(2) + '/10';
    document.getElementById('scaledModules').textContent = scaledModules.toFixed(2) + '/15';
    document.getElementById('graceMarksDisplay').textContent = graceMarks.toFixed(2);
    document.getElementById('totalMarks').textContent = total + '/50';

    // Check eligibility
    const eligibilityDiv = document.getElementById('eligibility');
    if (total > 20) {
        eligibilityDiv.className = 'eligibility eligible';
        eligibilityDiv.innerHTML = '<i class="fas fa-check-circle"></i> Eligible to attempt SEE exam';
    } else {
        eligibilityDiv.className = 'eligibility not-eligible';
        eligibilityDiv.innerHTML = '<i class="fas fa-times-circle"></i> Not eligible to attempt SEE exam';
    }
}
