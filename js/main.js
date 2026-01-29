/**
 * Rainmaker Digital Homepage - DISTINCTIVE EDITION
 * Enhanced animations, scroll reveals, and interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    const statNumbers = document.querySelectorAll('.stat-item__number[data-count]');

    // Sticky Header with enhanced scroll detection
    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('mobile-open');
        document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        nav.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }

    // Enhanced Scroll Reveal with Intersection Observer
    function setupScrollReveal() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -80px 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(element => observer.observe(element));
        } else {
            // Fallback: reveal all immediately
            revealElements.forEach(element => element.classList.add('revealed'));
        }
    }

    // Animated Number Counter for Stats
    function animateStatNumbers() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const finalValue = element.dataset.count;
                        const originalText = element.textContent;
                        const suffix = originalText.replace(/[0-9]/g, '');

                        // Animate the number
                        animateValue(element, 0, parseInt(finalValue), 2000, suffix);
                        observer.unobserve(element);
                    }
                });
            }, observerOptions);

            statNumbers.forEach(stat => observer.observe(stat));
        }
    }

    // Eased number animation
    function animateValue(element, start, end, duration, suffix) {
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (end - start) * easedProgress);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Smooth scroll for anchor links
    function handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href && href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                closeMobileMenu();

                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Parallax effect for hero mesh (subtle movement)
    function setupParallax() {
        const meshBlob = document.querySelector('.hero__mesh-blob');
        if (!meshBlob) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const speed = 0.3;
                    meshBlob.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Add hover glow effect to trust logos
    function setupTrustLogoEffects() {
        const trustLogos = document.querySelectorAll('.trust-logo');
        trustLogos.forEach(logo => {
            logo.addEventListener('mouseenter', () => {
                logo.style.filter = 'grayscale(0%) drop-shadow(0 0 10px rgba(2, 116, 190, 0.3))';
            });
            logo.addEventListener('mouseleave', () => {
                logo.style.filter = 'grayscale(100%)';
            });
        });
    }

    // Hero card bars animation reset on visibility
    function setupHeroBarAnimation() {
        const bars = document.querySelectorAll('.hero-card__bar');
        if (bars.length === 0) return;

        // Re-trigger animation by toggling class
        setTimeout(() => {
            bars.forEach((bar, index) => {
                bar.style.animationDelay = `${index * 0.1}s`;
            });
        }, 1000);
    }

    // Hero V2 - Parallax orbs on mouse move
    function setupHeroV2Effects() {
        const heroV2 = document.querySelector('.hero-v2');
        if (!heroV2) return;

        const orbs = heroV2.querySelectorAll('.hero-v2__orb');

        // Subtle parallax on mouse move for orbs only
        heroV2.addEventListener('mousemove', (e) => {
            const rect = heroV2.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 20;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // Initialize
    function init() {
        // Enable JS-dependent styles (progressive enhancement)
        document.documentElement.classList.add('js-ready');

        // Scroll events (throttled)
        window.addEventListener('scroll', throttle(handleScroll, 10));

        // Mobile menu
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }

        // Nav links (both header and footer)
        const navLinks = document.querySelectorAll('.nav__link, .footer__column a, a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav && nav.classList.contains('mobile-open')) {
                if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Initial scroll check
        handleScroll();

        // Setup all reveal animations
        setupScrollReveal();

        // Setup stat number animations
        animateStatNumbers();

        // Setup parallax effect
        setupParallax();

        // Setup trust logo effects
        setupTrustLogoEffects();

        // Setup hero bar animations
        setupHeroBarAnimation();

        // Setup Hero V2 effects
        setupHeroV2Effects();

        // Add loaded class for any final transitions
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
