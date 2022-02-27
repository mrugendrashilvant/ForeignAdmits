const listContainer = document.querySelector('#incomplete-tasks');
const oldListContainer = document.querySelector("#completed-tasks");
const newListContainer = document.querySelector('#new-tasks');

const key = "task.lists";
const selectedKey = "task.selectedKey";
let lists = JSON.parse(localStorage.getItem(key)) || [];
let selectedTask = localStorage.getItem(selectedKey);
let todos = document.querySelector("#tasks");
let taskTemplate = document.getElementById('task-template');

const taskDisplayContainer = document.querySelector('#task-display');
let taskTitle = document.querySelector('#todo-title');

taskDisplayContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selected = lists.find(list => list.id === selectedTask);
        const selectedT = selected.sub_tasks.find(sub_task => sub_task.id === e.target.id);
        selectedT.complete = e.target.checked;
        saveRender()
    }
})
oldListContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'div') {
        selectedTask = e.target.dataset.listId;
        saveRender();
    }
})
newListContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'div') {
        selectedTask = e.target.dataset.listId;
        saveRender();
    }
})
listContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'div') {
        selectedTask = e.target.dataset.listId;
        saveRender();
    }
})
function save() {
    localStorage.setItem(key, JSON.stringify(lists));
    localStorage.setItem(selectedKey, selectedTask);
}
function saveRender() {
    save();
    render();
}
function render() {
    clearElement(listContainer);
    clearElement(oldListContainer);
    clearElement(newListContainer);
    renderTasks();
    const task = lists.find(list => list.id === selectedTask);
    if (selectedTask === null) {
        taskDisplayContainer.style.display = 'none';
    }
    else {
        taskDisplayContainer.style.display = "";
        taskTitle.innerText = task.name;
        clearElement(taskDisplayContainer);
        renderSubTasks(task);
    }
}
function addSubTask() {
    let smallTask = document.getElementById('addLabel').value.trim();
    console.log(smallTask)
    if (smallTask === "") {
        alert('Task cannot be empty');
        return;
    }
    let currTask = lists.find(list => list.id === selectedTask);
    let id = new Date().toLocaleTimeString();
    let name = smallTask;

    let newSubTask = {
        id: id,
        name: name,
        complete: false
    }
    currTask.sub_tasks.push(newSubTask);
    saveRender();
}
function renderSubTasks(task) {
    let sub = task.sub_tasks;
    console.log(sub)
    sub.forEach(t => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('#check');
        checkbox.id = t.id;
        checkbox.checked = t.complete;
        const label = taskElement.querySelector("#label");
        label.value = (t.name)
        taskDisplayContainer.appendChild(taskElement)
    })
}

function renderTasks() {
    if (lists.length === 0) {
        document.querySelector('.empty').style.display = 'block';
    }
    document.querySelector('.empty').style.display = 'none';
    lists.forEach(list => {
        let div = document.createElement('div');
        div.className = "shadow p-3 mb-5 bg-body rounded";
        let time = document.createElement('p');
        time.className = "fw-light muted";
        time.innerText = "Added at: " + list.id
        let title = document.createElement('p');
        title.className = 'title';
        title.innerText = `Title - ${list.name}`;
        let description = document.createElement('p');
        description.innerText = `Description - ${list.description}`;
        div.appendChild(time);
        div.appendChild(title);
        div.appendChild(description);
        div.dataset.listId = list.id;
        if (selectedTask === list.id) {
            div.classList.add('shadow-lg')
        }
        let cnt = remainingCount(list.sub_tasks)
        console.log(cnt)
        if (cnt === 0) {
            div.classList.add('border');
            div.classList.add('border-success');
            oldListContainer.appendChild(div);
        }
        else if (cnt === -1) {
            div.classList.add('border');
            div.classList.add('border-primary');
            newListContainer.appendChild(div);
        }
        else {
            div.classList.add('border');
            div.classList.add('border-danger');
            listContainer.appendChild(div);
        }
    })
}

function remainingCount(task) {
    let count = task.length;
    if (task.length === 0) {
        return -1;
    }

    task.forEach(sub => {
        if (sub.complete === true) count--;
    })
    return count;
}

function clearElement(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild)
    }
}

function createTask() {
    let task_name = document.getElementById('title').value.trim();
    let task_des = document.getElementById('description').value.trim();
    if (task_name === "" || task_des === "") {
        alert('Title or description cannot be empty');
        return;
    }
    let time = new Date().toLocaleTimeString();
    let list = {
        id: time,
        name: task_name,
        description: task_des,
        sub_tasks: []
    }
    lists.push(list);
    saveRender();
}
window.addEventListener('load', render)