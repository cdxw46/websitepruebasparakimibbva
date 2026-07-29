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

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Detección de sistema operativo ---------- */
    function detectOS() {
        if (/Mac/.test(navigator.platform) || /Mac OS/.test(navigator.userAgent)) return 'macos';
        return 'windows';
    }

    function applyOSDetection() {
        var os = detectOS();

        var primary = document.getElementById('dl-primary');
        primary.href = FILES[os].href;
        document.getElementById('dl-primary-text').textContent = FILES[os].label;
        document.getElementById('dl-primary-icon').innerHTML = ICONS[os];

        var mobileCta = document.getElementById('mobile-menu-cta');
        var mobileCtaText = document.getElementById('mobile-menu-cta-text');
        if (mobileCta && mobileCtaText) {
            mobileCta.href = FILES[os].href;
            mobileCtaText.textContent = FILES[os].label;
        }

        var card = document.querySelector('.ticket[data-os="' + os + '"]');
        if (card) {
            var badge = card.querySelector('.ticket__badge');
            if (badge) badge.hidden = false;
        }
    }

    /* ---------- Cabecera con sombra al hacer scroll ---------- */
    function initHeader() {
        var header = document.getElementById('header');
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Menú móvil ---------- */
    function initMobileMenu() {
        var burger = document.getElementById('burger');
        var menu = document.getElementById('mobile-menu');
        if (!burger || !menu) return;

        function setOpen(open) {
            burger.classList.toggle('open', open);
            menu.classList.toggle('open', open);
            document.body.classList.toggle('menu-open', open);
            burger.setAttribute('aria-expanded', open);
            burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
            menu.setAttribute('aria-hidden', !open);
        }

        burger.addEventListener('click', function () {
            setOpen(!menu.classList.contains('open'));
        });

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setOpen(false); });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
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

    /* ---------- Contadores ---------- */
    function initCounters() {
        var counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                var el = entry.target;
                var target = parseInt(el.dataset.target, 10);
                var duration = 1300;
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
        initMobileMenu();
        initReveal();
        initCounters();
        initFaq();
        initToTop();
        initYear();
    });
})();
