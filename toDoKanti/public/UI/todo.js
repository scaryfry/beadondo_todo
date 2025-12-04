async function LoadTasks() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "../Auth/authpage.html";
    alert("Please log in to access your tasks.");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = "../Auth/authpage.html";
      alert("Session expired. Please log in again.");
      return;
    }
    const tasks = await response.json();
    console.log("Tasks from server:", tasks);
    const taskList = document.getElementById("task-table-body");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const row = document.createElement("tr");
      const bgColor =
        task.priority === 3
          ? "red"
          : task.priority === 2
          ? "yellow"
          : task.priority === 1
          ? "green"
          : "";
      const prioritytext = 
        task.priority === 3
          ? "Magas"
          : task.priority === 2
          ? "Közepes"
          : "Alacsony";
      console.log(
        "Task priority:",
        task.priority,
        "Background color:",
        bgColor
      );
      if (bgColor) row.style.backgroundColor = bgColor;

      row.innerHTML = `
    <td style="background-color: ${bgColor}">${prioritytext ?? "-"}</td>
    <td>${task.title}</td>
    <td>${task.description}</td>
    <td>${task.status ? "Completed" : "Pending"}</td>
    <td>${
      task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"
    }</td>
    <td>${task.category}</td>
    <td>
      <button class="btn btn-warning btn-sm me-2" onclick='OpenEditModal(${JSON.stringify(
        task
      )})'>Módosítás</button>
      <button class="btn btn-danger btn-sm" onclick="deleteTask('${
        task.id
      }')">Törlés</button>
    </td>
`;
      taskList.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("Failed to load tasks. Please try again later.");
  }
}
window.onload = LoadTasks;

