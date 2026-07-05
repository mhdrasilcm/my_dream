// main.js — shared across every page: mobile navigation, navbar scroll
// state, back-to-top control, and scroll-triggered reveal animations.
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('back-to-top');

    // Solidify the navbar background once the page has scrolled a bit
    const onScroll = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile navigation toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scroll to top
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll-triggered reveal for stat rows, timeline entries and status cards.
    // Elements start with .reveal-hidden; removing it on intersection lets
    // each element's own transition take over, so hover states never fight
    // this animation for control of `transform`/`opacity`.
    const revealTargets = document.querySelectorAll('.reveal-slide, .timeline-item, .status-card');
    if ('IntersectionObserver' in window && revealTargets.length) {
        revealTargets.forEach((el, i) => {
            el.classList.add('reveal-hidden');
            el.style.transitionDelay = `${Math.min(i * 0.08, 0.4)}s`;
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('reveal-hidden');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        revealTargets.forEach((el) => observer.observe(el));
    }
});

// Animated count-up used by the live stats dashboard (see app.js).
// Counts from the element's previous value up to `endValue`.
window.countUpValue = function countUpValue(el, endValue, duration = 900) {
    const end = parseFloat(endValue);
    if (!el || Number.isNaN(end)) {
        if (el) el.innerText = endValue;
        return;
    }
    const start = parseFloat(el.dataset.rawValue) || 0;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.innerText = Math.round(start + (end - start) * eased);
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.innerText = end;
            el.dataset.rawValue = String(end);
        }
    }
    requestAnimationFrame(tick);
};
// --- CINEMATIC MOBILE NAVIGATION MENU DRAWERS ---
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (navToggle && navLinks) {
        // Toggle menu when clicking hamburger button
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('active');
            
            // Toggle accessibility parameters
            const isOpen = navToggle.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Automatically close the menu when clicking any link inside it
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close drawer if user clicks anywhere outside of the open menu area
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('open');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
// --- AUTOMATED BIOGRAPHY SLIDESHOW CORE ---
document.addEventListener('DOMContentLoaded', () => {
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach(container => {
        const slides = container.querySelectorAll('.slide');
        
        // Skip operation if the container only has one image asset
        if (slides.length <= 1) return;
        
        let currentIdx = 0;
        
        setInterval(() => {
            // Remove active status from current image
            slides[currentIdx].classList.remove('active');
            
            // Increment index pointer, wrapping around smoothly back to zero
            currentIdx = (currentIdx + 1) % slides.length;
            
            // Apply active status to reveal the next image
            slides[currentIdx].classList.add('active');
        }, 4000); // 4000ms = 4 seconds per image frame
    });
});