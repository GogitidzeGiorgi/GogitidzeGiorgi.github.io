document.addEventListener("DOMContentLoaded", () => {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            // First, load the header's HTML into the page
            document.getElementById("header").innerHTML = data;

            // NOW, run the dropdown logic since the header exists in the DOM
            const langButton = document.querySelector('.lang-switcher-button');
            const langDropdown = document.querySelector('.lang-dropdown');
            const profileButton = document.querySelector('.profile-button');
            const profileDropdown = document.querySelector('.dropdown-menu');

            if (langButton && langDropdown) {
                langButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    langDropdown.classList.toggle('show');
                    if (profileDropdown && profileDropdown.classList.contains('show')) {
                        profileDropdown.classList.remove('show');
                    }
                });
            }

            if (profileButton && profileDropdown) {
                profileButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    profileDropdown.classList.toggle('show');
                    if (langDropdown && langDropdown.classList.contains('show')) {
                        langDropdown.classList.remove('show');
                    }
                });
            }

            // This part closes the dropdowns if you click anywhere else on the page
            document.addEventListener('click', function () {
                if (langDropdown && langDropdown.classList.contains('show')) {
                    langDropdown.classList.remove('show');
                }
                if (profileDropdown && profileDropdown.classList.contains('show')) {
                    profileDropdown.classList.remove('show');
                }
            });
        })
        .catch(error => console.error("Error loading header:", error));
});