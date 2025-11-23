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
    const taskList = document.getElementById("task-table-body");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.status ? "Completed" : "Pending"}</td>
                <td>${new Date(task.deadline).toLocaleDateString()}</td>
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
      alert("Task deleted successfully.");
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

  console.log(category);

  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("Please log in.");
    return (location.href = "../Auth/authpage.html");
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
    }),
  });
  alert("Task added.");
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
      body: JSON.stringify({ title, description, status, deadline, category }),
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
  const query = document.getElementById('searchInput').value;

  const response = await fetch(`http://localhost:3000/tasks/search/}`);
  const tasks = await response.json();

  const tbody = document.getElementById('task-table-body');
  tbody.innerHTML = '';

  tasks.forEach(task => {
    tbody.innerHTML += `
      <tr>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.status ? 'Kész' : 'Függőben'}</td>
        <td>${task.deadline || '-'}</td>
        <td>${task.category}</td>
        <td class="text-center">
          <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Szerkesztés</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Törlés</button>
        </td>
      </tr>
    `;
  });
}