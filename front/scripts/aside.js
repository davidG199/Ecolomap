const panel = document.getElementById("panel")
const togglePanelBtn = document.getElementById("btn-toggle-panel")
const toggleIcon = document.getElementById("toggle-icon")

togglePanelBtn.addEventListener("click", () => {
    const isVisible = panel.classList.contains("is-visible");

    if (isVisible) {
    panel.classList.remove("is-visible");
    panel.classList.add("is-hidden");
    toggleIcon.style.transform = "rotate(0deg)";
  } else {
    panel.classList.remove("is-hidden");
    panel.classList.add("is-visible");
    toggleIcon.style.transform = "rotate(180deg)";
  }


})