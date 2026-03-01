const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const filterBtns = document.querySelectorAll(".filter-btn");
const addSound = document.getElementById("addSound");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null; // track which task is being edited




// Add or update task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    alert("Task cannot be empty!");
    return;
  }

  if (editIndex !== null) {
    // update task
    tasks[editIndex].text = text;
    editIndex = null;
    addBtn.textContent = "Add";
  } else {
    // add new task
    tasks.push({ text, completed: false });
  }

  taskInput.value = "";
  renderTasks(getActiveFilter());

  playAddSound();
}
// Render tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(index));

    const p = document.createElement("p");
    p.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit");
    editBtn.addEventListener("click", () => editTask(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete");
    deleteBtn.addEventListener("click", () => deleteTask(index));

    li.appendChild(checkbox);
    li.appendChild(p);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updatePendingCount();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toggle task completed
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks(getActiveFilter());
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(getActiveFilter());
}

// Edit task
function editTask(index) {
  taskInput.value = tasks[index].text;
  taskInput.focus();
  addBtn.textContent = "Update";
  editIndex = index;
}

// Update pending count
function updatePendingCount() {
  const count = tasks.filter(t => !t.completed).length;
  pendingCount.textContent = count;
}

// Get active filter
function getActiveFilter() {
  const active = document.querySelector(".filter-btn.active");
  return active ? active.dataset.filter : "all";
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

function playAddSound() {
      addSound.currentTime = 0; // har click pe dobara shuru se play hoga
      addSound.play();
    }
    

    // Button click par sound play hoga
    

// Add task on button click
addBtn.addEventListener("click", addTask);

// Add task on Enter key
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// Initial render
renderTasks();
