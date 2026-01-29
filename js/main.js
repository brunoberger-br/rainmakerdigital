/**
 * Rainmaker Digital - Main JavaScript
 * Handles ambient effects, scroll animations, navigation, and mobile menu
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initRainCanvas();
        initNavigation();
        initRevealAnimations();
        initSmoothScroll();
        initMobileMenu();
    }

    /**
     * Rain Canvas - Subtle ambient particle effect
     */
    function initRainCanvas() {
        const canvas = document.getElementById('rain-canvas');
        if (!canvas) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.style.display = 'none';
            return;
        }

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1,
                thickness: Math.random() * 1.5 + 0.5
            };
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 25000);
            for (let i = 0; i < Math.min(particleCount, 100); i++) {
                const p = createParticle();
                p.y = Math.random() * canvas.height;
                particles.push(p);
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.length * 0.3, p.y + p.length);
                ctx.strokeStyle = `rgba(2, 116, 190, ${p.opacity})`;
                ctx.lineWidth = p.thickness;
                ctx.lineCap = 'round';
                ctx.stroke();

                p.y += p.speed;
                p.x += p.speed * 0.3;

                if (p.y > canvas.height) {
                    particles[i] = createParticle();
                }
            });

            animationId = requestAnimationFrame(draw);
        }

        resize();
        initParticles();
        draw();

        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                resize();
                initParticles();
            }, 250);
        }, { passive: true });

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                draw();
            }
        });
    }

    /**
     * Navigation scroll behavior
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

        updateNav();
    }

    /**
     * Scroll-triggered reveal animations using Intersection Observer
     */
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            reveals.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
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
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    closeMobileMenu();

                    const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

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

        let mobileMenu = nav.querySelector('.nav__menu--mobile');

        if (!mobileMenu) {
            const desktopMenu = nav.querySelector('.nav__menu');
            const cta = nav.querySelector('.nav__cta');

            if (desktopMenu) {
                mobileMenu = document.createElement('nav');
                mobileMenu.className = 'nav__menu--mobile';
                mobileMenu.setAttribute('aria-label', 'Mobile navigation');
                mobileMenu.innerHTML = desktopMenu.innerHTML;

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

            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

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
