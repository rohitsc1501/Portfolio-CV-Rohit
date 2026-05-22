/* ============================================================
   ROHIT CHOUDHARI — PORTFOLIO SCRIPT
   Handles: Loader, Custom Cursor, Smooth Nav, Scroll Reveal,
            Counter Animation, Skill Bars, Page Transitions,
            Contact Form, Hamburger Menu
   ============================================================ */

'use strict';

/* ─── LOADER ────────────────────────────────────────────────── */
(function initLoader() {
  const loader     = document.getElementById('loader');
  const loaderBar  = document.getElementById('loaderBar');
  const loaderPct  = document.getElementById('loaderPercent');

  let progress = 0;
  const target = 100;
  const step   = Math.random() * 2 + 1;

  const interval = setInterval(() => {
    progress += step;
    if (progress >= target) {
      progress = target;
      clearInterval(interval);
      setTimeout(hideLoader, 300);
    }
    loaderBar.style.width  = progress + '%';
    loaderPct.textContent  = Math.floor(progress) + '%';
  }, 25);

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero reveal after loader
    setTimeout(triggerHeroReveal, 100);
  }

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ─── CUSTOM CURSOR ─────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Grow cursor on hover over interactive elements
  const interactives = 'a, button, .project-card, .skill-category, .av-card, .timeline-card, .ci-item, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(interactives) || e.target.closest(interactives)) {
      cursor.style.width    = '20px';
      cursor.style.height   = '20px';
      follower.style.width  = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(232,130,12,0.8)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(interactives) || e.target.closest(interactives)) {
      cursor.style.width    = '10px';
      cursor.style.height   = '10px';
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(232,130,12,0.5)';
    }
  });
})();

/* ─── NAVBAR ────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const navLinks    = document.querySelectorAll('.nav-link, .mob-link');
  const sections    = document.querySelectorAll('section[id]');

  // Scroll: add scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  // Active link based on scroll position
  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Smooth scroll for all nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId  = anchor.getAttribute('href');
      const targetEl  = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      window.scrollTo({ top: targetEl.offsetTop - 72, behavior: 'smooth' });
    });
  });
})();

/* ─── HERO REVEAL ───────────────────────────────────────────── */
function triggerHeroReveal() {
  const heroEls = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right, .hero .reveal-left');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

/* ─── SCROLL REVEAL (INTERSECTION OBSERVER) ────────────────── */
(function initScrollReveal() {
  const options = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger skill bars when skills section enters
        if (entry.target.classList.contains('skill-bars-wrap')) {
          animateSkillBars();
        }

        // Trigger counters when hero stats enter
        if (entry.target.classList.contains('hero-stats')) {
          animateCounters();
        }

        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all reveal elements OUTSIDE hero (hero handled separately)
  document.querySelectorAll('.section .reveal-up, .section .reveal-left, .section .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target  = parseInt(el.dataset.count, 10);
    const dur     = 1200;
    const start   = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  });
}

/* ─── SKILL BAR ANIMATION ───────────────────────────────────── */
function animateSkillBars() {
  document.querySelectorAll('.sb-fill').forEach(bar => {
    const width = bar.dataset.width;
    bar.style.width = width + '%';
  });
}

/* ─── TILT EFFECT ON PROJECT CARDS ─────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) *  6;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── PARALLAX ON HERO BLOBS ────────────────────────────────── */
(function initParallax() {
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (blob1) blob1.style.transform = `translate(0, ${y * 0.15}px)`;
    if (blob2) blob2.style.transform = `translate(0, ${y * -0.1}px)`;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    if (blob1) blob1.style.transform += ` translate(${x}px, ${y}px)`;
  }, { passive: true });
})();

