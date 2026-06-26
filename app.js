document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. SCROLL REVEAL OBSERVER
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: stop observing once revealed
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================
  // 2. FLOATING HEADER SENSITIVITY
  // ==========================================
  const headerNav = document.getElementById('headerNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });


  // ==========================================
  // 3. HERO CANVAS PARTICLE MESH
  // ==========================================
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  const particles = [];
  const particleCount = 65;
  let mouse = { x: null, y: null, active: false, speedMultiplier: 1 };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.5 ? 'rgba(0, 112, 243, 0.6)' : 'rgba(121, 40, 202, 0.6)';
    }

    update() {
      // Speed up if mouse is active
      const currentMultiplier = mouse.active ? 3.5 : 1;
      this.x += this.vx * currentMultiplier;
      this.y += this.vy * currentMultiplier;

      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse attraction sutil
      if (mouse.active && mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          this.x += (dx / dist) * 0.4;
          this.y += (dy / dist) * 0.4;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = mouse.active ? 'rgba(0, 242, 254, 0.8)' : this.baseColor;
      ctx.shadowColor = mouse.active ? '#00f2fe' : '#0070f3';
      ctx.shadowBlur = mouse.active ? 6 : 0;
      ctx.fill();
    }
  }

  // Init particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    ctx.shadowBlur = 0; // reset shadow
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = mouse.active
            ? `rgba(0, 242, 254, ${alpha * 2.5})`
            : `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = mouse.active ? 1.2 : 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw sutil background grid lines or particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawLines();
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Mouse events on Hero canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });


  // ==========================================
  // 4. TECH CAROUSEL DECELERATION ON HOVER
  // ==========================================
  const tickerTrack = document.getElementById('tickerTrack');
  // Simple CSS implementation handles pausing, but for dynamic decelerating:
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
    // Smooth transition can be achieved using a sutil animation duration slowing down in CSS:
    // Ticker will hold and allow hovering to view logos in active colors.
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });


  // ==========================================
  // 5. MATRIX EFFECT IN PAIN CARDS
  // ==========================================
  const painCards = document.querySelectorAll('.pain-card');

  painCards.forEach(card => {
    const c = card.querySelector('.pain-card-canvas');
    const ct = c.getContext('2d');
    let matrixInterval;

    let w = card.offsetWidth;
    let h = card.offsetHeight;
    c.width = w;
    c.height = h;

    const chars = "010101XYZ{}[]<>/\\+=#$*@";
    const fontSize = 10;
    const columns = Math.floor(w / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function drawMatrix() {
      ct.fillStyle = 'rgba(10, 10, 10, 0.15)'; // sutil fade-out
      ct.fillRect(0, 0, w, h);

      ct.fillStyle = 'rgba(255, 51, 68, 0.12)'; // red code
      ct.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ct.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function startMatrix() {
      w = card.offsetWidth;
      h = card.offsetHeight;
      c.width = w;
      c.height = h;
      clearInterval(matrixInterval);
      matrixInterval = setInterval(drawMatrix, 40);
    }

    function stopMatrix() {
      clearInterval(matrixInterval);
      ct.clearRect(0, 0, w, h);
    }

    // Run matrix rain in background/hover
    card.addEventListener('mouseenter', startMatrix);
    card.addEventListener('mouseleave', stopMatrix);

    // Resize support
    window.addEventListener('resize', () => {
      w = card.offsetWidth;
      h = card.offsetHeight;
      c.width = w;
      c.height = h;
    });
  });


  // ==========================================
  // 6. BENTO GRID MOUSE LIGHT TRACKING
  // ==========================================
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(bCard => {
    bCard.addEventListener('mousemove', (e) => {
      const rect = bCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      bCard.style.setProperty('--mouse-x', `${x}px`);
      bCard.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // ==========================================
  // 7. TIMELINE SCROLL PROGRESS DRAWING
  // ==========================================
  const fillLine = document.getElementById('timelineLineFill');
  const steps = document.querySelectorAll('.timeline-step');
  const methodologySection = document.getElementById('processo');

  function updateTimelineProgress() {
    const rect = methodologySection.getBoundingClientRect();
    const sectionHeight = rect.height;

    // Calculate how far down the section the viewport is
    // When the top of methodology section is at 50% screen height, progress begins.
    const startPoint = window.innerHeight * 0.6;
    const relativeScroll = startPoint - rect.top;

    // We want timeline to fill as we scroll to the last step content
    const totalFillableHeight = sectionHeight - 160;
    let progressPercent = (relativeScroll / totalFillableHeight) * 100;

    // Bound progressPercent between 0 and 100
    progressPercent = Math.min(Math.max(progressPercent, 0), 100);

    fillLine.style.height = `${progressPercent}%`;

    // Activate steps based on position
    steps.forEach((step, idx) => {
      const stepRect = step.getBoundingClientRect();
      if (stepRect.top < window.innerHeight * 0.55) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateTimelineProgress);
  updateTimelineProgress();


  // ==========================================
  // 8. CASES STUDIES SLIDER AND BG DYNAMICS
  // ==========================================
  const casesSection = document.getElementById('cases');
  const casesSliderInner = document.getElementById('casesSliderInner');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const sliderDots = document.getElementById('sliderDots');
  const slides = document.querySelectorAll('.case-slide');
  let currentSlide = 0;

  // Background values depending on case:
  // Case 0 -> Deep Dark Cyan glow
  // Case 1 -> Deep Dark Violet glow
  // Case 2 -> Deep Dark Blue glow
  // Case 3 -> Deep Dark Green/Cyan glow
  const caseBgs = [
    'radial-gradient(circle at 80% 50%, rgba(0, 112, 243, 0.08) 0%, #030303 60%)',
    'radial-gradient(circle at 80% 50%, rgba(121, 40, 202, 0.08) 0%, #030303 60%)',
    'radial-gradient(circle at 80% 50%, rgba(0, 112, 243, 0.08) 0%, #030303 60%)',
    'radial-gradient(circle at 80% 50%, rgba(0, 242, 254, 0.08) 0%, #030303 60%)'
  ];

  function updateSlider() {
    // Translate the slider track
    casesSliderInner.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active dot
    const dots = sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update section background
    casesSection.style.background = caseBgs[currentSlide];
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  });

  // Dot clicking
  const dots = sliderDots.querySelectorAll('.slider-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentSlide = parseInt(e.target.getAttribute('data-index'));
      updateSlider();
    });
  });

  // Swipe and Drag gesture handling
  let isDragging = false;
  let startX = 0;
  let diffX = 0;

  function getPositionX(e) {
    return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  }

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    diffX = 0;
    casesSliderInner.style.transition = 'none';
    if (!e.type.includes('touch')) {
      e.preventDefault(); // prevents image drag ghosts
    }
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    diffX = currentX - startX;

    const containerWidth = casesSliderInner.offsetWidth;
    const dragPercent = (diffX / containerWidth) * 100;
    const targetTranslate = -currentSlide * 100 + dragPercent;
    casesSliderInner.style.transform = `translateX(${targetTranslate}%)`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    casesSliderInner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    if (diffX < -50) {
      currentSlide = (currentSlide + 1) % slides.length;
    } else if (diffX > 50) {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    updateSlider();
  }

  // Mouse gestures
  casesSliderInner.addEventListener('mousedown', dragStart);
  casesSliderInner.addEventListener('mousemove', dragMove);
  casesSliderInner.addEventListener('mouseup', dragEnd);
  casesSliderInner.addEventListener('mouseleave', dragEnd);

  // Touch gestures
  casesSliderInner.addEventListener('touchstart', dragStart, { passive: true });
  casesSliderInner.addEventListener('touchmove', dragMove, { passive: true });
  casesSliderInner.addEventListener('touchend', dragEnd);

  // Initialize
  updateSlider();


  // ==========================================
  // 10. MAGNETIC BUTTON EFFECT
  // ==========================================
  // Apply magnetic effect to specific buttons
  const magneticBtns = document.querySelectorAll('.btn-primary, .cta-pulse-border, .whatsapp-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Pull button towards cursor
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // ==========================================
  // 11. FAQ ACCORDION LOGIC
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================
  // 12. MOBILE HAMBURGER MENU INTERACTION
  // ==========================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      
      const isActive = navMenu.classList.contains('active');
      mobileToggle.innerHTML = isActive 
        ? `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      });
    });
  }

});
