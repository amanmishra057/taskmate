// assets/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const projectsList = document.getElementById('projects-list');
    const createProjectForm = document.getElementById('create-project-form');
    const logoutBtn = document.getElementById('logout-btn');

    async function loadProjects() {
        try {
            const projects = await api.getProjects();
            projectsList.innerHTML = '';
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `<h3>${project.name}</h3><p>${project.description || ''}</p>`;
                projectCard.addEventListener('click', () => {
                    window.location.href = `/project.html?id=${project.id}&name=${encodeURIComponent(project.name)}`;
                });
                projectsList.appendChild(projectCard);
            });
        } catch (error) {
            console.error('Failed to load projects:', error);
            if (error.message.includes('401') || error.message.includes('403')) {
                logout();
            }
        }
    }

    createProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('project-name').value;
        const description = document.getElementById('project-description').value;

        try {
            await api.createProject(name, description);
            createProjectForm.reset();
            loadProjects();
        } catch (error) {
            alert(`Error creating project: ${error.message}`);
        }
    });

    logoutBtn.addEventListener('click', logout);

    function logout() {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
    }

    loadProjects();
});