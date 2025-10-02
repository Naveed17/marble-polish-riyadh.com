/**
 * Enhanced WordPress Theme JavaScript with AJAX Integration
 * Maintains exact same UI functionality while adding WordPress features
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== HERO SLIDER FUNCTIONALITY =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    
    // Auto-slide functionality
    function nextSlide() {
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + 1) % totalSlides;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    function goToSlide(slideIndex) {
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        currentSlide = slideIndex;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    // Slider controls
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        });
        
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance slider every 5 seconds
    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }
    
    // ===== LANGUAGE TOGGLE FUNCTIONALITY =====
    let currentLang = 'en';
    const langButtons = document.querySelectorAll('.lang-btn');
    const heroLangContents = document.querySelectorAll('.hero-lang-content');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetLang = this.getAttribute('data-lang');
            
            if (targetLang !== currentLang) {
                // Update active button
                langButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update hero section content
                heroLangContents.forEach(content => {
                    if (content.getAttribute('data-lang') === targetLang) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });
                
                // Update all language content throughout the website
                updateAllLanguageContent(targetLang);
                
                // Update current language
                currentLang = targetLang;
                
                // Update slide content language
                updateSlideLanguage(targetLang);
                
                // Update body direction and class for Arabic
                if (targetLang === 'ar') {
                    document.body.style.direction = 'rtl';
                    document.body.classList.add('lang-ar');
                    document.body.classList.remove('lang-en');
                } else {
                    document.body.style.direction = 'ltr';
                    document.body.classList.add('lang-en');
                    document.body.classList.remove('lang-ar');
                }
            }
        });
    });
    
    function updateAllLanguageContent(lang) {
        // Update all elements with lang-content class
        const allLangContents = document.querySelectorAll('.lang-content');
        allLangContents.forEach(content => {
            if (content.getAttribute('data-lang') === lang) {
                content.style.display = 'inline';
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    function updateSlideLanguage(lang) {
        const slideTexts = document.querySelectorAll('.slide-badge span, .slide-title span');
        slideTexts.forEach(text => {
            if (text.classList.contains(lang)) {
                text.style.display = 'inline';
            } else {
                text.style.display = 'none';
            }
        });
    }
    
    // Initialize language
    updateSlideLanguage('en');
    updateAllLanguageContent('en');
    
    // ===== WORDPRESS ENHANCED FUNCTIONALITY =====
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery filtering with WordPress integration
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item, .gallery-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.classList.add('show');
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.classList.remove('show');
                }
            });
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking nav links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('show');
                mobileToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('show');
                mobileToggle.classList.remove('active');
            }
        });
    }

    // WordPress AJAX Contact Form submission
    const forms = document.querySelectorAll('.contact-form, .modern-contact-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Prepare form data
            const formData = new FormData(this);
            formData.append('action', 'marble_contact_form');
            formData.append('nonce', marbleCareAjax.nonce);
            
            // Send AJAX request
            fetch(marbleCareAjax.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Success message
                    const successMessage = currentLang === 'ar' 
                        ? marbleCareAjax.translations.thankYouAr 
                        : marbleCareAjax.translations.thankYou;
                    
                    alert(successMessage);
                    this.reset();
                } else {
                    // Error message
                    alert(data.data || marbleCareAjax.translations.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(marbleCareAjax.translations.error);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Gallery item click for lightbox effect
    galleryItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const titleElement = this.querySelector('.card-content h4, .gallery-overlay h4');
            const title = titleElement ? titleElement.textContent : 'Professional Work';
            
            if (!img) return;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(10px);
            `;
            
            const description = currentLang === 'ar' 
                ? 'انقر في أي مكان للإغلاق'
                : 'Click anywhere to close';
            
            lightbox.innerHTML = `
                <div class="lightbox-content" style="max-width: 90%; max-height: 90%; text-align: center;">
                    <img src="${img.src}" alt="${img.alt}" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px;">
                    <h3 style="color: white; margin: 20px 0 10px; font-size: 1.5rem;">${title}</h3>
                    <p style="color: #ccc; margin: 0; font-size: 0.9rem;">${description}</p>
                </div>
            `;
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            });
            
            document.body.appendChild(lightbox);
        });
    });
    
    // Add hover effects to slider
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            sliderContainer.style.transform = 'scale(1.02)';
            sliderContainer.style.transition = 'transform 0.3s ease';
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            sliderContainer.style.transform = 'scale(1)';
        });
    }

    // WordPress search functionality enhancement
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        const input = form.querySelector('input[type="search"]');
        if (input) {
            input.addEventListener('input', debounce(function() {
                // Live search functionality can be added here
                console.log('Search query:', this.value);
            }, 300));
        }
    });

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Accessibility enhancements
    function enhanceAccessibility() {
        // Add proper focus management
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        // Ensure proper keyboard navigation
        focusableElements.forEach(element => {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && this.tagName !== 'INPUT' && this.tagName !== 'TEXTAREA') {
                    this.click();
                }
            });
        });

        // Add skip links for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link screen-reader-text';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        skipLink.addEventListener('focus', function() {
            this.style.cssText = `
                position: absolute;
                left: 6px;
                top: 7px;
                z-index: 999999;
                padding: 8px 16px;
                background: #000;
                color: #fff;
                text-decoration: none;
                width: auto;
                height: auto;
            `;
        });
        skipLink.addEventListener('blur', function() {
            this.style.cssText = `
                position: absolute;
                left: -9999px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Initialize accessibility enhancements
    enhanceAccessibility();

    // Performance monitoring
    if (window.performance) {
        window.addEventListener('load', function() {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        });
    }
});