// assets/js/project.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const projectName = urlParams.get('name');

    if (!projectId) {
        window.location.href = '/dashboard.html';
        return;
    }

    document.getElementById('project-name-header').textContent = projectName;

    const columns = document.querySelectorAll('.kanban-column');
    const modal = document.getElementById('task-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    const commentForm = document.getElementById('comment-form');
    const commentsSection = document.getElementById('comments-section');
    const logoutBtn = document.getElementById('logout-btn');

    let draggedTask = null;
    let currentTaskStatus = null;
    let currentTaskId = null;

    async function loadTasks() {
        try {
            const tasks = await api.getTasksForProject(projectId);
            // Clear existing tasks
            document.querySelectorAll('.tasks-container').forEach(container => container.innerHTML = '');
            tasks.forEach(task => {
                const taskCard = createTaskCard(task);
                document.getElementById(`${task.status}-tasks`).appendChild(taskCard);
            });
        } catch (error) {
            console.error('Failed to load tasks:', error);
            if (error.message.includes('401') || error.message.includes('403')) {
                logout();
            }
        }
    }

    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card priority-${task.priority}`;
        card.setAttribute('draggable', 'true');
        card.dataset.taskId = task.id;
        card.innerHTML = `<h4>${task.title}</h4>`;

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('click', () => openModal(task));
        return card;
    }

    function handleDragStart(e) {
        draggedTask = e.target;
        e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
        setTimeout(() => {
            draggedTask.classList.add('dragging');
        }, 0);
    }

    columns.forEach(column => {
        const container = column.querySelector('.tasks-container');
        container.addEventListener('dragover', e => {
            e.preventDefault();
        });

        container.addEventListener('drop', async e => {
            e.preventDefault();
            const newStatus = column.dataset.status;
            const taskId = e.dataTransfer.getData('text/plain');
            const taskElement = document.querySelector(`[data-task-id='${taskId}']`);

            if (taskElement) {
                container.appendChild(taskElement);
                taskElement.classList.remove('dragging');
                try {
                    await api.updateTask(taskId, { status: newStatus });
                } catch (error) {
                    console.error('Failed to update task status:', error);
                    // Optionally, move the card back to its original column
                    loadTasks();
                }
            }
        });
    });

    function openModal(task = null) {
        currentTaskId = task? task.id : null;
        taskForm.reset();
        if (task) {
            document.getElementById('modal-title').textContent = 'Edit Task';
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-priority').value = task.priority || 'medium';
            document.getElementById('task-due-date').value = task.due_date? task.due_date.split('T') : '';
            loadComments(task.id);
        } else {
            document.getElementById('modal-title').textContent = 'Create New Task';
            commentsSection.innerHTML = '<h3>Comments</h3><p>Save the task to add comments.</p>';
        }
        modal.style.display = 'block';
    }

    closeModalBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTaskStatus = btn.dataset.status;
            openModal();
        });
    });

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('task-id').value;
        const taskData = {
            project_id: projectId,
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            priority: document.getElementById('task-priority').value,
            due_date: document.getElementById('task-due-date').value,
            status: currentTaskStatus || 'todo'
        };

        try {
            if (taskId) {
                await api.updateTask(taskId, taskData);
            } else {
                await api.createTask(taskData);
            }
            modal.style.display = 'none';
            loadTasks();
        } catch (error) {
            alert(`Error saving task: ${error.message}`);
        }
    });

    async function loadComments(taskId) {
        try {
            const comments = await api.getCommentsForTask(taskId);
            commentsSection.innerHTML = '';
            comments.forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment';
                commentEl.innerHTML = `
                    <div class="comment-header">
                        ${comment.userName}
                        <span class="comment-date">${new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <div class="comment-body">${comment.content}</div>
                `;
                commentsSection.appendChild(commentEl);
            });
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    }

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentTaskId) return;

        const content = document.getElementById('comment-content').value;
        try {
            await api.addCommentToTask(currentTaskId, content);
            document.getElementById('comment-content').value = '';
            loadComments(currentTaskId);
        } catch (error) {
            alert(`Error adding comment: ${error.message}`);
        }
    });
    
    logoutBtn.addEventListener('click', logout);

    function logout() {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
    }

    loadTasks();
});