/* ─── TYPED EFFECT ON HERO TITLE ────────────────────────────── */
(function initTypedEffect() {
  const words   = ['Experiences', 'Solutions', 'Innovations', 'Futures'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting  = false;

  // Target the last .line in the hero title
  const lines = document.querySelectorAll('.hero-title .line');
  const target = lines[lines.length - 1];
  if (!target) return;

  const originalText = target.textContent.trim();

  function type() {
    const currentWord = words[wordIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = currentWord.substring(0, charIndex);
      if (charIndex === currentWord.length) {
        setTimeout(() => { deleting = true; type(); }, 2200);
        return;
      }
    } else {
      charIndex--;
      target.textContent = currentWord.substring(0, charIndex);
      if (charIndex === 0) {
        deleting   = false;
        wordIndex  = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? 60 : 90);
  }

  // Start after loader finishes (3s delay)
  setTimeout(type, 3000);
})();

/* ─── CONTACT FORM ──────────────────────────────────────────── */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  const btn         = document.getElementById('submit-btn');
  const btnText     = btn.querySelector('.btn-text');
  const btnLoader   = btn.querySelector('.btn-loader');
  const successMsg  = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI: loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    btn.disabled = true;

    // Simulate async send (replace with real API call)
    await new Promise(r => setTimeout(r, 1800));

    // Success
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    btn.disabled = false;
    form.reset();
    successMsg.classList.remove('hidden');

    setTimeout(() => successMsg.classList.add('hidden'), 5000);
  });
})();

/* ─── GLITCH TEXT ON LOGO HOVER ─────────────────────────────── */
(function initGlitch() {
  const logoLink = document.getElementById('nav-logo-link');
  if (!logoLink) return;

  const chars = 'RC';
  let glitchInterval = null;

  logoLink.addEventListener('mouseenter', () => {
    let count = 0;
    glitchInterval = setInterval(() => {
      count++;
      if (count > 8) {
        clearInterval(glitchInterval);
        return;
      }
    }, 60);
  });
})();

/* ─── SMOOTH SECTION TRANSITIONS (GSAP-style pure CSS triggers) */
(function initSectionTransitions() {
  // Add stagger delay to sibling reveal elements
  document.querySelectorAll('.skills-grid, .projects-grid, .timeline').forEach(container => {
    container.querySelectorAll('.reveal-up').forEach((el, i) => {
      el.style.setProperty('--delay', (i * 0.1) + 's');
    });
  });
})();

