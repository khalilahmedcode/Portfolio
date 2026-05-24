// Initialize AOS after script is fully loaded
window.addEventListener('load', () => {
    // Hide loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 800);

    // Init AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50 // Slightly reduced offset to trigger earlier
        });
    }
});

// Scroll Progress & Navbar styling
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    const progressEl = document.getElementById('scrollProgress');
    if(progressEl) progressEl.style.width = progress + '%';

    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Theme Toggling
let isDark = true;
function toggleTheme() {
    isDark = !isDark;
    const body = document.body;
    const toggleBtn = document.getElementById('themeToggle');

    if (isDark) {
        body.classList.remove('light-mode');
        if(toggleBtn) toggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        if(toggleBtn) toggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

const themeToggleBtn = document.getElementById('themeToggle');
if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if(themeToggleBtn) themeToggleBtn.textContent = '☀️';
    isDark = false;
}

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

function closeMobile() {
    if(hamburger) hamburger.classList.remove('active');
    if(mobileMenu) mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Animate Stats Counters
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const update = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(update);
                    } else {
                        // Only add + for specific types of stats, e.g. Clients, Projects
                        if(target > 20) {
                            counter.textContent = target + '+';
                        } else {
                            counter.textContent = target;
                        }
                    }
                };
                update();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Initialize counters
document.addEventListener('DOMContentLoaded', animateCounters);

// Contact Form Handler
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    if(!btn) return;
    
    const originalText = btn.innerHTML;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}

// Particles Canvas Background
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.3 + 0.1
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark
                ? `rgba(59, 130, 246, ${p.opacity})`
                : `rgba(59, 130, 246, ${p.opacity * 0.5})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = isDark
                        ? `rgba(59, 130, 246, ${0.08 * (1 - dist / 150)})`
                        : `rgba(59, 130, 246, ${0.04 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

// Smooth Scrolling for Anchors (with offset for fixed navbar)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if(href === "#") return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PORTFOLIO FUNCTIONS =====
const portfolioDemos = {
    logo1: {
        title: 'Modern Tech Logo',
        desc: 'Minimalist design for tech startup. Clean lines and modern aesthetics.',
        image: 'https://placehold.co/600x400/2563eb/ffffff?text=Logo+Design+1',
        link: null
    },
    logo2: {
        title: 'Creative Agency Logo',
        desc: 'Bold and vibrant branding that stands out. Perfect for creative agencies.',
        image: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Logo+Design+2',
        link: null
    },
    logo3: {
        title: 'E-commerce Logo',
        desc: 'Professional and trustworthy design for online business.',
        image: 'https://placehold.co/600x400/ec4899/ffffff?text=Logo+Design+3',
        link: null
    },
    logo4: {
        title: 'Fitness Brand Logo',
        desc: 'Energy and dynamism in every pixel. Perfect for fitness brands.',
        image: 'https://placehold.co/600x400/10b981/ffffff?text=Logo+Design+4',
        link: null
    },
    logo5: {
        title: 'Coffee Shop Logo',
        desc: 'Warm and welcoming design that captures the essence of coffee culture.',
        image: 'https://placehold.co/600x400/f59e0b/ffffff?text=Logo+Design+5',
        link: null
    },
    website1: {
        title: 'Podium - Creative Portfolio',
        desc: 'Professional creative portfolio with minimalist design. Showcasing innovative design patterns and smooth user interactions with modern aesthetics.',
        image: 'https://img.sanishtech.com/u/fd2401f963a4223ca82427121eeaf69a.png',
        link: 'https://podium.global/'
    },
    website2: {
        title: 'Nitec - Product Store',
        desc: 'Modern e-commerce platform for tech products. Clean interface with professional product showcase and smooth shopping experience.',
        image: 'https://img.sanishtech.com/u/fd2401f963a4223ca82427121eeaf69a.png',
        link: 'https://podium.global/'
    },
    website3: {
        title: 'Elvera - Fashion Store',
        desc: 'Dynamic fashion e-commerce with bold branding. Trendy collection showcase with engaging user interface and modern design elements.',
        image: 'https://img.sanishtech.com/u/fd2401f963a4223ca82427121eeaf69a.png',
        link: 'https://podium.global/'
    }
};

function switchTab(tabName, element) {
    document.querySelectorAll('.portfolio-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const tab = document.getElementById(tabName + '-tab');
    if(tab) tab.classList.add('active');
    element.classList.add('active');
}

function openDemo(demoId) {
    const demo = portfolioDemos[demoId];
    if (demo) {
        const modal = document.getElementById('demo-modal');
        document.getElementById('demo-image').src = demo.image;
        document.getElementById('demo-title').textContent = demo.title;
        document.getElementById('demo-desc').textContent = demo.desc;
        
        const visitBtn = document.getElementById('demo-visit-btn');
        if (demo.link) {
            visitBtn.href = demo.link;
            visitBtn.style.display = 'inline-flex';
        } else {
            visitBtn.style.display = 'none';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDemo(event) {
    // If event is passed, only close if target is the overlay itself
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('demo-modal');
    if(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeDemo();
    }
});
