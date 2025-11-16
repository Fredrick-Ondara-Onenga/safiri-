// script.js - Only Menu Functionality Updated

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
    slideRight: document.querySelector('.slide-right'),
    mobileDrawer: document.querySelector('.mobile-drawer'),
    closeDrawer: document.querySelector('.close-drawer'),
    overlay: document.querySelector('.overlay')
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

// Mobile Menu Toggle - UPDATED to use elements object
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link.has-dropdown');

// Open mobile drawer - UPDATED
elements.hamburger.addEventListener('click', () => {
    elements.mobileDrawer.classList.add('active');
    elements.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close mobile drawer - UPDATED
function closeMobileDrawer() {
    elements.mobileDrawer.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Close all accordions
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        link.nextElementSibling.classList.remove('active');
    });
}

elements.closeDrawer.addEventListener('click', closeMobileDrawer);
elements.overlay.addEventListener('click', closeMobileDrawer);

// Mobile accordion functionality - UPDATED
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle active class on the link
        link.classList.toggle('active');
        
        // Toggle active class on the dropdown
        const dropdown = link.nextElementSibling;
        dropdown.classList.toggle('active');
        
        // Close other open dropdowns
        mobileNavLinks.forEach(otherLink => {
            if (otherLink !== link) {
                otherLink.classList.remove('active');
                otherLink.nextElementSibling.classList.remove('active');
            }
        });
    });
});

// Close mobile menu when a link is clicked - UPDATED
const allMobileLinks = document.querySelectorAll('.mobile-nav-menu a');
allMobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileDrawer();
    });
});

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
    resetAllDropdowns();
}

// Enhanced mobile dropdown functionality for nested menus
function handleMobileDropdown(e) {
    if (window.innerWidth > 768) return;
    
    const link = e.target.closest('.nav-link.has-dropdown');
    const mobileToggle = e.target.closest('.mobile-toggle');
    
    // Handle main dropdown toggles (Destinations, Safari Packages)
    if (link) {
        // Allow "Hotels" to open normally
        if (link.getAttribute('href') === 'hotel.html') return;
        
        e.preventDefault();
        const parentItem = link.parentElement;
        
        // Close other open dropdowns
        document.querySelectorAll('.nav-item.active').forEach(item => {
            if (item !== parentItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        parentItem.classList.toggle('active');
    }
    
    // Handle nested dropdown toggles (Africa, Kenya, etc.)
    if (mobileToggle) {
        e.preventDefault();
        const parent = mobileToggle.parentElement;
        
        // Toggle current nested dropdown
        parent.classList.toggle('active');
        
        // Close other nested dropdowns at the same level
        const siblings = Array.from(parent.parentElement.children);
        siblings.forEach(sibling => {
            if (sibling !== parent && sibling.classList.contains('active')) {
                sibling.classList.remove('active');
            }
        });
    }
}

// Update reset function to handle nested dropdowns
function resetAllDropdowns() {
    document.querySelectorAll('.nav-item.active, .dropdown-region-group.active, .dropdown-region.active').forEach(item => {
        item.classList.remove('active');
    });
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

// Star rating functionality
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

// Event listeners setup - UPDATED FOR NESTED DROPDOWNS
function setupEventListeners() {
    // Mobile menu
    if (elements.hamburger) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile dropdowns using event delegation
    document.addEventListener('click', (e) => {
        // Handle mobile dropdown clicks (both main and nested)
        if (e.target.closest('.nav-link.has-dropdown') || e.target.closest('.mobile-toggle')) {
            handleMobileDropdown(e);
        }
        
        // Close mobile menu when clicking outside
        if (!e.target.closest('.nav-container') && elements.navMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Close dropdowns when clicking outside on mobile
        if (window.innerWidth <= 768 && !e.target.closest('.nav-item') && !e.target.closest('.mobile-toggle')) {
            resetAllDropdowns();
        }
    });
    
    // Close mobile menu when clicking regular links
    document.querySelectorAll('.nav-menu a:not(.has-dropdown):not(.mobile-toggle)').forEach(link => {
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
    
    // Reset dropdowns on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            resetAllDropdowns();
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