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
    updateProgressBar();

    // ===== 2. MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function setSidebarOpen(open) {
        if (!menuToggle || !sidebar) return;
        menuToggle.classList.toggle('active', open);
        sidebar.classList.toggle('active', open);
        if (overlay) overlay.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            setSidebarOpen(!sidebar.classList.contains('active'));
        });

        // Close mobile sidebar when clicking any sidebar link or the overlay
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setSidebarOpen(false));
        });
        if (overlay) {
            overlay.addEventListener('click', () => setSidebarOpen(false));
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setSidebarOpen(false);
        });
    }

    // ===== 3. SCROLLSPY (ACTIVE NAV LINK ON SCROLL) =====
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.top-nav-item');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 110;

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
    highlightActiveSection();

    // ===== 4. RESEARCH CATEGORY FILTERING =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const researchItems = document.querySelectorAll('.research-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

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
                    showToast('Link copied to clipboard');
                }).catch(() => {
                    showToast('Failed to copy link');
                });
            }
        });
    });

    // ===== 6. BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', updateBackToTop);
    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 7. THESIS RESULTS TOGGLE (STS/Gait; dedicated, NOT .filter-btn) =====
    const toggleBtns = document.querySelectorAll('.result-toggle-btn');
    const resultPanels = document.querySelectorAll('.result-panel');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-toggle');
            toggleBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            resultPanels.forEach(panel => {
                panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
            });
        });
    });

    // ===== 8. THESIS CHARTS (SVG, thesis.html only) =====
    // Values grounded in thesis Tables 6.2, 6.3, 6.5, 6.7, 6.8.
    const rmseChartSts = document.getElementById('rmseChartSts');
    const rmseChartGait = document.getElementById('rmseChartGait');
    if (rmseChartSts || rmseChartGait) {
        const NS = 'http://www.w3.org/2000/svg';
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const rmseData = {
            sts: { max: 0.2, unit: '°', fix: 3, tickFix: 2, rows: [['PID', 0.196], ['LQR', 0.152], ['SMC', 0.136], ['MFAC', 0.171], ['Proposed', 0.078]] },
            gait: { max: 1.5, unit: '°', fix: 3, tickFix: 1, rows: [['PID', 1.394], ['LQR', 0.895], ['SMC', 0.560], ['MFAC', 0.877], ['Proposed', 0.315]] }
        };

        function el(name, attrs) {
            const node = document.createElementNS(NS, name);
            for (const key in attrs) node.setAttribute(key, attrs[key]);
            return node;
        }

        function showTip(tip, e, text) {
            if (!tip) return;
            const wrap = tip.parentElement;
            tip.textContent = text;
            tip.hidden = false;
            if (e && wrap) {
                const r = wrap.getBoundingClientRect();
                tip.style.left = `${e.clientX - r.left + 14}px`;
                tip.style.top = `${e.clientY - r.top - 12}px`;
            } else {
                tip.style.left = '50%';
                tip.style.top = '0';
            }
        }

        function hideTip(tip) {
            if (tip) tip.hidden = true;
        }

        function animateBar(bar, val, targetW, delay) {
            if (reducedMotion) {
                bar.setAttribute('width', targetW.toFixed(1));
                if (val) val.setAttribute('opacity', '1');
                return;
            }
            const start = performance.now(), dur = 550;
            function frame(now) {
                const t = Math.min(1, Math.max(0, (now - start - delay) / dur));
                const eased = 1 - Math.pow(1 - t, 3);
                bar.setAttribute('width', (targetW * eased).toFixed(1));
                if (val) val.setAttribute('opacity', eased.toFixed(2));
                if (t < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }

        // Single-series horizontal bars with gridlines + value labels.
        function renderBars(svg, rows, opts) {
            const W = 640, labelW = 96, padR = 64, padT = 8, rowH = 38;
            const H = padT * 2 + rows.length * rowH;
            const plotW = W - labelW - padR;
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
            svg.replaceChildren();

            rows.forEach((_, i) => {
                const y = padT + i * rowH;
                svg.appendChild(el('rect', {
                    x: labelW, y: y + 7, width: plotW, height: rowH - 14, rx: 4,
                    class: 'chart-track'
                }));
            });

            [0, opts.max / 2, opts.max].forEach((t) => {
                const x = labelW + (t / opts.max) * plotW;
                svg.appendChild(el('line', { x1: x, y1: padT, x2: x, y2: H - padT, class: 'chart-grid' }));
                const tick = el('text', { x: x, y: H - 2, 'text-anchor': 'middle', class: 'chart-tick' });
                tick.textContent = t.toFixed(opts.tickFix) + opts.unit;
                svg.appendChild(tick);
            });

            rows.forEach(([label, value], i) => {
                const y = padT + i * rowH;
                const name = el('text', { x: labelW - 10, y: y + rowH / 2 + 4, 'text-anchor': 'end', class: 'chart-label' });
                name.textContent = label;
                svg.appendChild(name);

                const targetW = Math.max(2, (value / opts.max) * plotW);
                const bar = el('rect', {
                    x: labelW, y: y + 7, width: 0, height: rowH - 14, rx: 4,
                    class: 'chart-bar' + (label === opts.highlight ? ' best' : '')
                });
                bar.setAttribute('tabindex', '0');
                const title = document.createElementNS(NS, 'title');
                title.textContent = `${label}: ${value.toFixed(opts.fix)}${opts.unit}`;
                bar.appendChild(title);
                svg.appendChild(bar);

                const val = el('text', { x: labelW + targetW + 8, y: y + rowH / 2 + 4, class: 'chart-value', opacity: 0 });
                val.textContent = value.toFixed(opts.fix) + opts.unit;
                svg.appendChild(val);

                if (opts.tooltip) {
                    const tip = svg.parentElement ? svg.parentElement.querySelector('.chart-tooltip') : null;
                    const tipText = `${label}: ${value.toFixed(opts.fix)}${opts.unit}`;
                    bar.addEventListener('mouseenter', (e) => showTip(tip, e, tipText));
                    bar.addEventListener('mousemove', (e) => showTip(tip, e, tipText));
                    bar.addEventListener('mouseleave', () => hideTip(tip));
                    bar.addEventListener('focus', () => showTip(tip, null, tipText));
                    bar.addEventListener('blur', () => hideTip(tip));
                }

                animateBar(bar, val, targetW, i * 70);
            });
        }

        function renderRmse(svg, key) {
            const d = rmseData[key] || rmseData.sts;
            renderBars(svg, d.rows, {
                max: d.max, unit: d.unit, fix: d.fix, tickFix: d.tickFix,
                highlight: 'Proposed', tooltip: true
            });
        }

        if (rmseChartSts) renderRmse(rmseChartSts, 'sts');
        if (rmseChartGait) renderRmse(rmseChartGait, 'gait');

        // RL contribution chart (Table 6.3).
        const td3Chart = document.getElementById('td3Chart');
        if (td3Chart) {
            renderBars(td3Chart, [['Hip', 35], ['Knee', 33], ['Ankle', 79]], {
                max: 100, unit: '%', fix: 0, tickFix: 0, highlight: 'Ankle'
            });
        }

        // RL contribution for walking gait, both legs (Tables 6.7-6.8 RMSE).
        const td3ChartGait = document.getElementById('td3ChartGait');
        if (td3ChartGait) {
            renderBars(td3ChartGait, [
                ['Hip rot · R', 45.3], ['Hip rot · L', 52.3],
                ['Hip flex · R', 72.3], ['Hip flex · L', 74.3],
                ['Knee · R', 54.4], ['Knee · L', 68.6],
                ['Ankle · R', 70.1], ['Ankle · L', 67.8]
            ], {
                max: 100, unit: '%', fix: 1, tickFix: 0, highlight: ''
            });
        }

        // Total RMS torque effort during STS, summed across joints (Table 6.2).
        const torqueChart = document.getElementById('torqueChart');
        if (torqueChart) {
            renderBars(torqueChart, [
                ['PID', 140.1], ['LQR', 163.1], ['SMC', 47.5],
                ['MFAC', 182.6], ['Proposed', 26.6]
            ], {
                max: 200, unit: ' Nm', fix: 1, tickFix: 0,
                highlight: 'Proposed', tooltip: true
            });
        }

    }

});
