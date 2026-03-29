// ─── INGENI — GSAP Animations ───────────────────────────────────────
// Requires: GSAP 3 + ScrollTrigger + SplitText (or manual splits)

gsap.registerPlugin(ScrollTrigger);

// ─── Utility: split text into chars/words ───────────────────────────
function splitIntoChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    return [...text].map(ch => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        if (ch === ' ') span.style.width = '0.3em';
        return el.appendChild(span);
    });
}

function splitIntoWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = '';
    return words.map((w, i) => {
        const span = document.createElement('span');
        span.textContent = w;
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        if (i < words.length - 1) {
            const sp = document.createElement('span');
            sp.innerHTML = '&nbsp;';
            sp.style.display = 'inline-block';
            el.appendChild(span);
            el.appendChild(sp);
        } else {
            el.appendChild(span);
        }
        return span;
    });
}

// ─── 1. PAGE REVEAL — Mirror animation ──────────────────────────────
function initPageReveal() {
    const overlay = document.getElementById('page-reveal');
    if (!overlay) return;

    const leftLetters = overlay.querySelectorAll('.reveal-left .reveal-char');
    const rightLetters = overlay.querySelectorAll('.reveal-right .reveal-char');
    const tl = gsap.timeline({
        onComplete: () => {
            overlay.style.pointerEvents = 'none';
            document.body.classList.remove('reveal-active');
            // Start entrance animations
            initEntranceAnimations();
        }
    });

    document.body.classList.add('reveal-active');

    // Letters start mirrored (IN reversed = NI), then assemble
    tl.set(leftLetters, { opacity: 0, y: 40, rotateY: 180 })
      .set(rightLetters, { opacity: 0, y: 40, rotateY: -180 })

      // Left side (IN) assembles from mirrored state
      .to(leftLetters, {
          opacity: 1, y: 0, rotateY: 0,
          duration: 0.9, stagger: 0.08, ease: 'power3.out'
      }, 0.4)

      // Right side (NI) — starts mirrored, flips into place
      .to(rightLetters, {
          opacity: 1, y: 0, rotateY: 0,
          duration: 0.9, stagger: 0.08, ease: 'power3.out'
      }, 0.5)

      // Hold
      .to({}, { duration: 0.6 })

      // Line + letters merge up
      .to([leftLetters, rightLetters], {
          y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: 'power2.in'
      })

      // Overlay slides away
      .to(overlay, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8, ease: 'power3.inOut'
      }, '-=0.2');
}

// ─── 2. NAV ─────────────────────────────────────────────────────────
function initNavAnimations() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    gsap.from(nav, {
        y: -100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2
    });

    // Scroll hide/show
    let lastScroll = 0;
    ScrollTrigger.create({
        start: 'top -100',
        onUpdate: self => {
            const dir = self.direction;
            if (dir === 1 && self.scroll() > 200) {
                gsap.to(nav, { y: -120, duration: 0.4, ease: 'power2.in' });
            } else {
                gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' });
            }
        }
    });
}

// ─── 3. HERO entrance ───────────────────────────────────────────────
function initEntranceAnimations() {
    initNavAnimations();

    const heroTitle = document.querySelector('.hero-title');
    const tl = gsap.timeline({ delay: 0.1 });

    if (heroTitle) {
        const textToSplit = heroTitle.textContent;
        heroTitle.innerHTML = '';
        const chars = [...textToSplit.trim()].map(ch => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, opacity';
            if (ch === ' ') span.style.width = '0.3em';
            heroTitle.appendChild(span);
            return span;
        });

        tl.from(chars, {
            y: 120, opacity: 0, rotateX: -60,
            duration: 1.2, stagger: 0.05, ease: 'power3.out'
        }, 0.2);
    }
}

