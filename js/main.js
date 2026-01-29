/**
 * Rainmaker Digital - Main JavaScript
 * Handles scroll-triggered animations, navigation behavior, and mobile menu
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initRevealAnimations();
        initSmoothScroll();
        initMobileMenu();
    }

    /**
     * Navigation scroll behavior
     * Adds shadow and updates styling when user scrolls
     */
    function initNavigation() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        let ticking = false;

        function updateNav() {
            if (window.scrollY > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateNav();
    }

    /**
     * Scroll-triggered reveal animations using Intersection Observer
     */
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');

        if (!reveals.length) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // If user prefers reduced motion, show all elements immediately
            reveals.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optionally unobserve after revealing
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    // Close mobile menu if open
                    closeMobileMenu();

                    // Calculate offset for fixed header
                    const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without scrolling
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        const toggle = document.querySelector('.nav__toggle');
        const nav = document.querySelector('.nav');

        if (!toggle || !nav) return;

        // Create mobile menu if it doesn't exist
        let mobileMenu = nav.querySelector('.nav__menu--mobile');

        if (!mobileMenu) {
            const desktopMenu = nav.querySelector('.nav__menu');
            const cta = nav.querySelector('.nav__cta');

            if (desktopMenu) {
                mobileMenu = document.createElement('nav');
                mobileMenu.className = 'nav__menu--mobile';
                mobileMenu.setAttribute('aria-label', 'Mobile navigation');

                // Clone the menu content
                mobileMenu.innerHTML = desktopMenu.innerHTML;

                // Add CTA if exists
                if (cta) {
                    const ctaClone = cta.cloneNode(true);
                    ctaClone.classList.add('nav__cta');
                    mobileMenu.querySelector('.nav__list').appendChild(
                        document.createElement('li')
                    ).appendChild(ctaClone);
                }

                nav.querySelector('.nav__container').appendChild(mobileMenu);
            }
        }

        toggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);

            if (mobileMenu) {
                mobileMenu.classList.toggle('is-open');
            }

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        const toggle = document.querySelector('.nav__toggle');
        const mobileMenu = document.querySelector('.nav__menu--mobile');

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }

        if (mobileMenu) {
            mobileMenu.classList.remove('is-open');
        }

        document.body.style.overflow = '';
    }

})();