/* ─── PERFORMANCE: Passive scroll listener shorthand ────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Initial navbar check (if page refreshed midway)
  if (window.scrollY > 20) {
    document.getElementById('navbar').classList.add('scrolled');
  }

  // Trigger hero counters only after loader is gone
  setTimeout(animateCounters, 2500);
});

/* ─── PHOTOGRAPHY GALLERY ───────────────────────────────────── */
(function initGallery() {

  /* ---- Build photo data from DOM ---- */
  const photoItems = Array.from(document.querySelectorAll('.photo-item'));

  // Build data array for lightbox navigation
  const photoData = photoItems.map(item => ({
    src   : item.querySelector('img').src,
    alt   : item.querySelector('img').alt,
    title : item.querySelector('.photo-view-label')?.textContent || '',
    el    : item,
    id    : item.querySelector('.like-count')?.dataset.photoId || 'photo_unknown'
  }));

  let visiblePhotos  = [...photoData]; // All photos are visible now

  /* ---- Lightbox ---- */
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxPrev    = document.getElementById('lightboxPrev');
  const lightboxNext    = document.getElementById('lightboxNext');
  const lightboxBg      = document.getElementById('lightboxBackdrop');
  const lightboxSpinner = document.getElementById('lightboxSpinner');

  let currentIndex   = 0;

  // Open lightbox
  function openLightbox(dataIndex) {
    currentIndex = dataIndex;
    loadPhoto(currentIndex);
    if(lightbox) lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightbox() {
    if(lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Load photo at index
  function loadPhoto(idx) {
    if (!visiblePhotos.length) return;
    currentIndex = ((idx % visiblePhotos.length) + visiblePhotos.length) % visiblePhotos.length;

    const photo = visiblePhotos[currentIndex];

    // Show spinner
    if(lightboxSpinner) lightboxSpinner.classList.add('active');
    if(lightboxImg) lightboxImg.classList.add('loading');

    const tempImg = new Image();
    tempImg.onload = () => {
      if(lightboxImg) lightboxImg.src = photo.src;
      if(lightboxImg) lightboxImg.alt = photo.alt;
      if(lightboxCaption) lightboxCaption.textContent = photo.title;
      if(lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
      if(lightboxImg) lightboxImg.classList.remove('loading');
      if(lightboxSpinner) lightboxSpinner.classList.remove('active');
    };
    tempImg.src = photo.src;
  }

  /* ---- Like System ---- */
  const API_BASE = 'https://api.counterapi.dev/v1/rohitportfolio2026/';

  function getLikes() {
    return JSON.parse(localStorage.getItem('portfolio_likes')) || {};
  }
  function saveLikes(likesObj) {
    localStorage.setItem('portfolio_likes', JSON.stringify(likesObj));
  }

  async function fetchGlobalCount(photoId, countEl) {
    try {
      const res = await fetch(API_BASE + photoId);
      const data = await res.json();
      if (data && data.count !== undefined) {
        countEl.textContent = data.count;
      }
    } catch (err) {
      console.error('Failed to fetch count for', photoId);
    }
  }

  async function handleLike(photoId, badgeEl, animEl, countEl) {
    let likes = getLikes();
    const isLiked = !!likes[photoId];
    
    // Optimistic UI Update
    let currentCount = parseInt(countEl.textContent) || 0;
    
    if (isLiked) {
      // Unlike it
      delete likes[photoId];
      saveLikes(likes);
      badgeEl.classList.remove('liked');
      countEl.textContent = Math.max(0, currentCount - 1);
      
      try {
        await fetch(API_BASE + photoId + '/down');
      } catch (err) { console.error(err); }
    } else {
      // Like it
      likes[photoId] = true;
      saveLikes(likes);
      badgeEl.classList.add('liked');
      countEl.textContent = currentCount + 1;
      
      // Trigger heart animation
      if (animEl) {
        animEl.classList.remove('animate');
        void animEl.offsetWidth; // trigger reflow
        animEl.classList.add('animate');
      }
      
      try {
        await fetch(API_BASE + photoId + '/up');
      } catch (err) { console.error(err); }
    }
  }

  // Init likes on page load
  const localLikes = getLikes();

  // Attach click to each photo item
  photoItems.forEach((item, index) => {
    const photoId = photoData[index].id;
    const badgeEl = item.querySelector('.like-badge');
    const animEl = item.querySelector('.like-heart-anim');
    const countEl = item.querySelector('.like-count');

    // Load initial local state
    if (localLikes[photoId]) {
      if (badgeEl) badgeEl.classList.add('liked');
    }
    
    // Fetch global count
    if (countEl) {
      fetchGlobalCount(photoId, countEl);
    }

    let lastTap = 0;

    item.addEventListener('click', (e) => {
      const now = new Date().getTime();
      const timeSince = now - lastTap;
      
      // If clicked on the badge, just toggle like
      if (e.target.closest('.like-badge')) {
        handleLike(photoId, badgeEl, animEl, countEl);
        lastTap = 0; // reset
        return;
      }

      if (timeSince < 300 && timeSince > 0) {
        // Double tap!
        handleLike(photoId, badgeEl, animEl, countEl);
        lastTap = 0; // reset
      } else {
        // Single tap, could be to open lightbox
        lastTap = now;
        // Delay opening lightbox slightly to allow double tap to catch
        setTimeout(() => {
          if (lastTap !== 0) {
            openLightbox(index);
          }
        }, 320);
      }
    });
  });

  // Nav buttons
  if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if(lightboxBg) lightboxBg.addEventListener('click', closeLightbox);
  if(lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); loadPhoto(currentIndex - 1); });
  if(lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); loadPhoto(currentIndex + 1); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    loadPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight')   loadPhoto(currentIndex + 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  if(lightbox) {
    lightbox.addEventListener('touchstart',  (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? loadPhoto(currentIndex + 1) : loadPhoto(currentIndex - 1);
      }
    });
  }

})();

/* ═══════════════════════════════════════════════════════════
   STARFIELD + SHOOTING STARS (Canvas)
   ═══════════════════════════════════════════════════════════ */
