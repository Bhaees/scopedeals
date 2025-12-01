// auth.js – Firebase email/password authentication

// 1. Import Firebase SDK (CDN)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// 2. Firebase Config (YOU WILL REPLACE THIS IN NEXT STEP)
const firebaseConfig = {
    apiKey: "AIzaSyCwCVf1MuczY-BDe8S_pf9TEp8IPBiLpuY",
    authDomain: "web-auth-d0b6b.firebaseapp.com",
    projectId: "web-auth-d0b6b",
    storageBucket: "web-auth-d0b6b.firebasestorage.app",
    messagingSenderId: "739979758800",
    appId: "1:739979758800:web:d4a22a2d4bf6f2aff962d5",
    measurementId: "G-Q8L2DFXL3L"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Tell other scripts we've loaded the Firebase auth module so mock auth does not attach duplicate handlers
window.USE_FIREBASE_AUTH = true;

// ========== SIGNUP ==========
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Firebase onAuthStateChanged will handle redirect; but ensure immediate navigation to home
            alert('Signup successful!');
            window.location.href = 'home.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

// ========== LOGIN ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Support existing page input IDs (`email` / `password`) to avoid mismatch
        const emailEl = document.getElementById('loginEmail') || document.getElementById('email');
        const passwordEl = document.getElementById('loginPassword') || document.getElementById('password');
        const email = emailEl ? emailEl.value : '';
        const password = passwordEl ? passwordEl.value : '';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigate to home after successful login
            alert('Login successful!');
            window.location.href = 'home.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

// ========== LOGOUT ==========
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert('Logged out!');
            window.location.href = 'index.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

// ========== AUTH STATE ==========
onAuthStateChanged(auth, (user) => {
    // Update navigation links when authentication state changes.
    // The site uses a few different navbar implementations: try to update a couple of places safely.
    const navAuthText = document.getElementById('navAuthText');
    if (navAuthText) {
        navAuthText.textContent = user ? user.email : 'Login';
    }

    // If nav-links exists, update/add a logout link similarly to main.js behavior.
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const existing = document.querySelector('.auth-link-item');
        if (existing) existing.remove();

        const authLi = document.createElement('li');
        authLi.className = 'auth-link-item';

        if (user) {
            // Show simple logout link
            authLi.innerHTML = `<a href="#" id="logoutBtn" style="color: var(--color-primary); font-weight: bold;">Logout</a>`;
            navLinks.appendChild(authLi);
            // Attach logout handler
            const logout = document.getElementById('logoutBtn');
            if (logout) {
                logout.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await signOut(auth);
                    // After sign out, go to auth page
                    window.location.href = 'index.html';
                });
            }
        } else {
            if (!window.location.pathname.includes('index.html') && !window.location.pathname.includes('signup.html')) {
                authLi.innerHTML = `<a href="index.html" style="font-weight: bold;">Login / Sign Up</a>`;
                navLinks.appendChild(authLi);
            }
        }
    }

    // -----------------
    // Page protection
    // -----------------
    const path = window.location.pathname || window.location.href;
    const endsWith = (name) => path.endsWith(name) || path.endsWith('/' + name) || path.endsWith('/');

    const isAuthPage = () => {
        return path.endsWith('index.html') || path.endsWith('/') || path.endsWith('signup.html');
    };

    const protectedPages = ['home.html', 'services.html', 'countries.html', 'about.html', 'contact.html'];
    const isProtectedPage = () => protectedPages.some(p => path.endsWith(p));

    // If not authenticated and on a protected page, redirect to auth page
    if (!user && isProtectedPage()) {
        // Use replace so back doesn't reveal protected content
        window.location.replace('index.html');
        return;
    }

    // If authenticated and currently on auth page, send to home
    if (user && isAuthPage()) {
        window.location.replace('home.html');
        return;
    }
});