// Portfolio script.js - Fixed version

document.addEventListener('DOMContentLoaded', function () {
    // ─── Card active state ───────────────────────────────────────────
    document.querySelectorAll('.design-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.design-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Deactivate card when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.design-card')) {
            document.querySelectorAll('.design-card').forEach(c => c.classList.remove('active'));
        }
    });

    // ─── Mobile menu toggle ──────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenuContainer = document.querySelector('.navbar-menu-container');
    const socialMediaContainer = document.querySelector('.social-media-container');

    if (menuToggle && navbarMenuContainer && socialMediaContainer) {
        menuToggle.addEventListener('click', function () {
            const isExpanded = navbarMenuContainer.classList.toggle('active');
            socialMediaContainer.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    }

    // ─── Scroll spy + scroll-to-top (single combined listener) ──────
    const navLinks = document.querySelectorAll('.navbar-menu li a');
    const sections = Array.from(navLinks).map(link => {
        const selector = link.getAttribute('href');
        const section = document.querySelector(selector);
        if (!section) console.warn(`Scroll spy: No element found for nav href="${selector}"`);
        return section;
    });

    const scrollToTopBtn = document.getElementById('scrollToTop');

    function setActiveLink() {
        let closestIndex = -1;
        let minDistance = Infinity;
        sections.forEach((section, i) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - 80);
            if (rect.top <= 100 && distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });
        navLinks.forEach((link, i) => {
            link.classList.toggle('active', i === closestIndex);
        });
    }

    window.addEventListener('scroll', function () {
        setActiveLink();
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        }
    }, { passive: true });

    setActiveLink(); // Initial call

    // ─── Scroll-to-top button ────────────────────────────────────────
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Nav link click: set active + close mobile menu ─────────────
    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Close mobile menu
            if (navbarMenuContainer) navbarMenuContainer.classList.remove('active');
            if (socialMediaContainer) socialMediaContainer.classList.remove('active');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ─── Calendly popup triggers ─────────────────────────────────────
    document.querySelectorAll('.calendly-trigger').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof Calendly !== 'undefined') {
                Calendly.initPopupWidget({
                    url: 'https://calendly.com/mukuljangra5?hide_gdpr_banner=1&background_color=25262a&text_color=ffffff&primary_color=64f4ac'
                });
            } else {
                window.open('https://calendly.com/mukuljangra5', '_blank', 'noopener');
            }
        });
    });

    // ─── Greeting animation ──────────────────────────────────────────
    const greetingText = document.getElementById('greetingText');
    const greetings = [
        { text: 'Stay safe from cyber', lang: 'en' },
        { text: 'साइबर से सुरक्षित रहें', lang: 'hi' },
        { text: 'সাইবার থেকে নিরাপদ থাকুন', lang: 'bn' },
        { text: 'サイバーから安全に過ごしてください', lang: 'ja' },
        { text: 'Restez en sécurité contre le cyber', lang: 'fr' },
        { text: 'Mantente seguro del ciber', lang: 'es' },
        { text: '保持网络安全', lang: 'zh' },
        { text: 'Bleib sicher vor Cybergefahren', lang: 'de' },
        { text: 'சைபர் ஆபத்திலிருந்து பாதுகாப்பாக இருங்கள்', lang: 'ta' },
        { text: 'Fanacht sábháilte ón gcibear', lang: 'ga' },
        { text: 'Stai al sicuro dal cyber', lang: 'it' },
        { text: 'שמור על עצמך בטוח מפני סייבר', lang: 'he' },
        { text: 'Оставайтесь в безопасности от киберугроз', lang: 'ru' },
        { text: 'ابق آمناً من الخطر السيبراني', lang: 'ar' },
        { text: 'Hãy an toàn khỏi mối đe dọa mạng', lang: 'vi' }
    ];

    let greetIndex = 0;
    let greetingTimer = null;

    function animateGreeting(greeting) {
        if (!greetingText) return;
        greetingText.innerHTML = '';
        greetingText.setAttribute('lang', greeting.lang);
        const words = greeting.text.split(' ');
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'greet-word';
            span.textContent = word;
            greetingText.appendChild(span);
            if (i < words.length - 1) {
                greetingText.appendChild(document.createTextNode(' '));
            }
        });

        if (window.anime) {
            window.anime({
                targets: '#greetingText span',
                opacity: [0, 1],
                translateX: function (el, i) {
                    return i % 2 === 0 ? ['-2.5em', '0em'] : ['2.5em', '0em'];
                },
                duration: 800,
                delay: (_, i) => i * 100,
                easing: 'easeOutExpo',
                complete: () => {
                    greetIndex = (greetIndex + 1) % greetings.length;
                    greetingTimer = setTimeout(() => animateGreeting(greetings[greetIndex]), 2500);
                }
            });
        } else {
            console.warn('anime.js not loaded – greeting animation skipped');
        }
    }

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (greetingTimer) {
                clearTimeout(greetingTimer);
                greetingTimer = null;
            }
        } else {
            if (!greetingTimer && greetingText) {
                greetIndex = (greetIndex + 1) % greetings.length;
                animateGreeting(greetings[greetIndex]);
            }
        }
    });

    animateGreeting(greetings[greetIndex]);
});