(function initStarfield() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let stars = [];
  let shooting = [];

  const STAR_COUNT = 260;

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Create Stars ── */
  function spawnStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = Math.random();
      stars.push({
        x   : Math.random() * W,
        y   : Math.random() * H,
        rad : r < 0.6 ? Math.random() * 0.8 + 0.2          // tiny
            : r < 0.9 ? Math.random() * 1.2 + 0.6          // medium
            :           Math.random() * 1.8 + 1.2,          // large
        alpha : Math.random() * 0.6 + 0.2,
        speed : Math.random() * 0.008 + 0.003,
        dir   : Math.random() > 0.5 ? 1 : -1,
        // Warm or cool star color
        hue   : Math.random() > 0.25 ? 220 : Math.random() * 30 + 25,
      });
    }
  }

  /* ── Create Shooting Star ── */
  function spawnShootingStar() {
    const fromRight = Math.random() > 0.5;
    const startX = fromRight ? W * 0.6 + Math.random() * W * 0.4 : Math.random() * W * 0.5;
    const startY = Math.random() * H * 0.55;
    const angle  = fromRight
      ? Math.PI + Math.random() * 0.4 + 0.2
      : Math.random() * 0.4 + 0.1;

    shooting.push({
      x     : startX,
      y     : startY,
      vx    : Math.cos(angle) * (7 + Math.random() * 6),
      vy    : Math.sin(angle) * (3 + Math.random() * 3) + 1.5,
      tail  : 110 + Math.random() * 80,
      alpha : 1,
      life  : 0,
      maxLife: 55 + Math.random() * 30,
    });
  }

  /* ── Draw frame ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* --- Stars --- */
    for (const s of stars) {
      s.alpha += s.speed * s.dir;
      if (s.alpha > 0.9 || s.alpha < 0.12) s.dir *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.rad, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 80%, 92%, ${s.alpha})`;
      ctx.fill();
    }

    /* --- Shooting Stars --- */
    for (let i = shooting.length - 1; i >= 0; i--) {
      const ss = shooting[i];
      ss.life++;
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.alpha = Math.max(0, 1 - ss.life / ss.maxLife);

      const tailX = ss.x - ss.vx * (ss.tail / 14);
      const tailY = ss.y - ss.vy * (ss.tail / 14);

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, `rgba(255, 210, 120, 0)`);
      grad.addColorStop(0.5, `rgba(255, 200, 100, ${ss.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(255, 240, 200, ${ss.alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.8;
      ctx.lineCap     = 'round';
      ctx.stroke();

      /* Tip glow */
      const glow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
      glow.addColorStop(0, `rgba(255, 240, 200, ${ss.alpha * 0.9})`);
      glow.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      if (ss.life >= ss.maxLife) shooting.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }

  /* ── Schedule shooting stars randomly ── */
  function scheduleShoot() {
    const delay = 2000 + Math.random() * 4000;
    setTimeout(() => {
      spawnShootingStar();
      // Sometimes spawn a second one right after
      if (Math.random() > 0.65) {
        setTimeout(spawnShootingStar, 300 + Math.random() * 500);
      }
      scheduleShoot();
    }, delay);
  }

  /* ── Init ── */
  resize();
  spawnStars();
  draw();
  scheduleShoot();

  window.addEventListener('resize', () => { resize(); spawnStars(); }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   ALBUM CAROUSEL — 3D Fan Layout
   ═══════════════════════════════════════════════════════════ */
(function initAlbumCarousel() {
  const stage    = document.getElementById('albumStage');
  const prevBtn  = document.getElementById('albumPrev');
  const nextBtn  = document.getElementById('albumNext');
  const aibArt   = document.getElementById('aibArt');
  const aibTitle = document.getElementById('aibTitle');
  const aibArtist= document.getElementById('aibArtist');
  const pbPlay   = document.getElementById('pbPlay');
  const pbFill   = document.getElementById('pbFill');
  if (!stage) return;

  const albums = [
    { 
      title: 'Currents',          
      artist: 'Tame Impala',  
      src: 'photos/new_album1.png',
      info: 'A psychedelic pop masterpiece exploring personal transformation, heartbreak, and moving forward into the unknown.',
      spotify: 'https://open.spotify.com/album/79dL7FLiJFOO0EoehUHQBv',
      apple: 'https://music.apple.com/us/album/currents/982726203'
    },
    { 
      title: 'The Slow Rush',     
      artist: 'Tame Impala',  
      src: 'photos/new_album2.png',
      info: 'A deep dive into the passage of time, patience, and accepting the present moment with lush synth-pop landscapes.',
      spotify: 'https://open.spotify.com/album/31qVWUdRrlb8thMvts0yYL',
      apple: 'https://music.apple.com/us/album/the-slow-rush/1497232264'
    },
    { 
      title: 'After Hours',       
      artist: 'The Weeknd',   
      src: 'photos/new_album3.png',
      info: 'A dark, cinematic synth-wave journey through late-night regrets, fame, toxicity, and ultimate heartbreak.',
      spotify: 'https://open.spotify.com/album/4yP0hdKOZPNshxUOjY0cZj',
      apple: 'https://music.apple.com/us/album/after-hours/1499378108'
    },
    { 
      title: 'Hurry Up Tomorrow', 
      artist: 'The Weeknd',   
      src: 'photos/new_album4.png',
      info: 'The haunting and highly anticipated final chapter of The Weeknd\'s new conceptual trilogy dealing with existential rebirth.',
      spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpzMBGW3Z',
      apple: 'https://music.apple.com/us/artist/the-weeknd/392727146'
    },
    { 
      title: 'House of Balloons', 
      artist: 'The Weeknd',   
      src: 'photos/new_album5.png',
      info: 'The atmospheric and edgy debut mixtape that redefined dark R&B with raw themes of excess and emotional numbness.',
      spotify: 'https://open.spotify.com/album/5OEnuGjCeywpxQOgmbW3w1',
      apple: 'https://music.apple.com/us/album/house-of-balloons-original/1557997973'
    },
    { 
      title: 'I AM MUSIC', 
      artist: 'Playboi Carti',   
      src: 'photos/new_album6.png',
      info: 'The highly anticipated album from Playboi Carti, featuring a diverse cast of collaborators and groundbreaking rap sounds.',
      spotify: 'https://open.spotify.com/artist/699OTQXzgjhIYAHMy9RyPD',
      apple: 'https://music.apple.com/us/artist/playboi-carti/1047648316'
    },
    { 
      title: 'The Life of Pablo', 
      artist: 'Kanye West',   
      src: 'photos/new_album7.png',
      info: 'A sprawling, chaotic, and beautiful gospel-rap masterpiece exploring themes of faith, fame, and family.',
      spotify: 'https://open.spotify.com/album/7gsWAHLeT0w7es6FofOXk1',
      apple: 'https://music.apple.com/us/album/the-life-of-pablo/112323188'
    },
    { 
      title: 'Graduation', 
      artist: 'Kanye West',   
      src: 'photos/new_album8.png',
      info: 'An electronic-infused hip-hop triumph that defined an era with its stadium anthems and futuristic production.',
      spotify: 'https://open.spotify.com/album/4SZko61aMnmgvNhvcgZWS4',
      apple: 'https://music.apple.com/us/album/graduation/1451901307'
    },
    { 
      title: 'My Beautiful Dark Twisted Fantasy', 
      artist: 'Kanye West',   
      src: 'photos/new_album9.png',
      info: 'A maximalist, sonically lush magnum opus dealing with excess, celebrity, and the American dream.',
      spotify: 'https://open.spotify.com/album/20r762YmB5HeofjMCiPMLv',
      apple: 'https://music.apple.com/us/album/my-beautiful-dark-twisted-fantasy/1441456603'
    },
    { 
      title: 'The Melodic Blue', 
      artist: 'Baby Keem',   
      src: 'photos/new_album10.png',
      info: 'A versatile and boundary-pushing album featuring innovative flows and eclectic beats from the rising rap star.',
      spotify: 'https://open.spotify.com/album/3AzzEygqhhlA4CVkZ6XieN',
      apple: 'https://music.apple.com/us/album/the-melodic-blue/1584667851'
    },
    { 
      title: 'ICEMAN', 
      artist: 'Drake',   
      src: 'photos/new_album11.png',
      info: 'A captivating new release that blends intricate storytelling with atmospheric production, showcasing evolution in sound.'
    },
    { 
      title: 'Views', 
      artist: 'Drake',   
      src: 'photos/new_album12.png',
      info: 'An iconic tribute to his hometown, fusing dancehall and R&B influences into a chart-topping masterpiece.'
    },
    { 
      title: 'More Life', 
      artist: 'Drake',   
      src: 'photos/new_album13.png',
      info: 'A curated playlist that seamlessly blends global sounds, featuring memorable collaborations and infectious rhythms.'
    },
    { 
      title: 'Take Care', 
      artist: 'Drake',   
      src: 'photos/new_album15.png',
      info: 'A classic opus filled with emotional depth, lush production, and defining moments in modern rap.'
    },
    { 
      title: 'Thank Me Later', 
      artist: 'Drake',   
      src: 'photos/new_album16.png',
      info: 'A confident debut showcasing introspective lyricism layered over polished, mood-driven production.'
    },
    { 
      title: 'Ved', 
      artist: 'Ritviz',   
      src: 'photos/new_album17.png',
      info: 'An experimental electronic blend with Indian classical vocals, presenting an infectious, upbeat energy.'
    },
    { 
      title: 'Astroworld', 
      artist: 'Travis Scott',   
      src: 'photos/new_album18.png',
      info: 'A psychedelic trap spectacle filled with dizzying beat switches, massive features, and immersive atmosphere.'
    },
    { 
      title: 'Rockstar', 
      artist: 'A.R. Rahman',   
      src: 'photos/new_album19.png',
      info: 'A monumental rock and Sufi fusion soundtrack defining the passionate journey of a troubled artist.'
    },
    { 
      title: 'Rang De Basanti', 
      artist: 'A.R. Rahman',   
      src: 'photos/new_album20.png',
      info: 'An anthem-heavy album blending traditional Indian melodies with contemporary sounds to evoke youthful rebellion.'
    },
    { 
      title: 'WE DON\'T TRUST YOU', 
      artist: 'Future & Metro Boomin',   
      src: 'photos/new_album21.png',
      info: 'A cinematic and hard-hitting collaborative masterpiece defining the modern trap sound with dark, booming production.'
    },
    { 
      title: 'IGOR', 
      artist: 'Tyler, the Creator',   
      src: 'photos/new_album22.png',
      info: 'A genre-defying, emotionally raw breakup album that masterfully blends soul, synth-pop, and hip-hop into a cohesive narrative.'
    },
    { 
      title: 'USB', 
      artist: 'Fred again..',   
      src: 'photos/new_album23.png',
      info: 'A dynamic and high-energy electronic album combining raw club anthems, infectious beats, and masterful sampling.'
    },
    { 
      title: 'Flower Boy', 
      artist: 'Tyler, the Creator',   
      src: 'photos/new_album24.png',
      info: 'A lush, introspective project featuring beautiful orchestration and themes of loneliness, identity, and growth.'
    },
    { 
      title: 'ye', 
      artist: 'Kanye West',   
      src: 'photos/new_album25.png',
      info: 'A brief, highly vulnerable, and personal album exploring mental health, family, and self-acceptance against the backdrop of Wyoming mountains.'
    },
    { 
      title: 'Actual Life 3 (January 1 - September 9 2022)', 
      artist: 'Fred again..',   
      src: 'photos/new_album26.png',
      info: 'An emotional electronic diary that turns personal struggles and candid audio clips into uplifting dance music.'
    },
    { 
      title: 'Scorpion', 
      artist: 'Drake',   
      src: 'photos/new_album27.png',
      info: 'A massive double album balancing rap bravado and R&B vulnerability, packed with record-breaking hits.'
    },
    { 
      title: 'Nayaab', 
      artist: 'Seedhe Maut',   
      src: 'photos/new_album28.png',
      info: 'A revolutionary project in the Indian hip-hop scene, celebrated for its raw lyricism, stellar production, and dynamic flows.'
    }
  ];

  const cards    = Array.from(stage.querySelectorAll('.album-card'));
  const POSITIONS = ['pos-left2', 'pos-left1', 'pos-center', 'pos-right1', 'pos-right2'];
  const N        = albums.length;
  let current    = 2; // index of center album
  let playing    = true;
  let autoTimer  = null;

  // Modal elements
  const modal = document.getElementById('albumModal');
  const modalBackdrop = document.getElementById('albumModalBackdrop');
  const modalClose = document.getElementById('albumModalClose');
  const amImg = document.getElementById('amImg');
  const amTitle = document.getElementById('amTitle');
  const amArtist = document.getElementById('amArtist');
  const amInfo = document.getElementById('amInfo');

  /* ── Apply positions ── */
  function render() {
    cards.forEach((card, i) => {
      card.classList.remove(...POSITIONS, 'pos-hidden');
      let offset = ((i - current) % N + N) % N;
      if (offset > N / 2) offset -= N;
      const posMap = { '-2': 'pos-left2', '-1': 'pos-left1', '0': 'pos-center', '1': 'pos-right1', '2': 'pos-right2' };
      const cls = posMap[offset] || 'pos-hidden';
      card.classList.add(cls);
    });

    const a = albums[current];
    if (aibArt)    { aibArt.style.opacity = 0; setTimeout(() => { aibArt.src = a.src; aibArt.style.opacity = 1; }, 200); }
    if (aibTitle)  { aibTitle.style.opacity = 0; setTimeout(() => { aibTitle.textContent = a.title; aibTitle.style.opacity = 1; }, 200); }
    if (aibArtist) { aibArtist.style.opacity = 0; setTimeout(() => { aibArtist.textContent = a.artist; aibArtist.style.opacity = 1; }, 200); }
    if (pbFill) { pbFill.style.animation = 'none'; void pbFill.offsetWidth; pbFill.style.animation = ''; }
  }

  /* ── Navigate ── */
  function goNext() { current = (current + 1) % N; render(); }
  function goPrev() { current = (current - 1 + N) % N; render(); }

  if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); resetAuto(); });

  /* ── Click on cards ── */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i !== current) { 
        current = i; render(); resetAuto(); 
      } else {
        // Open Modal if clicked on the center album
        openModal(albums[i]);
      }
    });
  });

  /* ── Modal Logic ── */
  function openModal(album) {
    if (!modal) return;
    amImg.src = album.src;
    amTitle.textContent = album.title;
    amArtist.textContent = album.artist;
    amInfo.textContent = album.info;
    modal.classList.add('active');
    clearInterval(autoTimer); // Pause carousel
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    resetAuto(); // Resume carousel
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  /* ── Play/Pause visual ── */
  if (pbPlay) {
    pbPlay.addEventListener('click', () => {
      playing = !playing;
      pbPlay.textContent = playing ? '⏸' : '▶';
      if (pbFill) pbFill.style.animationPlayState = playing ? 'running' : 'paused';
    });
  }

  /* ── Auto-rotate every 5s ── */
  function startAuto() {
    autoTimer = setInterval(goNext, 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    if (!modal?.classList.contains('active')) {
      startAuto();
    }
  }

  /* ── Keyboard ── */
  document.addEventListener('keydown', (e) => {
    if (modal?.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      return;
    }
    const vibes = document.getElementById('vibes');
    if (!vibes) return;
    const rect = vibes.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft')  { goPrev(); resetAuto(); }
    if (e.key === 'ArrowRight') { goNext(); resetAuto(); }
  });

  /* ── Touch swipe ── */
  let swipeX = 0;
  stage.addEventListener('touchstart', e => { swipeX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(d) > 40) { d < 0 ? goNext() : goPrev(); resetAuto(); }
  });

  /* ── Init ── */
  render();
  startAuto();
})();

