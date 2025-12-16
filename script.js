// ==================== AUDIO PLAYER FUNCTIONALITY ====================
function toggleAudio(audioId) {
    const audio = document.getElementById(audioId);
    const button = audio.previousElementSibling.previousElementSibling.querySelector('.play-btn');
    const playIcon = button.querySelector('.play-icon');
    const progressBar = document.getElementById('progress' + audioId.slice(-1));
    
    if (audio.paused) {
        // Pause all other audio players
        document.querySelectorAll('audio').forEach(a => {
            if (a.id !== audioId) {
                a.pause();
                const btn = document.querySelector(`#${a.id}`).previousElementSibling.previousElementSibling.querySelector('.play-btn .play-icon');
                btn.textContent = '▶';
            }
        });
        
        audio.play();
        playIcon.textContent = '⏸';
        
        // Update progress bar
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
        });
        
        // Reset when ended
        audio.addEventListener('ended', () => {
            playIcon.textContent = '▶';
            progressBar.style.width = '0%';
        });
    } else {
        audio.pause();
        playIcon.textContent = '▶';
    }
}

// Show audio samples section
function showAudioSamples() {
    const audioSection = document.getElementById('sample-calls');
    audioSection.scrollIntoView({ behavior: 'smooth' });
}

// ==================== FAQ ACCORDION ====================
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ==================== LIVE COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Initialize counters when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.dataset.count);
            animateCounter(entry.target, target);
            entry.target.dataset.animated = 'true';
        }
    });
}, observerOptions);

// Observe all counter elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Also animate the live counter in trust bar
    const liveCounter = document.querySelector('.live-counter');
    if (liveCounter) {
        // Simulate real-time updates
        let count = 247;
        setInterval(() => {
            count += Math.floor(Math.random() * 3);
            liveCounter.textContent = count;
        }, 5000);
    }
});

// ==================== EXIT INTENT POPUP ====================
let exitPopupShown = false;

function showExitPopup() {
    if (!exitPopupShown) {
        const popup = document.getElementById('exit-popup');
        popup.classList.add('active');
        exitPopupShown = true;
        
        // Store in session storage so it doesn't show again this session
        sessionStorage.setItem('exitPopupShown', 'true');
    }
}

function closePopup() {
    const popup = document.getElementById('exit-popup');
    popup.classList.remove('active');
}

// Detect exit intent
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitPopupShown && !sessionStorage.getItem('exitPopupShown')) {
        showExitPopup();
    }
});

// Close popup on overlay click
document.getElementById('exit-popup').addEventListener('click', (e) => {
    if (e.target.id === 'exit-popup') {
        closePopup();
    }
});

// ==================== STICKY CTA ====================
function handleStickyCTA() {
    const stickyCTA = document.getElementById('sticky-cta');
    const pricingSection = document.getElementById('pricing');
    
    if (!stickyCTA || !pricingSection) return;
    
    const pricingTop = pricingSection.offsetTop;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    // Show sticky CTA after scrolling past pricing section
    if (scrollPosition > pricingTop + 500) {
        stickyCTA.classList.add('visible');
    } else {
        stickyCTA.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleStickyCTA);

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for # links
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== MOBILE MENU ====================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
        navActions.classList.toggle('mobile-active');
        
        // Animate hamburger icon
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ==================== SCROLL ANIMATIONS ====================
const fadeElements = document.querySelectorAll('.fade-in-up, .slide-in-right');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateX(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    element.style.opacity = '0';
    fadeObserver.observe(element);
});

// ==================== NAVBAR SCROLL EFFECT ====================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// ==================== DEMO VIDEO MODAL ====================
// This would open a video modal if you have a demo video
document.querySelectorAll('a[href="#demo-video"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // You can implement a video modal here
        alert('Demo video feature - you would integrate your actual demo video here');
    });
});

// ==================== FORM VALIDATION (if you add a signup form) ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ==================== ANALYTICS TRACKING ====================
// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-large').forEach(button => {
    button.addEventListener('click', (e) => {
        // Track with your analytics (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'engagement',
                'event_label': button.textContent.trim()
            });
        }
    });
});

// Track phone number clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_click', {
                'event_category': 'engagement',
                'event_label': link.href
            });
        }
    });
});

// ==================== SCROLL PROGRESS INDICATOR ====================
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // You can use this to show a progress bar if desired
    // document.getElementById('scrollProgress').style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ==================== PRICING PLAN HIGHLIGHT ====================
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('pricing-popular')) {
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// ==================== COPY TO CLIPBOARD (for phone numbers) ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const message = document.createElement('div');
        message.textContent = 'Copied!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: fadeOut 2s forwards;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    });
}

// Add copy functionality to phone numbers (optional feature)
document.querySelectorAll('.demo-phone, .cta-phone-large').forEach(phone => {
    phone.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const number = phone.textContent.replace(/[^0-9]/g, '');
        copyToClipboard(number);
    });
});

// ==================== LAZY LOADING IMAGES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger animation for hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .demo-cta, .trust-bar, .hero-ctas');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = `fadeInUp 0.6s ease-out forwards`;
        }, index * 100);
    });
});

// ==================== CONSOLE EASTER EGG ====================
console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold;');
console.log('%cLooking to build something cool? CallBird is hiring!', 'font-size: 14px;');
console.log('%cCheck out https://callbirdai.com/careers', 'font-size: 14px; color: #2563eb;');

// ==================== PERFORMANCE MONITORING ====================
// Log performance metrics (helpful for optimization)
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
        
        // Track with analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                'value': pageLoadTime,
                'event_category': 'performance'
            });
        }
    }
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Press 'C' to scroll to CTA
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        const cta = document.getElementById('trial');
        if (cta) cta.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'P' to scroll to pricing
    if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        const pricing = document.getElementById('pricing');
        if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'Esc' to close popup
    if (e.key === 'Escape') {
        closePopup();
    }
});

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('CallBird website loaded successfully! 🐦');
    
    // Check if user has seen exit popup before
    if (sessionStorage.getItem('exitPopupShown')) {
        exitPopupShown = true;
    }
    
    // Initialize mobile menu styles
    if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
        navActions.style.display = 'none';
    }
    
    // Add animation classes to elements
    document.querySelectorAll('section > .container').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `fadeInUp 0.6s ease-out forwards`;
        element.style.animationDelay = `${index * 0.1}s`;
    });
});

// ==================== RESPONSIVE MENU HANDLING ====================
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navActions.style.display = 'flex';
        navLinks.classList.remove('mobile-active');
        navActions.classList.remove('mobile-active');
        mobileMenuToggle.classList.remove('active');
    } else {
        if (!navLinks.classList.contains('mobile-active')) {
            navLinks.style.display = 'none';
            navActions.style.display = 'none';
        }
    }
});

// ==================== ADD MOBILE MENU STYLES ====================
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-links.mobile-active,
        .nav-actions.mobile-active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            gap: 1rem;
        }
        
        .nav-links.mobile-active {
            border-bottom: 1px solid var(--border-color);
        }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
