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
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.status === 401) {
            window.location.href = "../Auth/authpage.html";
            alert("Session expired. Please log in again.");
            return;
        }
        const tasks = await response.json();
        const taskList = document.getElementById("task-table-body");
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.status ? "Completed" : "Pending"}</td>
                <td>${new Date(task.deadline).toLocaleDateString()}</td>
            `;
            taskList.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("Failed to load tasks. Please try again later.");
    }
}
window.onload = LoadTasks;