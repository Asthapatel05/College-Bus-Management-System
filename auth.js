

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginSpinner = document.getElementById('loginSpinner');
const loginText = document.getElementById('loginText');
const errorMessage = document.getElementById('errorMessage');

// Firebase Collections
usersCollection = firebase.firestore().collection('users');
const busesCollection = firebase.firestore().collection('buses');

// Admin emails - add all admin email addresses here
const adminEmails = ['yogiraj@gmail.com', 'tejveer@gmail.com'];

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            checkUserRole(user);
        }
    });
});

// Login event listener
if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
}

// Handle login
async function handleLogin() {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    // Show loading spinner
    setLoading(true);
    
    try {
        // Sign in with Firebase Auth
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Check if this is an admin or student
        checkUserRole(user);
        
    } catch (error) {
        console.error('Login error:', error);
        showError('Invalid email or password. Please try again.');
        setLoading(false);
    }
}

// Check if user is admin or student and redirect accordingly
async function checkUserRole(user) {
    try {
        // Check if the user's email is in the admin list
        if (adminEmails.includes(user.email)) {
            // User is an admin
            redirectToAdminDashboard();
        } else {
            // User is a student
            // const userDoc = await usersCollection.where('email', '==', user.email).get();
            const userDoc = await usersCollection.doc(user.uid).get();
            
            // if (userDoc.empty) {
            //     // Create user document if it doesn't exist
            //     await usersCollection.add({
            //         email: user.email,
            //         uid: user.uid,
            //         name: user.displayName || email.split('@')[0],
            //         role: 'student',
            //         passId: ''
            //     });
            // }


            if (!userDoc.exists) {
                await usersCollection.doc(user.uid).set({
                    email: user.email,
                    uid: user.uid,
                    name: user.displayName || user.email.split('@')[0],
                    role: 'student',
                    passId: '',
                    isAdmin: false
                });
            }
            
            redirectToStudentDashboard();
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        showError('An error occurred during login. Please try again.');
        setLoading(false);
    }
}

// Redirect to admin dashboard
function redirectToAdminDashboard() {
    localStorage.setItem('userRole', 'admin');
    window.location.href = 'admin-dashboard.html';
}

// Redirect to student dashboard
function redirectToStudentDashboard() {
    localStorage.setItem('userRole', 'student');
    window.location.href = 'dashboard.html';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Set loading state
function setLoading(isLoading) {
    if (isLoading) {
        loginSpinner.style.display = 'inline-block';
        loginText.textContent = 'Logging in...';
        loginBtn.disabled = true;
    } else {
        loginSpinner.style.display = 'none';
        loginText.textContent = 'Login';
        loginBtn.disabled = false;
    }
}


