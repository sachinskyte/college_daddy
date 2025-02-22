// Main application logic
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        displaySemesters();
    } catch (error) {
        showError('Failed to load data');
    }
});

async function loadData() {
    const response = await fetch('/data/notes-data.json');
    if (!response.ok) throw new Error('Failed to load data');
    window.notesData = await response.json();
}

function displaySemesters() {
    const content = document.getElementById('content');
    content.className = 'grid';
    content.innerHTML = '';

    window.notesData.semesters.forEach(semester => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h2>Semester ${semester.id}</h2>`;
        card.onclick = () => displayBranches(semester.id);
        content.appendChild(card);
    });
}

function displayBranches(semesterId) {
    const semester = window.notesData.semesters.find(s => s.id === semesterId);
    const content = document.getElementById('content');
    content.innerHTML = '';

    semester.branches.forEach(branch => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h2>${branch.name}</h2>`;
        card.onclick = () => displaySubjects(semesterId, branch.id);
        content.appendChild(card);
    });

    navigationState.semester = semesterId;
    updateBreadcrumb();
}

function displaySubjects(semesterId, branchId) {
    const semester = window.notesData.semesters.find(s => s.id === semesterId);
    const branch = semester.branches.find(b => b.id === branchId);
    const content = document.getElementById('content');
    content.innerHTML = '';

    branch.subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h2>${subject.name}</h2>`;
        card.onclick = () => displayMaterials(semesterId, branchId, subject.id);
        content.appendChild(card);
    });

    navigationState.semester = semesterId;
    navigationState.branch = branchId;
    updateBreadcrumb();
}

function displayMaterials(semesterId, branchId, subjectId) {
    const semester = window.notesData.semesters.find(s => s.id === semesterId);
    const branch = semester.branches.find(b => b.id === branchId);
    const subject = branch.subjects.find(s => s.id === subjectId);
    const content = document.getElementById('content');
    content.innerHTML = '';

    subject.materials.forEach(material => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${material.title}</h3>
            <p>${material.description}</p>
            <p>Size: ${material.size}</p>
            <p>Uploaded: ${new Date(material.uploadDate).toLocaleDateString()}</p>
            <a href="${material.path}" target="_blank" class="download-btn">Download PDF</a>
        `;
        content.appendChild(card);
    });

    navigationState.semester = semesterId;
    navigationState.branch = branchId;
    navigationState.subject = subjectId;
    updateBreadcrumb();
}