
document.addEventListener('DOMContentLoaded', () => {

    // ===== MOBILE HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = () => {
        const elementsToReveal = document.querySelectorAll(
            '.section-title-card, .about-card-main, .about-card-principle, .about-card-drives, ' +
            '.info-card, .exp-card, .project-card-v, .research-card, ' +
            '.tech-category, .contact-card, .contact-intro'
        );

        elementsToReveal.forEach((el) => {
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-card')) {
                if (el.classList.contains('section-title-card') ||
                    el.classList.contains('contact-intro')) {
                    el.classList.add('reveal');
                } else {
                    el.classList.add('reveal-card');
                    const parent = el.parentElement;
                    const siblings = parent.querySelectorAll('.reveal-card');
                    const siblingIndex = Array.from(siblings).indexOf(el);
                    el.style.transitionDelay = `${siblingIndex * 0.1}s`;
                }
            }
        });
    };

    revealElements();

    // IntersectionObserver for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.reveal, .reveal-card').forEach(el => {
        observer.observe(el);
    });

    // ===== SKILL PILL RANDOM COLOR ON HOVER =====
    const colors = ['#FFD43B', '#FF6B9D', '#20C997', '#A9E34B', '#FF8787', '#B197FC', '#74C0FC'];

    document.querySelectorAll('.skill-pill').forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            pill.style.background = randomColor;
        });
        pill.addEventListener('mouseleave', () => {
            pill.style.background = 'white';
        });
    });

    // ===== TILT EFFECT ON PROJECT CARDS =====
    document.querySelectorAll('.project-card-v').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-2px, -2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== PHOTO FRAME HOVER PARALLAX =====
    const photoFrame = document.querySelector('.photo-frame');
    if (photoFrame) {
        const heroPhoto = document.querySelector('.hero-photo');
        heroPhoto.addEventListener('mousemove', (e) => {
            const rect = heroPhoto.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            photoFrame.style.transform = `rotate(${-2 + y * 3}deg) scale(1.02) translate(${x * 8}px, ${y * 8}px)`;
        });

        heroPhoto.addEventListener('mouseleave', () => {
            photoFrame.style.transform = '';
        });
    }

});
