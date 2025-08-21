const popup = document.getElementById('action-popup');
const editBtn = document.getElementById('edit-task-btn');
const completeBtn = document.getElementById('complete-task-btn');
const cancelBtn = document.getElementById('cancel-btn');

let selectedIndex = null; 

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <span onclick="selectTask(${index})">${task.text}</span>
      <button onclick="editTask(${index})">✏️</button>
      <button onclick="deleteTask(${index})">🗑️</button>
    `;

    taskList.appendChild(li);
  });
}

function selectTask(index) {
  selectedIndex = index;

 
  const taskItems = document.querySelectorAll('#task-list .task');
  taskItems.forEach((task, i) => {
    task.classList.remove('selected');
    if (i === index) {
      task.classList.add('selected');
    }
  });

 
  popup.classList.remove('hidden');
}


function addTask() {
  const text = taskInput.value.trim();
  if (text !== '') {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  highlightSelectedTask(index);
}

function highlightSelectedTask(index) {
  const taskItems = document.querySelectorAll('#task-list .task');
  taskItems.forEach((task, i) => {
    task.classList.remove('selected');
    if (i === index) {
      task.classList.add('selected');
    }
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

editBtn.addEventListener('click', () => {
  const newText = prompt('Edit task:', tasks[selectedIndex].text);
  if (newText && newText.trim()) {
    tasks[selectedIndex].text = newText.trim();
    saveTasks();
    renderTasks();
  }
  closePopup();
});

completeBtn.addEventListener('click', () => {
  tasks[selectedIndex].completed = true;
  saveTasks();
  renderTasks();
  closePopup();
});

cancelBtn.addEventListener('click', () => {
  closePopup();
});

function closePopup() {
  popup.classList.add('hidden');
  selectedIndex = null;

  const taskItems = document.querySelectorAll('#task-list .task');
  taskItems.forEach(task => task.classList.remove('selected'));
}

renderTasks();
