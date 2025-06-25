

        let greetIndex = 0;
        function animateGreeting(text) {
            const words = text.split(' ');
            greetingText.innerHTML = '';
            words.forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'greet-word';
                span.textContent = word;
                greetingText.appendChild(span);
                if (i < words.length - 1) {
                    greetingText.appendChild(document.createTextNode(' '));
                }
            });
            const wordSpans = greetingText.querySelectorAll('.greet-word');
            anime.timeline({
                complete: () => {
                    setTimeout(() => animateGreeting(greetings[greetIndex]), 1000);
            })
            .add({
                targets: wordSpans,
                opacity: [0, 1],
                translateY: [-10, 0],
                duration: 400,
                easing: 'easeOutQuad',
                delay: anime.stagger(300)
            })
            .add({
                targets: wordSpans,
                opacity: [1, 0],
                duration: 400,
                easing: 'easeInQuad',
                delay: anime.stagger(200),
                endDelay: 500
        }

        animateGreeting(greetings[greetIndex]);

    document.addEventListener('DOMContentLoaded', function () {
        const menuToggle = document.getElementById('menu-toggle');
        const navbarMenuContainer = document.querySelector('.navbar-menu-container');
        const socialMediaContainer = document.querySelector('.social-media-container');

        menuToggle.addEventListener('click', function () {
            navbarMenuContainer.classList.toggle('active');
            socialMediaContainer.classList.toggle('active');

        });

        if (window.anime) {
            anime({
                targets: '#greetingText',
                opacity: [0, 1],
                translateY: [-10, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        }
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

        anime({
            targets: greetingText,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 800,
            easing: 'easeOutQuad'
        });

        let greetIndex = 1;
        setInterval(() => {
            anime({
                targets: greetingText,
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInQuad',
                complete: function () {
                    greetingText.textContent = greetings[greetIndex];
                    anime({
                        targets: greetingText,
                        opacity: [0, 1],
                        duration: 500,
                        easing: 'easeOutQuad'
                    });
                    greetIndex = (greetIndex + 1) % greetings.length;
                }
            });
        }, 5000);
    }
});
