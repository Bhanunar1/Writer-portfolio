// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.book-card, .style-item, .theme-card, .about-short, .about-long');
    
    if (animateElements && animateElements.length > 0) {
        animateElements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                try {
                    observer.observe(el);
                } catch (e) {
                    console.warn('Observer error:', e);
                }
            }
        });
    }
});

// Scrolling books animation - duplicate content for seamless loop
const bookScroll = document.querySelector('.book-scroll');
if (bookScroll && bookScroll.innerHTML) {
    try {
        const scrollContent = bookScroll.innerHTML;
        if (scrollContent) {
            bookScroll.innerHTML = scrollContent + scrollContent;
        }
    } catch (e) {
        console.warn('Error duplicating book scroll:', e);
    }
}

// Active navigation link highlighting
const sections = document.querySelectorAll('.section');
const navLinksArray = Array.from(navLinks);

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--accent-gold);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to book cards
document.querySelectorAll('.book-card').forEach(card => {
    if (card) {
        card.addEventListener('mouseenter', function() {
            if (this) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    }
});

// Theme switching
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;

const THEME_CLASSES = ['theme-default', 'theme-psych', 'theme-horror', 'theme-fantasy', 'theme-drama', 'theme-mystery', 'theme-series'];

function setTheme(theme) {
    if (!theme || !body) return;
    
    THEME_CLASSES.forEach(cls => body.classList.remove(cls));
    const target = `theme-${theme}`;
    body.classList.add(target);
    
    if (themeButtons && themeButtons.length > 0) {
        themeButtons.forEach(btn => {
            if (btn && btn.dataset) {
                btn.classList.toggle('active', btn.dataset.theme === theme);
            }
        });
    }
    
    try {
        localStorage.setItem('kk-theme', theme);
    } catch (e) {
        console.warn('LocalStorage not available:', e);
    }
}

if (themeButtons && themeButtons.length > 0) {
    const savedTheme = (() => {
        try {
            return localStorage.getItem('kk-theme') || 'default';
        } catch (e) {
            return 'default';
        }
    })();
    
    setTheme(savedTheme);

    themeButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (btn.dataset && btn.dataset.theme) {
                    setTheme(btn.dataset.theme);
                }
            });
        }
    });
}

// Ensure mailto opens even on single-page routing prevention
document.querySelectorAll('a[href^="mailto:"]').forEach(mailLink => {
    mailLink.addEventListener('click', (e) => {
        const href = mailLink.getAttribute('href');
        if (href) {
            e.preventDefault();
            window.location.href = href;
        }
    });
});

