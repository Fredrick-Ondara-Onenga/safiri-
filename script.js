// === Existing Hero Background Code ===
const hero = document.querySelector('.hero');
const heroTitle = document.getElementById('hero-title');
const heroCaption = document.getElementById('hero-caption');

const slides = [
  { image: 'hero1.jpg' },
  { image: 'hero2.jpg' },
  { image: 'hero3.jpg' },
  { image: 'hero4.jpg' },
  { image: 'hero5.jpg' }
];

let current = 0;

function updateSlide() {
  hero.style.backgroundImage = `url('${slides[current].image}')`;
  current = (current + 1) % slides.length;
}

// Initial load
updateSlide();

// Change every 6 seconds
setInterval(updateSlide, 6000);




 // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon
            if (navMenu.classList.contains('active')) {
                hamburger.innerHTML = '✕';
            } else {
                hamburger.innerHTML = '☰';
            }
        });

        // Mobile dropdown functionality
        const navItems = document.querySelectorAll('.nav-item');
        const dropdownLinks = document.querySelectorAll('.nav-link.has-dropdown');

       dropdownLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      // Allow "Hotels" to open normally
      if (link.getAttribute('href') === 'hotel.html') return;

      e.preventDefault();
      const parentItem = link.parentElement;
      parentItem.classList.toggle('active');
      link.classList.toggle('active');
    }
  });
});

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '☰';
                
                // Also close any open dropdowns
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
                dropdownLinks.forEach(link => {
                    link.classList.remove('active');
                });
            }
        });

        // Close dropdowns when clicking on a link (for mobile)
        const allLinks = document.querySelectorAll('.nav-menu a');
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && !link.classList.contains('has-dropdown')) {
                    navMenu.classList.remove('active');
                    hamburger.innerHTML = '☰';
                    
                    // Also close any open dropdowns
                    navItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    dropdownLinks.forEach(dropLink => {
                        dropLink.classList.remove('active');
                    });
                }
            });
        });

        // Search bar hide/show on scroll
        const searchBar = document.getElementById('searchBar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down and past 100px - hide search bar
                searchBar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show search bar
                searchBar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        





// === UPDATED: Destination Slider Logic ===
const destSlider = document.querySelector('.dest-slider');
const slideLeft = document.querySelector('.slide-left');
const slideRight = document.querySelector('.slide-right');

if (destSlider && slideLeft && slideRight) {
  slideLeft.addEventListener('click', () => {
    destSlider.scrollBy({
      left: -destSlider.offsetWidth, // scroll by one full view width
      behavior: 'smooth'
    });
  });

  slideRight.addEventListener('click', () => {
    destSlider.scrollBy({
      left: destSlider.offsetWidth, // scroll by one full view width
      behavior: 'smooth'
    });
  });



  // Generate navigation dots dynamically
  const totalCards = cardsWrapper.querySelectorAll('.destination-card').length;
  const perView = getCardsPerView();
  const totalDots = Math.ceil(totalCards / perView);

  navDots.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    navDots.appendChild(dot);
  }

  // Update active dot on scroll
  const dots = navDots.querySelectorAll('.dot');
  cardsWrapper.addEventListener('scroll', () => {
    const card = cardsWrapper.querySelector('.destination-card');
    if (!card) return;
    const index = Math.round(cardsWrapper.scrollLeft / (card.offsetWidth + 20) / getCardsPerView());
    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  });

  // Optional: Add arrow navigation if you have arrow buttons
  const leftArrow = document.querySelector('.slide-left');
  const rightArrow = document.querySelector('.slide-right');

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', () => scrollCards(-1));
    rightArrow.addEventListener('click', () => scrollCards(1));
  }


  // Make slider draggable
   let isDown = false;
  let startX;
  let scrollLeftPos;

  destSlider.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - destSlider.offsetLeft;
    scrollLeftPos = destSlider.scrollLeft;
  });

  destSlider.addEventListener('mouseleave', () => (isDown = false));
  destSlider.addEventListener('mouseup', () => (isDown = false));

  destSlider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - destSlider.offsetLeft;
    const walk = (x - startX) * 1.5;
    destSlider.scrollLeft = scrollLeftPos - walk;
  });
}

// === Dynamic Star Ratings ===
document.querySelectorAll('.rating').forEach(ratingDiv => {
  const ratingValue = parseFloat(ratingDiv.dataset.rating);
  const fullStars = Math.floor(ratingValue);
  const halfStar = ratingValue % 1 >= 0.5;

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
  if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) starsHTML += '<i class="far fa-star"></i>';

  starsHTML += `<span style="margin-left:6px; font-size:0.85rem; color:#555;">${ratingValue}</span>`;
  ratingDiv.innerHTML = starsHTML;
});


document.querySelectorAll('.special-rating').forEach(ratingDiv => {
  const ratingValue = parseFloat(ratingDiv.dataset.rating);
  const fullStars = Math.floor(ratingValue);
  const halfStar = ratingValue % 1 >= 0.5;

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
  if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) starsHTML += '<i class="far fa-star"></i>';

  starsHTML += `<span style="margin-left:6px; font-size:0.85rem; color:#ccc;">${ratingValue}</span>`;
  ratingDiv.innerHTML = starsHTML;
});


