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

// ========== SIGNUP ==========
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Signup successful!');
            window.location.href = 'index.html';
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

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            window.location.href = 'index.html';
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
            window.location.href = 'login.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

// ========== AUTH STATE ==========
onAuthStateChanged(auth, (user) => {
    const navAuthText = document.getElementById('navAuthText');
    if (!navAuthText) return;

    if (user) {
        navAuthText.textContent = user.email;
    } else {
        navAuthText.textContent = 'Login';
    }
});