// Contact form handling with backend API
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name') || '',
            email: formData.get('email'),
            message: formData.get('message')
        };

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                const successMsg = document.createElement('p');
                successMsg.className = 'contact-success';
                successMsg.style.color = 'var(--accent-gold)';
                successMsg.style.marginTop = '15px';
                successMsg.style.textAlign = 'center';
                successMsg.textContent = result.message;
                
                const existingMsg = contactForm.querySelector('.contact-success, .contact-error');
                if (existingMsg) existingMsg.remove();
                
                contactForm.appendChild(successMsg);
                contactForm.reset();
                
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact error:', error);
            
            const errorMsg = document.createElement('p');
            errorMsg.className = 'contact-error';
            errorMsg.style.color = '#e63946';
            errorMsg.style.marginTop = '15px';
            errorMsg.style.textAlign = 'center';
            errorMsg.textContent = error.message || 'Failed to send message. Please try again later.';
            
            const existingMsg = contactForm.querySelector('.contact-success, .contact-error');
            if (existingMsg) existingMsg.remove();
            
            contactForm.appendChild(errorMsg);
            
            setTimeout(() => {
                errorMsg.remove();
            }, 5000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Feedback form handling with backend API
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const data = {
            name: formData.get('name') || '',
            email: formData.get('email'),
            message: formData.get('message'),
            type: 'feedback'
        };

        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                const successMsg = document.createElement('p');
                successMsg.className = 'feedback-success';
                successMsg.style.color = 'var(--accent-gold)';
                successMsg.style.marginTop = '15px';
                successMsg.style.textAlign = 'center';
                successMsg.textContent = 'Thank you for your feedback! I appreciate your thoughts.';
                
                const existingMsg = feedbackForm.querySelector('.feedback-success, .feedback-error');
                if (existingMsg) existingMsg.remove();
                
                feedbackForm.appendChild(successMsg);
                feedbackForm.reset();
                
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            } else {
                throw new Error(result.message || 'Failed to send feedback');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            
            const errorMsg = document.createElement('p');
            errorMsg.className = 'feedback-error';
            errorMsg.style.color = '#e63946';
            errorMsg.style.marginTop = '15px';
            errorMsg.style.textAlign = 'center';
            errorMsg.textContent = error.message || 'Failed to send feedback. Please try again later.';
            
            const existingMsg = feedbackForm.querySelector('.feedback-success, .feedback-error');
            if (existingMsg) existingMsg.remove();
            
            feedbackForm.appendChild(errorMsg);
            
            setTimeout(() => {
                errorMsg.remove();
            }, 5000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Ambient particles
function spawnParticles(count = 24) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'particle';
        frag.appendChild(dot);
    }
    document.body.appendChild(frag);
}

// FX + particles per theme
const PARTICLE_SYMBOLS = {
    default: ['✨', '✦'],
    psych: ['🧠', '🧬'],
    horror: ['⚡️', '🦇'],
    fantasy: ['✨', '🪐', '⭐'],
    mystery: ['🔍', '🕵️'],
    drama: ['❤️', '💘'],
    series: ['🌿', '💻', '🖥️'],
};

function applyPerThemeFX(theme) {
    if (!theme) return;
    
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.setAttribute('data-fx', theme);
    }
    
    // reset particles
    try {
        document.querySelectorAll('.particle').forEach(p => {
            if (p && p.parentNode) {
                p.remove();
            }
        });
    } catch (e) {
        console.warn('Error removing particles:', e);
    }
    
    const symbols = PARTICLE_SYMBOLS[theme] || PARTICLE_SYMBOLS.default;
    if (!symbols || symbols.length === 0) return;
    
    const frag = document.createDocumentFragment();
    const count = 26;
    
    for (let i = 0; i < count; i++) {
        try {
            const dot = document.createElement('span');
            dot.className = 'particle';
            dot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            dot.style.left = Math.random() * 100 + 'vw';
            dot.style.top = Math.random() * 100 + 'vh';
            dot.style.animationDelay = `${Math.random() * 12}s`;
            dot.style.animationDuration = `${12 + Math.random() * 10}s`;
            dot.style.opacity = (0.15 + Math.random() * 0.35).toFixed(2);
            dot.style.fontSize = `${16 + Math.random() * 10}px`;
            frag.appendChild(dot);
        } catch (e) {
            console.warn('Error creating particle:', e);
        }
    }
    
    if (frag.childNodes.length > 0 && document.body) {
        document.body.appendChild(frag);
    }
}

// Initialize particles on page load
if (themeButtons && themeButtons.length > 0) {
    const savedTheme = (() => {
        try {
            return localStorage.getItem('kk-theme') || 'default';
        } catch (e) {
            return 'default';
        }
    })();
    
    applyPerThemeFX(savedTheme);
    
    themeButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (btn.dataset && btn.dataset.theme) {
                    applyPerThemeFX(btn.dataset.theme);
                }
            });
        }
    });
}

// Console message
console.log('%c Kal Krish — Writer of Worlds, Weaver of Shadows ', 'background: #d4af37; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Stories born from struggle, grown with imagination, and lived through emotion. ', 'color: #d4af37; font-size: 14px;');