// ─── 4. SCROLL-TRIGGERED — Section reveals ──────────────────────────
function initScrollAnimations() {
    // Decorative lines that draw on scroll
    document.querySelectorAll('.draw-line').forEach(line => {
        gsap.from(line, {
            scaleX: 0,
            scrollTrigger: {
                trigger: line,
                start: 'top 85%',
                end: 'top 40%',
                scrub: 1
            },
            ease: 'none'
        });
    });

    // Section headings — slide from left with line
    document.querySelectorAll('.section-heading').forEach(heading => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
        const line = heading.querySelector('.heading-line');
        const text = heading.querySelector('.heading-text');
        const sub = heading.querySelector('.heading-sub');

        if (line) tl.from(line, { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, 0);
        if (text) tl.from(text, { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2);
        if (sub) tl.from(sub, { x: -40, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.4);
    });

    // Studio section — parallel reveal
    const studioText = document.querySelector('.studio-text');
    const studioImg = document.querySelector('.studio-img');
    if (studioText) {
        gsap.from(studioText, {
            x: -80, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: studioText, start: 'top 75%' }
        });
    }
    if (studioImg) {
        gsap.from(studioImg, {
            x: 80, opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: studioImg, start: 'top 75%' }
        });
    }

    // Large floating numbers parallax
    document.querySelectorAll('.parallax-number').forEach(num => {
        gsap.to(num, {
            y: -120,
            scrollTrigger: {
                trigger: num.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    });

    // ─── Services accordion items ───────────────────────────────────
    document.querySelectorAll('.service-item').forEach((item, i) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        const num = item.querySelector('.service-num');
        const title = item.querySelector('.service-title');
        const line = item.querySelector('.service-line');
        const desc = item.querySelector('.service-desc');

        tl.from(line || item, { scaleX: 0, duration: 0.6, ease: 'power3.inOut' }, 0);
        if (num) tl.from(num, { x: -40, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.15);
        if (title) tl.from(title, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.25);
        if (desc) tl.from(desc, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.4);
    });

    // ─── Projects cards ─────────────────────────────────────────────
    document.querySelectorAll('.project-card').forEach((card, i) => {
        gsap.from(card, {
            y: 60, opacity: 0, scale: 0.96,
            duration: 0.8, ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Image parallax inside card
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                y: -30,
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    });

    // ─── CTA Section ────────────────────────────────────────────────
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const ctaHeading = ctaSection.querySelector('h2');
        const ctaBtn = ctaSection.querySelector('button, a.cta-btn');
        const ctaLine = ctaSection.querySelector('.cta-line');
        const ctaLabel = ctaSection.querySelector('.cta-label');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });

        if (ctaLine) tl.from(ctaLine, { scaleX: 0, duration: 1, ease: 'power3.inOut' }, 0);
        if (ctaLabel) tl.from(ctaLabel, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.2);
        if (ctaHeading) tl.from(ctaHeading, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.3);
        if (ctaBtn) tl.from(ctaBtn, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.6);
    }

    // ─── Footer ─────────────────────────────────────────────────────
    const footer = document.querySelector('.site-footer');
    if (footer) {
        gsap.from(footer.children, {
            y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: footer, start: 'top 85%' }
        });
    }
}

// ─── 5. SERVICE ACCORDION INTERACTION ───────────────────────────────
function initServiceAccordion() {
    const items = document.querySelectorAll('.service-item');
    const images = document.querySelectorAll('.service-bg-img');

    items.forEach((item, index) => {
        const expandable = item.querySelector('.service-expandable');
        const arrow = item.querySelector('.service-arrow');

        item.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Close all
            items.forEach((it, j) => {
                it.classList.remove('is-open');
                const exp = it.querySelector('.service-expandable');
                const arr = it.querySelector('.service-arrow');
                if (exp) gsap.to(exp, { height: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut' });
                if (arr) gsap.to(arr, { rotate: 0, duration: 0.3 });
                // Fade out image
                if (images[j]) gsap.to(images[j], { opacity: 0, scale: 1.05, duration: 0.6 });
            });

            if (!isOpen) {
                item.classList.add('is-open');
                if (expandable) {
                    gsap.to(expandable, {
                        height: 'auto', opacity: 1, duration: 0.6, ease: 'power3.inOut'
                    });
                }
                if (arrow) gsap.to(arrow, { rotate: 45, duration: 0.3 });
                // Show corresponding image
                if (images[index]) {
                    gsap.to(images[index], { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
                }
            }
        });
    });

    // Open first by default
    if (items[0]) items[0].click();
}

// ─── 6. SMOOTH MAGNETIC CURSOR ON BUTTONS ───────────────────────────
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

// ─── 7. HORIZONTAL MARQUEE ──────────────────────────────────────────
function initMarquee() {
    const marquee = document.querySelector('.marquee-track');
    if (!marquee) return;

    // Clone for seamless loop
    marquee.innerHTML += marquee.innerHTML;

    gsap.to(marquee, {
        xPercent: -50,
        duration: 30,
        ease: 'none',
        repeat: -1
    });
}

// ─── INIT ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initPageReveal();
    initScrollAnimations();
    initServiceAccordion();
    initMagneticButtons();
    initMarquee();
    document.getElementById('current-year').textContent = new Date().getFullYear();
});
