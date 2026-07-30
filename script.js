/**
 * Garage Door Repair Terrell - Custom JavaScript Logic
 * Contains loaders, menus, accordions, validators, and observers.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Trigger triggerReveal for elements inside viewport immediately once loaded
    window.addEventListener('load', () => {
        triggerReveal();
    });

    // ==========================================================================
    // 2. SCROLL PROGRESS BAR & STICKY HEADER
    // ==========================================================================
    const scrollProgress = document.getElementById('scroll-progress');
    const mainHeader = document.getElementById('main-header');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Update Scroll Progress Bar
        if (scrollProgress && docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Handle Sticky Header Styles
        if (mainHeader) {
            if (scrollTop > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        // Show/Hide Back to Top Button
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to set initial state
    handleScroll();

    // Back to Top Button action
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 3. NAVIGATION (MOBILE HAMBURGER & DROPDOWN)
    // ==========================================================================
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navMenuWrapper = document.getElementById('nav-menu-wrapper');
    const servicesDropdownLink = document.getElementById('servicesDropdownLink');
    const dropdownMenu = navMenuWrapper ? navMenuWrapper.querySelector('.dropdown-menu') : null;
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');

    // Toggle Mobile Navigation Menu
    if (hamburgerToggle && navMenuWrapper) {
        hamburgerToggle.addEventListener('click', () => {
            const isExpanded = hamburgerToggle.getAttribute('aria-expanded') === 'true';
            hamburgerToggle.setAttribute('aria-expanded', !isExpanded);
            hamburgerToggle.classList.toggle('active');
            navMenuWrapper.classList.toggle('active');
            
            // Toggle body scrolling while menu is open
            document.body.style.overflow = !isExpanded ? 'hidden' : 'auto';
        });
    }

    // Close mobile nav when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                hamburgerToggle.classList.remove('active');
                navMenuWrapper.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Mobile Services Dropdown toggle behavior
    if (servicesDropdownLink && dropdownMenu) {
        servicesDropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent jump to #services section anchor
                const isExpanded = servicesDropdownLink.getAttribute('aria-expanded') === 'true';
                servicesDropdownLink.setAttribute('aria-expanded', !isExpanded);
                dropdownMenu.classList.toggle('active');
            }
        });
    }

    // Close menus if screen resizes above mobile width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                hamburgerToggle.classList.remove('active');
                navMenuWrapper.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (dropdownMenu && dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
                servicesDropdownLink.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ==========================================================================
    // 4. ACTIVE PAGE LINK HIGHLIGHT (URL PATHNAME & SCROLL TRACKING)
    // ==========================================================================
    const sections = document.querySelectorAll('section[id], header[id]');
    const navMenuLinks = document.querySelectorAll('.nav-menu .nav-link');
    const currentPath = window.location.pathname;

    const highlightActivePage = () => {
        // Clear all active states first
        navMenuLinks.forEach(link => link.classList.remove('active'));

        // Check path name first
        if (currentPath.includes('about.html')) {
            const aboutLink = Array.from(navMenuLinks).find(link => link.getAttribute('href').includes('about.html'));
            if (aboutLink) aboutLink.classList.add('active');
        } else if (currentPath.includes('contact.html')) {
            const contactLink = Array.from(navMenuLinks).find(link => link.getAttribute('href').includes('contact.html'));
            if (contactLink) contactLink.classList.add('active');
        } else if (currentPath.includes('garage-door-installation.html') || currentPath.includes('garage-door-repair.html')) {
            const servicesLink = document.getElementById('servicesDropdownLink');
            if (servicesLink) servicesLink.classList.add('active');
        } else {
            // Home page: scroll-based active state highlighting for sections
            const scrollPosition = window.scrollY + 120; // offset header height

            // Default to Home if at the very top
            if (window.scrollY < 100) {
                const homeLink = Array.from(navMenuLinks).find(link => link.getAttribute('href').includes('index.html') || link.getAttribute('href') === 'index.html');
                if (homeLink) homeLink.classList.add('active');
                return;
            }

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navMenuLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${sectionId}` || href === `index.html#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    };

    window.addEventListener('scroll', highlightActivePage, { passive: true });
    highlightActivePage(); // Run once on load

    // ==========================================================================
    // 5. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // Fallback trigger for elements already in view
    function triggerReveal() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // 6. FAQS ACCORDION LOGIC
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                        otherItem.querySelector('.faq-content').style.maxHeight = null;
                        
                        // Switch plus/minus icon representation
                        const icon = otherItem.querySelector('.faq-icon-wrapper i');
                        if (icon) {
                            icon.className = 'fa-solid fa-plus';
                        }
                    }
                });

                // Toggle current FAQ
                if (isActive) {
                    item.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = null;
                    const icon = trigger.querySelector('.faq-icon-wrapper i');
                    if (icon) icon.className = 'fa-solid fa-plus';
                } else {
                    item.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = `${content.scrollHeight}px`;
                    const icon = trigger.querySelector('.faq-icon-wrapper i');
                    if (icon) icon.className = 'fa-solid fa-minus';
                }
            });
        }
    });



    // ==========================================================================
    // 8. ACCESSIBILITY & LAZY LOADING
    // ==========================================================================
    // Set lazy loading programmatically on images that don't have it explicitly
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    // Close menus/accordions with Escape key for keyboard accessibility
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile navigation
            if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                hamburgerToggle.classList.remove('active');
                navMenuWrapper.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});
