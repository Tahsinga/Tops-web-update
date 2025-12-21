function initMain() {
    // Slider Functionality
    let currentSlide = 0;
    const slideContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    function updateSlider() {
        if (slideContainer) {
            slideContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
    }

    function nextSlide() {
        if (slides.length > 0) {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }
    }

    function prevSlide() {
        if (slides.length > 0) {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    // Indicator click handlers
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });

    // Auto-advance slides
    let slideInterval;
    if (slideContainer) {
        slideInterval = setInterval(nextSlide, 5000);

        // Pause auto-advance on hover
        slideContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slideContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Initialize slider
        updateSlider();
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission: only intercept if form has no action (keep client-side simulation for local forms)
    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const action = form.getAttribute('action') || '';
            if (!action || action.trim() === '' || action.trim() === '#') {
                // no server action defined — simulate submission (legacy behavior)
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.textContent : 'Submit';
                if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

                setTimeout(() => {
                    alert('Thank you! Your quote request has been submitted. We will contact you within 24 hours.');
                    this.reset();
                    if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
                }, 1500);
            } else {
                // form has an action — allow normal submission to server
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navRight = document.querySelector('.nav-right');
    if (navToggle && navRight) {
        navToggle.addEventListener('click', () => {
            navRight.classList.toggle('open');
            navToggle.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        navRight.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navRight.classList.remove('open');
                navToggle.classList.remove('open');
            });
        });
    }

    // Expose controls for inline onclick attributes (prev/next buttons)
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Service button handlers: navigate to the route in the button's data-url
    document.querySelectorAll('.service-btn').forEach(btn => {
        function handleButtonClick() {
            const url = this.getAttribute('data-url');
            if (url) window.location.href = url;
        }

        btn.addEventListener('click', handleButtonClick);

        // Add touchstart for mobile devices
        if ('ontouchstart' in window) {
            btn.addEventListener('touchstart', handleButtonClick);
        }

        // keyboard accessibility: Enter or Space activates the button
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
} else {
    initMain();
}

// Restart entrance animations so they play on every page visit (including bfcache restores)
function restartEntranceAnimations() {
    const animated = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-service-box, .hero-service-icon');
    if (!animated || animated.length === 0) return;

    animated.forEach(el => {
        // clear inline animation to restart CSS animation
        el.style.animation = 'none';
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        void el.offsetWidth;
        // remove the override so the CSS animation plays again
        el.style.animation = '';
    });
}

// Run on first load or when DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    restartEntranceAnimations();
} else {
    document.addEventListener('DOMContentLoaded', restartEntranceAnimations);
}

// Handle pageshow to catch back/forward cache restores
window.addEventListener('pageshow', function (event) {
    // run on both persisted (bfcache) and normal show events
    restartEntranceAnimations();
});

// --- Performance helpers: lazy-load images and sync desktop images to mobile ---
function syncDesktopToMobileImages() {
    try {
        const desktopImgs = Array.from(document.querySelectorAll('.desktop-container img, .desktop-hero img, .desktop-top-bar img, .desktop-nav-bar img'));
        const mobileImgs = Array.from(document.querySelectorAll('.mobile-container img, .mobile-hero img, .mobile-top-bar img, .mobile-nav-bar img'));

        // Copy desktop srcs to mobile images by index (fallback to first desktop image)
        if (desktopImgs.length && mobileImgs.length) {
            mobileImgs.forEach((mImg, i) => {
                const dImg = desktopImgs[i] || desktopImgs[0];
                if (dImg && dImg.src) {
                    mImg.src = dImg.src;
                }
            });
        }

        // Add lazy loading to non-critical images. Keep hero first image eager.
        const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
        heroSlides.forEach((img, idx) => {
            img.loading = idx === 0 ? 'eager' : 'lazy';
        });

        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) img.loading = 'lazy';
        });
    } catch (err) {
        // fail silently
        // console.warn('Image sync error', err);
    }
}

// Run on DOM ready and on bfcache restore
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncDesktopToMobileImages);
} else {
    syncDesktopToMobileImages();
}
window.addEventListener('pageshow', syncDesktopToMobileImages);

