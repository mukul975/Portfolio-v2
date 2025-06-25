const designCardButtons = document.querySelectorAll('.design-card');

designCardButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        designCardButtons.forEach((btn, btnIndex) => {
            if (index === btnIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenuContainer = document.querySelector('.navbar-menu-container');
    const socialMediaContainer = document.querySelector('.social-media-container');

    menuToggle.addEventListener('click', function () {
        navbarMenuContainer.classList.toggle('active');
        socialMediaContainer.classList.toggle('active');
    });

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
            text.split(' ').forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'greet-word';
                span.textContent = word;
                greetingText.appendChild(span);
                if (i < text.split(' ').length - 1) {
                    greetingText.appendChild(document.createTextNode(' '));
                }
            });

            anime({
                targets: '#greetingText span',
                opacity: [0, 1],
                translateY: [
                    { value: '-2.75rem', easing: 'easeOutExpo', duration: 600 },
                    { value: 0, easing: 'easeOutBounce', duration: 800, delay: 100 }
                ],
                rotate: {
                    value: '-1turn',
                    delay: 0
                },
                delay: (_, i) => i * 50,
                easing: 'easeInOutCirc',
                complete: () => {
                    greetIndex = (greetIndex + 1) % greetings.length;
                    setTimeout(() => animateGreeting(greetings[greetIndex]), 1000);
                }
            });
        }

        animateGreeting(greetings[greetIndex]);
    }
});
