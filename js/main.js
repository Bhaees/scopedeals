document.addEventListener('DOMContentLoaded', () => {
    console.log('ScopeDeals Loaded');

    // Mobile Menu Toggle (Basic)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.innerHTML = '☰'; // Hamburger icon
        mobileBtn.addEventListener('click', () => {
            if (!navLinks) return;
            navLinks.classList.toggle('active');
            mobileBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Form Submission (Mock)
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your booking request has been sent. We will contact you shortly.');
            form.reset();
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .feature-item, .country-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class style dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Modal Logic
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close-modal');
    const bookBtns = document.querySelectorAll('a[href="contact.html"]'); // Intercept book buttons

    // Function to open modal
    const openModal = (e) => {
        if (window.innerWidth > 768) { // Only on desktop/tablet for better UX, keep link for mobile or change logic
            e.preventDefault();
            if (!modal) return;
            modal.classList.add('show');
        }
    };

    // Attach to "Book Now" buttons in navbar and services
    bookBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Handle Modal Form
    const modalForm = document.getElementById('modalBookingForm');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Request received! We will call you shortly.');
            modal.classList.remove('show');
            modalForm.reset();
        });
    }

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.onscroll = function () {
        if (!scrollTopBtn) return;
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    };

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Authentication Logic ---
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const navLinksContainer = document.querySelector('.nav-links');

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('scopeDealsUser'));

    const updateNavbar = () => {
        // Remove existing auth links to prevent duplicates
        const existingAuth = document.querySelector('.auth-link-item');
        if (existingAuth) existingAuth.remove();

        const authLi = document.createElement('li');
        authLi.className = 'auth-link-item';

        if (currentUser) {
            authLi.innerHTML = `<a href="#" id="logoutBtn" style="color: var(--color-primary); font-weight: bold;">Hi, ${currentUser.name} (Logout)</a>`;
            navLinksContainer.appendChild(authLi);

            // Logout Handler
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('scopeDealsUser');
                window.location.href = 'index.html';
            });
        } else {
            // Check if we are already on the auth page or signup page to avoid link
            if (!window.location.pathname.includes('index.html') && !window.location.pathname.includes('signup.html')) {
                authLi.innerHTML = `<a href="index.html" style="font-weight: bold;">Login / Sign Up</a>`;
                navLinksContainer.appendChild(authLi);
            }
        }
    };

    // Run navbar update
    if (navLinksContainer) {
        updateNavbar();
    }

    // Login Handler (only used when Firebase auth is not in use)
    if (!window.USE_FIREBASE_AUTH) {
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                // Mock Login
                const user = { name: 'User', email: email }; // Default name for login
                localStorage.setItem('scopeDealsUser', JSON.stringify(user));
                window.location.href = 'index.html';
            });
        }
    }

    // Signup Handler (only used when Firebase auth is not in use)
    if (!window.USE_FIREBASE_AUTH) {
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('signupEmail').value;
                // Mock Signup
                const user = { name: name, email: email };
                localStorage.setItem('scopeDealsUser', JSON.stringify(user));
                window.location.href = 'index.html';
            });
        }
    }
});
