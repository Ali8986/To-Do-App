let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editId = null; // Define editId here

document.getElementById('todo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim() !== "") {
        if (editId !== null) {
            // Editing existing task
            tasks = tasks.map(task => task.id === editId ? { ...task, content: taskInput.value.trim() } : task);
            editId = null;
            document.getElementById('submit-button').innerHTML ='Submit';
        } else {
            // Adding new task
            addTask(taskInput.value.trim());
        }
        taskInput.value = '';
    } else {
        document.getElementById('show').style.display = 'block';
    }
    updateLocalStorage();
    renderTasks();
});

function addTask(task) {
    let newTask = {
        id: Date.now(),
        content: task,
        done: false
    };
    tasks.push(newTask);
    updateLocalStorage();
    renderTasks();
}

function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        let taskItem = document.createElement('div');
        taskItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'justify-content-between');
        
        // Set the opacity and disable the button if necessary
        let upButtonDisabled = index === 0 ? 'style="opacity: 0.5; pointer-events: none;"' : '';
        let downButtonDisabled = index === tasks.length - 1 ? 'style="opacity: 0.5; pointer-events: none;"' : '';

        taskItem.innerHTML = `
            <div class="d-flex align-items-center">
                <input type="checkbox" ${task.done ? 'checked' : ''} onclick="toggleDone(${task.id})">
                <span class="ml-2 ${task.done ? 'text-decoration-line-through' : ''}">${task.content}</span>
            </div>
            <div>
                <button class="btn btn-primary btn-sm" onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-primary btn-sm" ${upButtonDisabled} onclick="moveUp(${task.id})"><i class="fas fa-arrow-up"></i></button>
                <button class="btn btn-primary btn-sm" ${downButtonDisabled} onclick="moveDown(${task.id})"><i class="fas fa-arrow-down"></i></button>
                <button class="btn btn-primary btn-sm" onclick="duplicateTask(${task.id})"><i class="fas fa-clone"></i></button>
                <button class="btn btn-primary btn-sm" onclick="confirmDelete(${task.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function toggleDone(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.done = !task.done;
        }
        return task;
    });
    updateLocalStorage();
    renderTasks(); // Re-render to reflect the line-through change
}

function editTask(id) {
    let task = tasks.find(t => t.id === id);
    document.getElementById('taskInput').value = task.content;
    editId = id;
    document.getElementById('submit-button').textContent = 'Edit';
}

function moveUp(id) {
    let index = tasks.findIndex(task => task.id === id);
    if (index > 0) {
        [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
        updateLocalStorage();
        renderTasks();
    }
}

function moveDown(id) {
    let index = tasks.findIndex(task => task.id === id);
    if (index < tasks.length - 1) {
        [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
        updateLocalStorage();
        renderTasks();
    }
}

function duplicateTask(id) {
    let index = tasks.findIndex(task => task.id === id);
    let task = tasks[index];
    let newTask = { ...task, id: Date.now() };
    tasks.splice(index + 1, 0, newTask); // Insert the duplicated task right after the original
    updateLocalStorage();
    renderTasks();
}

let deleteTaskId;
function confirmDelete(id) {
    deleteTaskId = id;
    $('#confirmDeleteModal').modal('show');
}

document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    tasks = tasks.filter(task => task.id !== deleteTaskId);
    updateLocalStorage();
    renderTasks();
    $('#confirmDeleteModal').modal('hide');
});

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasks();
