// =================================================================
// CORRECTED AND COMBINED SCRIPT FOR AUTH.JS
// =================================================================

// 1. Define the pages that require a user to be logged in.
const protectedRoutes = ['/dashboard.html', '/profile.html']; // Add any other protected pages here
const currentPage = window.location.pathname;

// 2. Main auth state listener that runs on every page.
// (This is the ONLY onAuthStateChanged listener you need)
auth.onAuthStateChanged(user => {
    
    // --- Part A: Update the header UI (this runs on all pages) ---
    const checkHeader = setInterval(() => {
        const userProfileSection = document.getElementById('user-profile-section');
        const loginSignupSection = document.getElementById('login-signup-section');
        const usernameDisplay = document.getElementById('username-display');

        if (userProfileSection && loginSignupSection && usernameDisplay) {
            if (user) {
                // User is signed in
                usernameDisplay.textContent = user.displayName || user.email.split('@')[0];
                userProfileSection.style.display = 'block';
                loginSignupSection.style.display = 'none';
            } else {
                // User is signed out
                userProfileSection.style.display = 'none';
                loginSignupSection.style.display = 'block';
            }
            clearInterval(checkHeader); // Stop checking once the header is found
        }
    }, 100);

    // --- Part B: Handle Page Protection ---
    // Check if the current page is protected AND if the user is logged out.
    if (protectedRoutes.includes(currentPage) && !user) {
        console.log("Access denied. User not logged in. Redirecting...");
        // If they aren't logged in, send them to the login page.
        window.location.href = '/GetStarted'; // Or your login page URL
    }
});

// 3. Add this event listener for the logout button
document.addEventListener('click', (event) => {
    // Check if the clicked element is the logout button
    if (event.target && event.target.id === 'logout-button') {
        event.preventDefault(); // Prevent the link from navigating
        auth.signOut().then(() => {
            console.log('User signed out successfully');
            // Redirect to the homepage after logout
            window.location.href = '/'; 
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    }
});