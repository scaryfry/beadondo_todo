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
        const token = await response.json();
        sessionStorage.setItem("token", token);
        alert("Sikeres bejelentkezés!");
        document.getElementById("email-login").value = "";
        document.getElementById("password-login").value = "";
        window.location.href = "../UI/MainPage.html";
    }
  catch (error) {
    console.error("Hiba a bejelentkezés során:", error);
    alert("Hiba történt a bejelentkezés során. Kérjük, próbálja újra.");
}
}

function showRegisterPage() {
  document.getElementById("password-register").type = "password";
  document.getElementById("password-repeat").type = "password";
  document.getElementById("password-login").type = "hidden";
  document.getElementById("name").type = "text";
  document.getElementById("name-label").style.display = "block";
  document.getElementById("login-button").style.display = "none";
  document.getElementById("register-page").style.display = "none";
  document.getElementById("register-button").style.display = "block";
  document.getElementById("login-page").style.display = "block";
}
function showLoginPage() {
  document.getElementById("password-register").type = "hidden";
  document.getElementById("password-repeat").type = "hidden";
  document.getElementById("password-login").type = "password";
  document.getElementById("name").type = "hidden";
  document.getElementById("name-label").style.display = "none";
  document.getElementById("register-button").style.display = "none";
  document.getElementById("login-page").style.display = "none";
  document.getElementById("login-button").style.display = "block";
  document.getElementById("register-page").style.display = "block";
}
document.getElementById("register-button").addEventListener("click", async () => {
  const email = document.getElementById("email-login").value;
  const name = document.getElementById("name").value;
  const password = document.getElementById("password-register").value;
  const repeat = document.getElementById("password-repeat").value;
  if (password != repeat) {
    alert("Nem egyezik meg a két jelszó!");
    return;
  }
  else if (email == "" || name == "" || password == "" || repeat == "") {
    alert("Minden mező kitöltése kötelező!");
    return;
  }
  else{
    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ email: email, name: name, password: password }),
      });
      alert("Sikeres regisztráció!");
      document.getElementById("email-login").value = "";
      document.getElementById("name").value = "";
      document.getElementById("password-register").value = "";
      document.getElementById("password-repeat").value = "";
    }
    catch (error) {
      console.error("Hiba a regisztráció során:", error);
      alert("Hiba történt a regisztráció során. Kérjük, próbálja újra.");
      return;
    }
  }
  showLoginPage();
});
