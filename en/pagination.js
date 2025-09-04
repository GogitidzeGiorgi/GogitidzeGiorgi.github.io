document.addEventListener("DOMContentLoaded", () => {
    const current = window.location.pathname.split("/").pop(); 
    document.querySelectorAll(".pagination-btn").forEach(link => {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });