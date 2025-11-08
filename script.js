
// DOM element cache
const elements = {
    hero: document.querySelector('.hero'),
    heroTitle: document.getElementById('hero-title'),
    heroCaption: document.getElementById('hero-caption'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    searchBar: document.getElementById('searchBar'),
    destSlider: document.querySelector('.dest-slider'),
    slideLeft: document.querySelector('.slide-left'),
    slideRight: document.querySelector('.slide-right')
};

// Hero slider configuration
const heroConfig = {
    slides: [
        { image: 'hero1.jpg' },
        { image: 'hero2.jpg' },
        { image: 'hero3.jpg' },
        { image: 'hero4.jpg' },
        { image: 'hero5.jpg' }
    ],
    current: 0,
    next: 1,
    isTransitioning: false,
    transitionDuration: 1500,
    slideInterval: 6000
};

// Preload images for hero slider
function preloadImages() {
    heroConfig.slides.forEach(slide => {
        const img = new Image();
        img.src = slide.image;
    });
}

// Hero slider functionality
function updateSlide() {
    if (heroConfig.isTransitioning || !elements.hero) return;
    
    heroConfig.isTransitioning = true;
    
    const overlay = document.createElement("div");
    overlay.className = "hero-overlay";
    overlay.style.backgroundImage = `url('${heroConfig.slides[heroConfig.next].image}')`;
    
    elements.hero.appendChild(overlay);
    overlay.offsetHeight; // Force reflow
    overlay.style.opacity = "1";
    
    setTimeout(() => {
        elements.hero.style.backgroundImage = `url('${heroConfig.slides[heroConfig.next].image}')`;
        elements.hero.removeChild(overlay);
        
        heroConfig.current = heroConfig.next;
        heroConfig.next = (heroConfig.next + 1) % heroConfig.slides.length;
        heroConfig.isTransitioning = false;
    }, heroConfig.transitionDuration);
}

function initHeroSlider() {
    if (!elements.hero) return;
    
    elements.hero.style.backgroundImage = `url('${heroConfig.slides[heroConfig.current].image}')`;
    preloadImages();
    setInterval(updateSlide, heroConfig.slideInterval);
}

// Mobile menu functionality
function toggleMobileMenu() {
    if (!elements.navMenu || !elements.hamburger) return;
    
    elements.navMenu.classList.toggle('active');
    elements.hamburger.textContent = elements.navMenu.classList.contains('active') ? '✕' : '☰';
}

function closeMobileMenu() {
    if (!elements.navMenu || !elements.hamburger) return;
    
    elements.navMenu.classList.remove('active');
    elements.hamburger.textContent = '☰';
    
    // Close any open dropdowns
    document.querySelectorAll('.nav-item.active, .nav-link.has-dropdown.active').forEach(el => {
        el.classList.remove('active');
    });
}

function handleMobileDropdown(e) {
    if (window.innerWidth > 768) return;
    
    const link = e.target.closest('.nav-link.has-dropdown');
    if (!link) return;
    
    // Allow "Hotels" to open normally
    if (link.getAttribute('href') === 'hotel.html') return;
    
    e.preventDefault();
    const parentItem = link.parentElement;
    parentItem.classList.toggle('active');
    link.classList.toggle('active');
}

// Scroll handling
let lastScrollTop = 0;

function handleScroll() {
    if (!elements.searchBar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    elements.searchBar.style.transform = scrollTop > lastScrollTop && scrollTop > 100 ? 
        'translateY(-100%)' : 'translateY(0)';
    
    lastScrollTop = scrollTop;
}

// Destination slider functionality
function initDestinationSlider() {
    if (!elements.destSlider || !elements.slideLeft || !elements.slideRight) return;
    
    const scrollAmount = elements.destSlider.offsetWidth;
    
    elements.slideLeft.addEventListener('click', () => {
        elements.destSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    elements.slideRight.addEventListener('click', () => {
        elements.destSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    // Make slider draggable
    let isDown = false;
    let startX;
    let scrollLeftPos;
    
    elements.destSlider.addEventListener('mousedown', e => {
        isDown = true;
        startX = e.pageX - elements.destSlider.offsetLeft;
        scrollLeftPos = elements.destSlider.scrollLeft;
    });
    
    elements.destSlider.addEventListener('mouseleave', () => isDown = false);
    elements.destSlider.addEventListener('mouseup', () => isDown = false);
    
    elements.destSlider.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - elements.destSlider.offsetLeft;
        const walk = (x - startX) * 1.5;
        elements.destSlider.scrollLeft = scrollLeftPos - walk;
    });
}

// Star rating functionality - consolidated
function generateStarRating(ratingValue, isSpecial = false) {
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue % 1 >= 0.5;
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) starsHTML += '<i class="far fa-star"></i>';
    
    const textColor = isSpecial ? '#ccc' : '#555';
    starsHTML += `<span style="margin-left:6px; font-size:0.85rem; color:${textColor};">${ratingValue}</span>`;
    
    return starsHTML;
}

function initStarRatings() {
    // Regular ratings
    document.querySelectorAll('.rating').forEach(ratingDiv => {
        const ratingValue = parseFloat(ratingDiv.dataset.rating);
        ratingDiv.innerHTML = generateStarRating(ratingValue);
    });
    
    // Special ratings
    document.querySelectorAll('.special-rating').forEach(ratingDiv => {
        const ratingValue = parseFloat(ratingDiv.dataset.rating);
        ratingDiv.innerHTML = generateStarRating(ratingValue, true);
    });
}

// Event listeners setup
function setupEventListeners() {
    // Mobile menu
    if (elements.hamburger) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile dropdowns using event delegation
    document.addEventListener('click', (e) => {
        // Handle mobile dropdown clicks
        if (e.target.closest('.nav-link.has-dropdown')) {
            handleMobileDropdown(e);
        }
        
        // Close mobile menu when clicking outside
        if (!e.target.closest('.nav-container') && elements.navMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when clicking regular links
    document.querySelectorAll('.nav-menu a:not(.has-dropdown)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Scroll events with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    setupEventListeners();
    initDestinationSlider();
    initStarRatings();
});
