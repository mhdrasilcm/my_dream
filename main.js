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

// ==========================================
// ====== ACHIEVEMENTS & COMPARISON DATA ====
// ==========================================

// 1. Load Achievements (Bulletproof Version)
function loadAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return; // Only runs on the achievements page

    // Hardcoded fallback data so it never shows a blank screen
    const achievementsData = [
        {
            "count": "8",
            "title": "Ballon d'Or",
            "description": "Record winner of the most prestigious individual award (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023)."
        },
        {
            "count": "6",
            "title": "European Golden Shoe",
            "description": "Record holder for top goalscorer in European leagues across all competitions."
        },
        {
            "count": "45+",
            "title": "Total Trophies",
            "description": "The single most decorated football player in the entire history of the sport."
        },
        {
            "count": "1",
            "title": "FIFA World Cup",
            "description": "Crowned Champion in 2022, securing his legacy as the absolute greatest of all time."
        }
    ];
        
    container.innerHTML = achievementsData.map(ach => `
        <div class="achievement-card">
            <h3 style="color: #00b4d8; font-size: 2.5rem; font-family: 'Oswald', sans-serif;">${ach.count}</h3>
            <h4 style="font-size: 1.2rem; margin-bottom: 10px;">${ach.title}</h4>
            <p style="color: #888; font-size: 0.9rem; line-height: 1.5;">${ach.description}</p>
        </div>
    `).join('');
}

// 2. Load Messi vs Ronaldo Comparison (Live 2026 Data)
// 2. Load Messi vs Ronaldo Comparison (Updated Order & Age)
// 2. Load Messi vs Ronaldo Comparison (Live Mode)
async function loadComparison() {
    const container = document.getElementById('comparison-container');
    if (!container) return;

    let comparisonData;

    try {
        // 1. Try to fetch the live data generated by GitHub Actions & Python!
        const response = await fetch('comparison.json');
        if (!response.ok) throw new Error("JSON not found, using fallback.");
        comparisonData = await response.json();
    } catch (error) {
        console.log("Live fetch failed, using fallback data.");
        // 2. Fallback data (just in case the Python script ever fails)
        comparisonData = {
            "last_updated": new Date().toLocaleString(), 
            "messi": {
                "name": "Lionel Messi",
                "age": "39",
                "world_cups": "1",
                "ballondor": "8",
                "goals": "918", 
                "assists": "453",
                "matches": "1160"
            },
            "ronaldo": {
                "name": "Cristiano Ronaldo",
                "age": "41",
                "world_cups": "0",
                "ballondor": "5",
                "goals": "976", 
                "assists": "307",
                "matches": "1325"
            }
        };
    }
        
    // Inject the data (whether live or fallback) into the glowing cards
    container.innerHTML = `
        <div class="player-card messi-card">
            <h3>${comparisonData.messi.name}</h3>
            <div class="stat-row"><span class="stat-label">World Cups</span> <span class="stat-value" style="color: #f3b229;">${comparisonData.messi.world_cups}</span></div>
            <div class="stat-row"><span class="stat-label">Ballon d'Or</span> <span class="stat-value" style="color: #f3b229;">${comparisonData.messi.ballondor}</span></div>
            <div class="stat-row"><span class="stat-label">Age</span> <span class="stat-value">${comparisonData.messi.age}</span></div>
            <div class="stat-row"><span class="stat-label">Career Goals</span> <span class="stat-value">${comparisonData.messi.goals}</span></div>
            <div class="stat-row"><span class="stat-label">Career Assists</span> <span class="stat-value">${comparisonData.messi.assists}</span></div>
            <div class="stat-row"><span class="stat-label">Matches Played</span> <span class="stat-value">${comparisonData.messi.matches}</span></div>
        </div>
        
        <div class="player-card">
            <h3>${comparisonData.ronaldo.name}</h3>
            <div class="stat-row"><span class="stat-label">World Cups</span> <span class="stat-value">${comparisonData.ronaldo.world_cups}</span></div>
            <div class="stat-row"><span class="stat-label">Ballon d'Or</span> <span class="stat-value" style="color: #f3b229;">${comparisonData.ronaldo.ballondor}</span></div>
            <div class="stat-row"><span class="stat-label">Age</span> <span class="stat-value">${comparisonData.ronaldo.age}</span></div>
            <div class="stat-row"><span class="stat-label">Career Goals</span> <span class="stat-value">${comparisonData.ronaldo.goals}</span></div>
            <div class="stat-row"><span class="stat-label">Career Assists</span> <span class="stat-value">${comparisonData.ronaldo.assists}</span></div>
            <div class="stat-row"><span class="stat-label">Matches Played</span> <span class="stat-value">${comparisonData.ronaldo.matches}</span></div>
        </div>
    `;
    
    // Auto-updating timestamp text
    const updateText = document.createElement('div');
    updateText.className = 'last-updated';
    updateText.innerText = 'Last Auto-Updated: ' + comparisonData.last_updated;
    container.parentElement.appendChild(updateText);
}

// Boot up both functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
    loadComparison();
});