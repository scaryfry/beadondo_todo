async function loadUser() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "../Auth/authpage.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/users/me", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      alert("Session expired!");
      window.location.href = "login.html";
      return;
    }

    const user = await response.json();

    document.getElementById("userdata").innerText =
      `Logged in as: (${user.email})`;

  } catch (err) {
    console.error(err);
  }
}

loadUser();
