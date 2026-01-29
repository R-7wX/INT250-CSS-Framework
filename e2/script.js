
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';


const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.getElementById('filterTabs');
const taskStats = document.getElementById('taskStats');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const emptyState = document.getElementById('emptyState');


const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const editTaskIdInput = document.getElementById('editTaskId');
const editTaskTitleInput = document.getElementById('editTaskTitle');
const saveEditBtn = document.getElementById('saveEditBtn');


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}


function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    if (text === '') {
        alert('Please enter a task name.');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority, 
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.unshift(newTask); 
    taskInput.value = '';
    saveTasks();
}


function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
    }
}


function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editTaskIdInput.value = task.id;
        editTaskTitleInput.value = task.text;
        editModal.show();
    }
}

function saveEdit() {
    const id = parseInt(editTaskIdInput.value);
    const newText = editTaskTitleInput.value.trim();
    
    if (newText) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            saveTasks();
            editModal.hide();
        }
    }
}


function getPriorityBadge(priority) {
    switch(priority) {
        case 'High': return '<span class="badge badge-custom bg-danger bg-opacity-10 text-danger border border-danger">HIGH</span>';
        case 'Medium': return '<span class="badge badge-custom bg-warning bg-opacity-10 text-warning border border-warning">MED</span>';
        case 'Low': return '<span class="badge badge-custom bg-success bg-opacity-10 text-success border border-success">LOW</span>';
        default: return '';
    }
}


function renderTasks() {
    taskList.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase(); 
    
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter = 
            currentFilter === 'all' ? true :
            currentFilter === 'active' ? !task.completed :
            currentFilter === 'completed' ? task.completed : true; 
        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        emptyState.classList.remove('d-none');
    } else {
        emptyState.classList.add('d-none');
    }

    filteredTasks.forEach(task => {
        const checked = task.completed ? 'checked' : '';
        const completedClass = task.completed ? 'completed' : '';
        const priorityClass = `priority-${task.priority.toLowerCase()}`;

        const html = `
            <div class="task-item ${priorityClass} ${completedClass} fade-in">
                <div class="d-flex align-items-center flex-grow-1 gap-3">
                    <div class="form-check">
                        <input class="form-check-input p-2" type="checkbox" 
                            ${checked} onclick="toggleTask(${task.id})" 
                            style="cursor: pointer; border-color: #64748b;">
                    </div>
                    <div class="d-flex flex-column">
                        <span class="task-title fw-medium fs-5 text-break">${task.text}</span>
                        <div class="d-flex align-items-center gap-2 mt-1">
                            ${getPriorityBadge(task.priority)}
                            <small class="text-muted" style="font-size: 0.75rem;">
                                <i class="bi bi-clock"></i> ${task.createdAt}
                            </small>
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2 ms-3">
                    <button class="btn btn-sm btn-outline-info border-0" onclick="openEditModal(${task.id})" title="Edit">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteTask(${task.id})" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        taskList.insertAdjacentHTML('beforeend', html);
    });

    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    taskStats.innerHTML = `<span class="text-white fw-bold">${total}</span> Total &bull; <span class="text-primary fw-bold">${active}</span> Active`;
    
    if (completed > 0) {
        clearCompletedBtn.classList.remove('d-none');
    } else {
        clearCompletedBtn.classList.add('d-none');
    }
}


addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', renderTasks);

filterTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        

        currentFilter = e.target.dataset.filter;
        renderTasks();
    }
});

clearCompletedBtn.addEventListener('click', () => {
    if(confirm("Delete all completed tasks?")) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
    }
});

saveEditBtn.addEventListener('click', saveEdit);


renderTasks();