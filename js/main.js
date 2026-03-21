/**
 * Aristo-Multiverse - Main JavaScript
 * Premium interactions and animations
 */

(function() {
  'use strict';

  // ================================
  // Configuration
  // ================================
  const CONFIG = {
    scrollOffset: 100,
    animationDelay: 100,
    parallaxIntensity: 0.5,
    typingSpeed: 50
  };

  // ================================
  // Utility Functions
  // ================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  
  const throttle = (fn, wait) => {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  };

  const debounce = (fn, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // ================================
  // Navigation
  // ================================
  class Navigation {
    constructor() {
      this.navbar = $('.navbar');
      this.mobileMenuBtn = $('.mobile-menu-btn');
      this.navLinks = $('.nav-links');
      this.isMenuOpen = false;
      
      this.init();
    }

    init() {
      // Scroll effect for navbar
      window.addEventListener('scroll', throttle(() => this.handleScroll(), 50));
      
      // Mobile menu toggle
      if (this.mobileMenuBtn) {
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
      }
      
      // Smooth scroll for anchor links
      $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => this.handleSmoothScroll(e));
      });
      
      // Active link highlighting
      this.highlightActiveLink();
    }

    handleScroll() {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }

    toggleMobileMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.navLinks.classList.toggle('mobile-open', this.isMenuOpen);
      this.mobileMenuBtn.setAttribute('aria-expanded', this.isMenuOpen);
    }

    handleSmoothScroll(e) {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId === '#') return;
      
      const target = $(targetId);
      if (target) {
        const offset = this.navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (this.isMenuOpen) {
          this.toggleMobileMenu();
        }
      }
    }

    highlightActiveLink() {
      const sections = $$('section[id]');
      
      window.addEventListener('scroll', throttle(() => {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');
          
          if (scrollPos >= top && scrollPos < top + height) {
            $$('.nav-links a').forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      }, 100));
    }
  }

  // ================================
  // Scroll Reveal Animations
  // ================================
  class ScrollReveal {
    constructor() {
      this.elements = [];
      this.observer = null;
      
      this.init();
    }

    init() {
      // Create intersection observer
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observe all reveal elements
      $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
        this.observer.observe(el);
      });
    }

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Animate counters if present
          this.animateCounters(entry.target);
          
          // Unobserve after animation
          this.observer.unobserve(entry.target);
        }
      });
    }

    animateCounters(container) {
      $$('[data-counter]', container).forEach(counter => {
        const target = parseInt(counter.dataset.counter, 10);
        const suffix = counter.dataset.suffix || '';
        const prefix = counter.dataset.prefix || '';
        const duration = parseInt(counter.dataset.duration, 10) || 2000;
        
        this.animateNumber(counter, 0, target, duration, prefix, suffix);
      });
    }

    animateNumber(element, start, end, duration, prefix = '', suffix = '') {
      const range = end - start;
      const startTime = performance.now();
      
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-quart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + range * easeOut);
        
        element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
        }
      };
      
      requestAnimationFrame(update);
    }
  }

  // ================================
  // Parallax Effects
  // ================================
  class ParallaxEffect {
    constructor() {
      this.elements = [];
      this.ticking = false;
      
      this.init();
    }

    init() {
      $$('[data-parallax]').forEach(el => {
        this.elements.push({
          el,
          speed: parseFloat(el.dataset.parallax) || 0.5
        });
      });

      if (this.elements.length > 0) {
        window.addEventListener('scroll', () => this.handleScroll());
      }
    }

    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }

    updateParallax() {
      const scrollY = window.scrollY;
      
      this.elements.forEach(({ el, speed }) => {
        const yPos = scrollY * speed;
        el.style.transform = `translateY(${yPos}px)`;
      });
    }
  }

  // ================================
  // Typing Effect
  // ================================
  class Typewriter {
    constructor(element, text, speed = 50) {
      this.element = element;
      this.text = text;
      this.speed = speed;
      this.index = 0;
      this.isTyping = false;
    }

    start() {
      if (this.isTyping) return;
      this.isTyping = true;
      this.element.textContent = '';
      this.type();
    }

    type() {
      if (this.index < this.text.length) {
        this.element.textContent += this.text.charAt(this.index);
        this.index++;
        setTimeout(() => this.type(), this.speed);
      } else {
        this.isTyping = false;
      }
    }
  }

  // ================================
  // Particle System
  // ================================
  class ParticleSystem {
    constructor(container, count = 50) {
      this.container = container;
      this.count = count;
      this.particles = [];
      
      this.init();
    }

    init() {
      for (let i = 0; i < this.count; i++) {
        this.createParticle();
      }
    }

    createParticle() {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;
      
      this.container.appendChild(particle);
    }
  }

  // ================================
  // Interactive Charts
  // ================================
  class ChartAnimator {
    static animateBars() {
      $$('.chart-bar').forEach((bar, index) => {
        const height = bar.dataset.height || '0%';
        bar.style.height = '0%';
        
        setTimeout(() => {
          bar.style.transition = 'height 1s ease-out';
          bar.style.height = height;
        }, index * 100);
      });
    }

    static animatePie() {
      $$('.chart-pie').forEach(pie => {
        const segments = pie.querySelectorAll('.pie-segment');
        let currentAngle = 0;
        
        segments.forEach((segment, index) => {
          const angle = parseFloat(segment.dataset.angle) || 0;
          segment.style.transform = `rotate(${currentAngle}deg)`;
          segment.style.transition = 'all 0.5s ease-out';
          segment.style.opacity = '0';
          
          setTimeout(() => {
            segment.style.opacity = '1';
          }, index * 200);
          
          currentAngle += angle;
        });
      });
    }
  }

  // ================================
  // Form Validation
  // ================================
  class FormValidator {
    constructor(form) {
      this.form = form;
      this.init();
    }

    init() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      $$('input, textarea, select', this.form).forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearError(field));
      });
    }

    validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let message = '';

      if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
      } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
      }

      if (!isValid) {
        this.showError(field, message);
      }

      return isValid;
    }

    showError(field, message) {
      this.clearError(field);
      
      field.classList.add('error');
      
      const errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      errorEl.textContent = message;
      errorEl.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
      `;
      
      field.parentNode.appendChild(errorEl);
    }

    clearError(field) {
      field.classList.remove('error');
      const errorEl = field.parentNode.querySelector('.error-message');
      if (errorEl) {
        errorEl.remove();
      }
    }

    handleSubmit(e) {
      e.preventDefault();
      
      const fields = $$('input, textarea, select', this.form);
      let isValid = true;
      
      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.submitForm();
      }
    }

    submitForm() {
      const submitBtn = this.form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.add('success');
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('success');
          this.form.reset();
        }, 3000);
      }, 1500);
    }
  }

  // ================================
  // Cursor Effect
  // ================================
  class CursorEffect {
    constructor() {
      this.cursor = null;
      this.cursorDot = null;
      this.isTouch = window.matchMedia('(pointer: coarse)').matches;
      
      if (!this.isTouch) {
        this.init();
      }
    }

    init() {
      // Create cursor elements
      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor';
      this.cursor.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(201, 162, 39, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease-out, opacity 0.15s ease-out;
        transform: translate(-50%, -50%);
        opacity: 0;
      `;

      this.cursorDot = document.createElement('div');
      this.cursorDot.className = 'custom-cursor-dot';
      this.cursorDot.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: #c9a227;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        opacity: 0;
      `;

      document.body.appendChild(this.cursor);
      document.body.appendChild(this.cursorDot);

      // Event listeners
      document.addEventListener('mousemove', (e) => this.moveCursor(e));
      document.addEventListener('mouseenter', () => this.showCursor());
      document.addEventListener('mouseleave', () => this.hideCursor());

      // Interactive elements
      $$('a, button, .card, .service-item').forEach(el => {
        el.addEventListener('mouseenter', () => this.enlargeCursor());
        el.addEventListener('mouseleave', () => this.shrinkCursor());
      });
    }

    moveCursor(e) {
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top = e.clientY + 'px';
      this.cursorDot.style.left = e.clientX + 'px';
      this.cursorDot.style.top = e.clientY + 'px';
    }

    showCursor() {
      this.cursor.style.opacity = '1';
      this.cursorDot.style.opacity = '1';
    }

    hideCursor() {
      this.cursor.style.opacity = '0';
      this.cursorDot.style.opacity = '0';
    }

    enlargeCursor() {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      this.cursor.style.borderColor = 'rgba(201, 162, 39, 0.8)';
    }

    shrinkCursor() {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      this.cursor.style.borderColor = 'rgba(201, 162, 39, 0.5)';
    }
  }

  // ================================
  // Theme Toggle
  // ================================
  class ThemeToggle {
    constructor() {
      this.toggle = $('[data-theme-toggle]');
      this.html = document.documentElement;
      
      this.init();
    }

    init() {
      // Check for saved theme or system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        this.html.setAttribute('data-theme', savedTheme);
      } else if (!systemPrefersDark) {
        this.html.setAttribute('data-theme', 'light');
      }

      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleTheme());
      }
    }

    toggleTheme() {
      const currentTheme = this.html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      this.html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  }

  // ================================
  // Magnetic Buttons
  // ================================
  class MagneticButton {
    constructor() {
      this.buttons = $$('[data-magnetic]');
      this.isTouch = window.matchMedia('(pointer: coarse)').matches;
      
      if (!this.isTouch) {
        this.init();
      }
    }

    init() {
      this.buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
        btn.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, btn));
      });
    }

    handleMouseMove(e, btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const strength = parseFloat(btn.dataset.magnetic) || 0.3;
      
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }

    handleMouseLeave(e, btn) {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s ease-out';
      
      setTimeout(() => {
        btn.style.transition = '';
      }, 300);
    }
  }

  // ================================
  // Preloader
  // ================================
  class Preloader {
    constructor() {
      this.preloader = $('.preloader');
      this.init();
    }

    init() {
      if (!this.preloader) return;

      window.addEventListener('load', () => {
        setTimeout(() => {
          this.preloader.classList.add('loaded');
          
          setTimeout(() => {
            this.preloader.remove();
          }, 500);
        }, 1000);
      });
    }
  }

  // ================================
  // Initialize Everything
  // ================================
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new ScrollReveal();
    new ParallaxEffect();
    new Preloader();
    new ThemeToggle();
    new MagneticButton();
    
    // Initialize cursor effect on non-touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) {
      new CursorEffect();
    }

    // Initialize particle system
    const particlesContainer = $('.hero-particles');
    if (particlesContainer) {
      new ParticleSystem(particlesContainer, 30);
    }

    // Initialize form validation
    $$('form[data-validate]').forEach(form => {
      new FormValidator(form);
    });

    // Initialize typewriter effects
    $$('[data-typewriter]').forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      const typewriter = new Typewriter(el, text, 50);
      
      // Start when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typewriter.start();
            observer.unobserve(el);
          }
        });
      });
      
      observer.observe(el);
    });

    // Chart animations
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ChartAnimator.animateBars();
          ChartAnimator.animatePie();
          chartObserver.unobserve(entry.target);
        }
      });
    });

    $$('.chart-container').forEach(chart => {
      chartObserver.observe(chart);
    });

    console.log('%c Aristo-Multiverse ', 'background: linear-gradient(135deg, #c9a227, #d4af37); color: #0a1628; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Premium Consulting & Research ', 'color: #c9a227; font-size: 14px;');
  });

})();
