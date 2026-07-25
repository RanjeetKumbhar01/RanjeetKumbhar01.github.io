/* ==========================================================================
   Ranjeet Kumbhar — Portfolio JavaScript Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. READING PROGRESS BAR =====
    const progressBar = document.getElementById('progressBar');
    
    function updateProgressBar() {
        if (!progressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    window.addEventListener('scroll', updateProgressBar);

    // ===== 2. MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            sidebar.classList.toggle('active');
        });

        // Close mobile sidebar when clicking a nav item
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            });
        });
    }

    // ===== 3. SCROLLSPY (ACTIVE NAV LINK ON SCROLL) =====
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.top-nav-item');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // ===== 4. RESEARCH CATEGORY FILTERING =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const researchItems = document.querySelectorAll('.research-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            researchItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ===== 5. COPY CITATION TO CLIPBOARD =====
    const copyBtns = document.querySelectorAll('.copy-citation-btn');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const citationText = btn.getAttribute('data-citation');
            if (citationText) {
                navigator.clipboard.writeText(citationText).then(() => {
                    showToast('📋 Citation copied to clipboard!');
                }).catch(() => {
                    showToast('❌ Failed to copy citation');
                });
            }
        });
    });

});
