// Search functionality
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', debounce(handleSearch, 300));

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
        displaySemesters();
        return;
    }

    const results = searchNotes(searchTerm);
    displaySearchResults(results);
}

function searchNotes(term) {
    const results = [];
    
    window.notesData.semesters.forEach(semester => {
        semester.branches.forEach(branch => {
            branch.subjects.forEach(subject => {
                subject.materials.forEach(material => {
                    if (material.title.toLowerCase().includes(term) ||
                        material.description.toLowerCase().includes(term)) {
                        results.push({
                            semester: semester.id,
                            branch: branch.id,
                            subject: subject.name,
                            material: material
                        });
                    }
                });
            });
        });
    });
    
    return results;
}

function displaySearchResults(results) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (results.length === 0) {
        content.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${result.material.title}</h3>
            <p>${result.material.description}</p>
            <p>Semester ${result.semester} - ${result.branch.toUpperCase()}</p>
        `;
        content.appendChild(card);
    });
}