async function loginConfirm() {
  const email = document.getElementById("email-login").value;
  const password = document.getElementById("password-login").value;
  if (email == "" || password == "") {
    alert("Minden mező kitöltése kötelező!");
    return;
  } else 
    try {
        const response = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        });
        if (!response.ok) {
            alert("Hibás email vagy jelszó!");
            return;
        }
        const token = await response.json();
        sessionStorage.setItem("token", token);
        alert("Sikeres bejelentkezés!");
        document.getElementById("email-login").value = "";
        document.getElementById("password-login").value = "";
        window.location.href = "../UI/dashboard.html";
    }
  catch (error) {
    console.error("Hiba a bejelentkezés során:", error);
    alert("Hiba történt a bejelentkezés során. Kérjük, próbálja újra.");
}

function showRegisterPage() {
  document.getElementById("password-register").type = "password";
  document.getElementById("password-repeat").type = "password";
  document.getElementById("password-login").type = "hidden";
  document.getElementById("login-button").style.display = "none";
  document.getElementById("register-page").style.display = "none";
  document.getElementById("register-button").style.display = "block";
  document.getElementById("login-page").style.display = "block";
}
function showLoginPage() {
  document.getElementById("password-register").type = "hidden";
  document.getElementById("password-repeat").type = "hidden";
  document.getElementById("password-login").type = "password";
  document.getElementById("register-button").style.display = "none";
  document.getElementById("login-page").style.display = "none";
  document.getElementById("login-button").style.display = "block";
  document.getElementById("register-page").style.display = "block";
}
document.getElementById("register-button").addEventListener("click", () => {
  const email = document.getElementById("email-login").value;
  const password = document.getElementById("password-register").value;
  const repeat = document.getElementById("password-repeat").value;
  if (password != repeat) {
    alert("Nem egyezik meg a két jelszó!");
    return;
  }
  data.push(email, password);
  console.log(data);
  if (
    sessionStorage.getItem("email") == "" ||
    sessionStorage.getItem("password") == ""
  ) {
    alert("Minden mező kitöltése kötelező!");
  }
  alert("Sikeres a regisztráció");
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("password", password);
  sessionStorage.setItem("repeat", repeat);
  document.getElementById("password-register").value = "";
  document.getElementById("password-repeat").value = "";
  showLoginPage();
});
}