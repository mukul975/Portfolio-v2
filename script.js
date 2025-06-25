const design_card_butttons = document.querySelectorAll('.design-card');

design_card_butttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        design_card_butttons.forEach((btn, btnIndex) => {
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
            anime({
                targets: '#greetingText',
                opacity: [0, 1],
                translateY: [-10, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        }
    });