async function deleteTask(taskId) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "../Auth/authpage.html";
    alert("Please log in to access your tasks.");
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      window.location.href = "../Auth/authpage.html";
      alert("Session expired. Please log in again.");
      return;
    }
    if (response.ok) {
      LoadTasks();
    } else {
      alert("Failed to delete task. Please try again.");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task. Please try again later.");
  }
}
function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "../Auth/authpage.html";
}
async function AddTask() {
  const title = document.getElementById("titleInput").value;
  const description = document.getElementById("descriptionInput").value;
  const status = document.getElementById("statusInput").checked;
  const deadline = document.getElementById("deadlineInput").value;
  const category = document.getElementById("categoryInput").value;
  const priority = parseInt(document.getElementById("priorityInput").value);

  console.log("Adding task with priority:", priority);

  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("Please log in.");
    return (location.href = "../Auth/authpage.html");
  }
  if(!title || !description || !deadline || !category || isNaN(priority)) {
    alert("Please fill in all required fields.");
    return;
  }
  if(deadline < new Date().toISOString().split("T")[0]) {
    alert("Deadline cannot be in the past.");
    return;
  }
  await fetch("http://localhost:3000/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      status,
      deadline,
      category,
      priority,
    }),
  });
  titleInput.value = "";
  descriptionInput.value = "";
  statusInput.checked = false;
  deadlineInput.value = "";
  categoryInput.value = "";
  priorityInput.value = "1";
  bootstrap.Modal.getInstance(document.getElementById("addTaskModal")).hide();
  LoadTasks();
}
async function OpenEditModal(task) {
  document.getElementById("editTaskId").value = task.id;
  document.getElementById("editTitleInput").value = task.title;
  document.getElementById("editDescriptionInput").value = task.description;
  document.getElementById("editDeadlineInput").value =
    task.deadline?.split("T")[0] || "";
  document.getElementById("editStatusInput").checked = task.status;
  document.getElementById("editCategoryInput").value = task.category || "";
  document.getElementById("editPriorityInput").value = task.priority || 0;

  const modalEl = document.getElementById("editTaskModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

async function SaveTaskChanges() {
  const id = document.getElementById("editTaskId").value;
  const title = document.getElementById("editTitleInput").value;
  const description = document.getElementById("editDescriptionInput").value;
  const status = document.getElementById("editStatusInput").checked;
  const deadline = document.getElementById("editDeadlineInput").value;
  const category = document.getElementById("editCategoryInput").value;
  const priority = parseInt(document.getElementById("editPriorityInput").value);

  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Please log in.");
    window.location.href = "../Auth/authpage.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        deadline,
        category,
        priority,
      }),
    });

    if (!response.ok) {
      alert("Sikertelen módosítás.");
      return;
    }
    const modalEl = document.getElementById("editTaskModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    alert("Feladat módosítva.");
    LoadTasks();
  } catch (e) {
    console.error("Error updating task:", e);
    alert("Hiba történt.");
  }
}
function AbcCategorySort() {
  const taskTableBody = document.getElementById("task-table-body");
  const rows = Array.from(taskTableBody.querySelectorAll("tr"));

  const currentOrder = taskTableBody.dataset.categorySortOrder || "desc";
  const newOrder = currentOrder === "asc" ? "desc" : "asc";

  rows.sort((a, b) => {
    const aCat = (a.cells[4]?.innerText || "").trim().toLowerCase();
    const bCat = (b.cells[4]?.innerText || "").trim().toLowerCase();
    const cmp = aCat.localeCompare(bCat, undefined, { sensitivity: "base" });
    return newOrder === "asc" ? cmp : -cmp;
  });

  taskTableBody.innerHTML = "";
  rows.forEach((row) => taskTableBody.appendChild(row));

  taskTableBody.dataset.categorySortOrder = newOrder;
}
async function searchTasks() {
  const query = document.getElementById("searchInput").value;

  const response = await fetch(
    `http://localhost:3000/tasks/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  const tasks = await response.json();

  const tbody = document.getElementById("task-table-body");
  tbody.innerHTML = "";

  tasks.forEach((task) => {
    const bgColor =
      task.priority === 3
        ? "red"
        : task.priority === 2
        ? "yellow"
        : task.priority === 1
        ? "green"
        : "";
    const prioritytext = 
      task.priority === 3
        ? "Magas"
        : task.priority === 2
        ? "Közepes"
        : "Alacsony";
    tbody.innerHTML += `
      <tr style="background-color: ${bgColor}">
        <td style="background-color: ${bgColor}">${prioritytext ?? "-"}</td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.status ? "Completed" : "Pending"}</td>
        <td>${task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}</td>
        <td>${task.category}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" onclick='OpenEditModal(${JSON.stringify(
            task
          )})'>Módosítás</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask('${
            task.id
          }')">Törlés</button>
        </td>
      </tr>
    `;
  });
}
function sortByPriority() {
  const taskTableBody = document.getElementById("task-table-body");
  const rows = Array.from(taskTableBody.querySelectorAll("tr"));

  const currentOrder = taskTableBody.dataset.prioritySortOrder || "desc";
  const newOrder = currentOrder === "asc" ? "desc" : "asc";

  function parsePriorityFromText(text) {
    if (!text) return 0;
    const trimmed = text.trim();
    const num = parseInt(trimmed, 10);
    if (!isNaN(num)) return num;
    const low = trimmed.toLowerCase();
    if (low.includes("magas")) return 3; 
    if (low.includes("közepes") || low.includes("kozepes")) return 2; 
    if (low.includes("alacsony")) return 1; 
    return 0;
  }

  function getPriority(row) {
    const preferredIndices = [0, 5];
    for (const i of preferredIndices) {
      if (row.cells[i]) {
        const p = parsePriorityFromText(row.cells[i].innerText);
        if (p) return p;
      }
    }
    for (let i = 0; i < row.cells.length; i++) {
      const p = parsePriorityFromText(row.cells[i].innerText);
      if (p) return p;
    }
    return 0;
  }

  rows.sort((a, b) => {
    const aPriority = getPriority(a);
    const bPriority = getPriority(b);
    return newOrder === "asc" ? aPriority - bPriority : bPriority - aPriority;
  });

  taskTableBody.innerHTML = "";
  rows.forEach((row) => taskTableBody.appendChild(row));

  taskTableBody.dataset.prioritySortOrder = newOrder;
}