/* ════════════════════════════════════════════════
   CONTACT FORM SUBMISSION (FORMSUBMIT API)
   ════════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btnText = contactForm.querySelector('.btn-text');
    const btnLoader = contactForm.querySelector('.btn-loader');
    const formSuccess = document.getElementById('formSuccess');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Show loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    
    try {
      // Send directly via FormSubmit AJAX API
      const response = await fetch("https://formsubmit.co/ajax/rohitchoudhari1501@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      });

      const result = await response.json();

      if (response.ok || result.success) {
        formSuccess.textContent = "✅ Message sent successfully! (If this is your first time, check your email to activate!)";
        formSuccess.style.color = "#1DB954";
        contactForm.reset();
      } else {
        formSuccess.textContent = "❌ Oops! Something went wrong.";
        formSuccess.style.color = "#fa243c";
      }
    } catch (error) {
      formSuccess.textContent = "❌ Network error. Please try again later.";
      formSuccess.style.color = "#fa243c";
    }
    
    // Reset button and show success message
    btnLoader.classList.add('hidden');
    btnText.classList.remove('hidden');
    formSuccess.classList.remove('hidden');
    
    // Hide success message after 8 seconds
    setTimeout(() => {
      formSuccess.classList.add('hidden');
    }, 8000);
  });
}

