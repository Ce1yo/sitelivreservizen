document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const currentPage = document.querySelector('.current');
    const totalPages = document.querySelector('.total');
    const navigation = document.querySelector('.navigation');
    let currentSlide = 0;
    let navigationTimeout;
    
    // Initialisation
    function init() {
        totalPages.textContent = slides.length;
        updateSlide();
        updateArrows();
    }
    
    function showNavigation() {
        // Annuler le timeout précédent si il existe
        if (navigationTimeout) {
            clearTimeout(navigationTimeout);
        }
        
        // Afficher la navigation
        navigation.classList.add('visible');
        
        // Masquer après 2 secondes
        navigationTimeout = setTimeout(() => {
            navigation.classList.remove('visible');
        }, 2000);
    }
    
    function updateSlide() {
        // Mettre à jour les slides avec transition
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                setTimeout(() => slide.classList.add('active'), 50);
            }
        });
        
        // Mettre à jour les points de navigation
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[currentSlide].classList.add('active');
        
        // Mettre à jour le compteur
        currentPage.textContent = currentSlide + 1;
        
        updateArrows();
        
        // Afficher la navigation
        showNavigation();
    }
    
    function updateArrows() {
        // Gérer l'état des flèches
        prevArrow.style.opacity = currentSlide === 0 ? '0.3' : '1';
        prevArrow.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
        
        nextArrow.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
        nextArrow.style.pointerEvents = currentSlide === slides.length - 1 ? 'none' : 'auto';
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < slides.length && index !== currentSlide) {
            currentSlide = index;
            updateSlide();
        }
    }
    
    // Événements pour les flèches
    prevArrow.addEventListener('click', () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    });
    
    nextArrow.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        }
    });
    
    // Événements pour les clics sur les slides
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            const rect = slide.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            if (x > rect.width / 2) {
                if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
            } else {
                if (currentSlide > 0) goToSlide(currentSlide - 1);
            }
        });
    });
    
    // Événements pour les points de navigation
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Support des touches clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        }
    });
    
    // Support du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    }
    
    // Afficher la navigation au survol
    navigation.addEventListener('mouseenter', () => {
        if (navigationTimeout) {
            clearTimeout(navigationTimeout);
        }
        navigation.classList.add('visible');
    });
    
    navigation.addEventListener('mouseleave', () => {
        navigationTimeout = setTimeout(() => {
            navigation.classList.remove('visible');
        }, 1000);
    });
    
    // Initialiser
    init();
});