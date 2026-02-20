/* ═══════════════════════════════════════════
   HEDGE HONCHOS — Shared JavaScript
   ═══════════════════════════════════════════ */

(function() {
    // Sticky nav background on scroll
    var nav = document.getElementById('nav');
    if (nav && !nav.classList.contains('nav-solid')) {
        window.addEventListener('scroll', function() {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // Reveal "Get a Free Quote" in nav once hero scrolls out of view (home page only)
    var heroSection = document.getElementById('hero');
    if (heroSection) {
        var heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                document.body.classList.toggle('hero-passed', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        heroObserver.observe(heroSection);
    }

    // Mobile menu toggle
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close mobile menu on non-dropdown link click
        navLinks.querySelectorAll('a:not(.nav-has-dropdown)').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                // Also close any open dropdowns
                navLinks.querySelectorAll('.nav-item.open').forEach(function(item) {
                    item.classList.remove('open');
                });
            });
        });

        // Mobile dropdown accordion (desktop hover handled by CSS)
        navLinks.querySelectorAll('.nav-has-dropdown').forEach(function(trigger) {
            var didTouch = false;

            function toggleDropdown(e) {
                e.preventDefault();
                var parent = trigger.closest('.nav-item');
                // Close siblings
                navLinks.querySelectorAll('.nav-item.open').forEach(function(item) {
                    if (item !== parent) item.classList.remove('open');
                });
                parent.classList.toggle('open');
            }

            trigger.addEventListener('touchend', function(e) {
                if (window.innerWidth > 768) return;
                didTouch = true;
                toggleDropdown(e);
            });

            trigger.addEventListener('click', function(e) {
                if (window.innerWidth > 768) return;
                if (didTouch) { didTouch = false; return; } // suppress ghost click
                toggleDropdown(e);
            });
        });
    }

    // Scroll-triggered fade-up animations
    var fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(function(el) {
        fadeObserver.observe(el);
    });

    // Smooth scroll offset for fixed nav (anchor links only)
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navHeight = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // Mark active nav link based on current page
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a:not(.nav-cta):not(.btn)').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#')) {
            var linkPage = href.split('/').pop();
            if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        }
    });
})();
