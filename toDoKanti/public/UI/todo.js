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
                <td>
                    <button onclick="NavigateToEditTask('${
                      task.id
                    }')">Edit</button>
                    <button onclick="deleteTask('${task.id}')">Delete</button>
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
async function NavigateToAddTask() {
  window.location.href = "./AddPage.html";
}
async function NavigateToEditTask(taskId) {
  window.location.href = `./EditPage.html?taskId=${taskId}`;
}
function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "../Auth/authpage.html";
}
