// Cleaned and modularized JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Only one card active at a time across all sections
    document.querySelectorAll('.design-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.design-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenuContainer = document.querySelector('.navbar-menu-container');
    const socialMediaContainer = document.querySelector('.social-media-container');
    if (menuToggle && navbarMenuContainer && socialMediaContainer) {
        menuToggle.addEventListener('click', function () {
            navbarMenuContainer.classList.toggle('active');
            socialMediaContainer.classList.toggle('active');
        });
    }

    // Scroll spy for active nav link
    const navLinks = document.querySelectorAll('.navbar-menu li a');
    const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

    // Improved scroll spy for active nav link
    function improvedSetActiveLink() {
        let closestIndex = 0;
        let minDistance = Infinity;
        sections.forEach((section, i) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - 80); // 80px offset for header
            if (rect.top <= 100 && distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });
        navLinks.forEach((link, i) => {
            if (i === closestIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', improvedSetActiveLink);
    improvedSetActiveLink(); // Initial call
    // Also update on click for instant feedback

    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    }
    navLinks.forEach((link, i) => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Greeting animation
    if (window.anime) {
        const greetingText = document.getElementById('greetingText');
        const greetings = [
            'Stay safe from cyber',
            'साइबर से सुरक्षित रहें',
            'সাইবার থেকে নিরাপদ থাকুন',
            'サイバーから安全に過ごしてください',
            'Restez en sécurité contre le cyber',
            'Mantente seguro del ciber',
            '保持网络安全',
            'Bleib sicher vor Cybergefahren',
            'சைபர் ஆபத்திலிருந்து பாதுகாப்பாக இருங்கள்',
            'Fanacht sábháilte ón gcibear',
            'Manténgase seguro del ciber',
            'Bleiben Sie sicher vor Cyber',
            'Stai al sicuro dal cyber',
            'שמור על עצמך בטוח מפני סייבר',
            'Оставайтесь в безопасности от киберугроз',
            'ابق آمناً من الخطر السيبراني',
            'Hãy an toàn khỏi mối đe dọa mạng'
        ];
        let greetIndex = 0;
        function animateGreeting(text) {
            greetingText.innerHTML = '';
            const words = text.split(' ');
            words.forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'greet-word';
                span.textContent = word;
                greetingText.appendChild(span);
                if (i < words.length - 1) {
                    greetingText.appendChild(document.createTextNode(' '));
                }
            });
            anime({
                targets: '#greetingText span',
                opacity: [0, 1],
                translateX: function(el, i) {
                    return i % 2 === 0 ? ['-2.5em', '0em'] : ['2.5em', '0em'];
                },
                duration: 800,
                delay: (_, i) => i * 100,
                easing: 'easeOutExpo',
                complete: () => {
                    greetIndex = (greetIndex + 1) % greetings.length;
                    setTimeout(() => animateGreeting(greetings[greetIndex]), 2000);
                }
            });
        }
        animateGreeting(greetings[greetIndex]);
    }
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
