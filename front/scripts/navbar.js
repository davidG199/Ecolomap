let liDinamico = document.getElementById("li-dinamico");
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  liDinamico.classList.remove("show");

  liDinamico.innerHTML = `
        <a href="./login.html">Login</a>
    `;
} else {
  liDinamico.classList.add("show");

  liDinamico.innerHTML = `
        <p>${user.name}</p>
    `;
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userSession");
  alert("Sesión cerrada correctamente");
  //   window.location.href = "./frontito.html";
}

liDinamico.addEventListener("click", () => {
  if (user) {
    logout();
  } else {
    window.location.href = "./login.html";
  }
});
