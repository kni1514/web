

(function () {
  'use strict';

  
  const DOM = {
    loader: document.getElementById('loader'),
    scrollProgress: document.getElementById('scrollProgress'),
    header: document.getElementById('header'),
    themeToggle: document.getElementById('themeToggle'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    backToTop: document.getElementById('backToTop'),
    toast: document.getElementById('toast'),
    particles: document.getElementById('particles'),
  };

  
  const Theme = {
    STORAGE_KEY: 'do_it-theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.set(theme);

      DOM.themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        this.set(current === 'dark' ? 'light' : 'dark');
      });
    },

    set(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
    },
  };

  
  const Loader = {
    init() {
      const hide = () => {
        setTimeout(() => {
          DOM.loader?.classList.add('hidden');
          document.body.classList.add('loaded');
        }, 500);
      };
      if (document.readyState === 'complete') {
        hide();
      } else {
        window.addEventListener('load', hide);
        setTimeout(hide, 4000);
      }
    },
  };

  
  const Particles = {
    init() {
      const canvas = DOM.particles;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

      let width, height, particles = [];
      const mouse = { x: null, y: null };

      const colors = ['#10b981', '#06b6d4', '#8b5cf6'];

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }

      function createParticles() {
        const count = Math.min(Math.floor(width * height / 14000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.15,
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / 140) * 0.25;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', () => {
        resize();
        createParticles();
      });

      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      resize();
      createParticles();
      draw();
    },
  };

  
  const Scroll = {
    init() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();
    },

    onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (DOM.scrollProgress) {
        DOM.scrollProgress.style.width = `${progress}%`;
      }

      DOM.header?.classList.toggle('scrolled', scrollTop > 50);
      DOM.backToTop?.classList.toggle('visible', scrollTop > 400);
    },
  };

  
  const Navigation = {
    init() {
      DOM.navToggle?.addEventListener('click', () => this.toggle());
      DOM.navMenu?.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => this.close());
      });
    },

    toggle() {
      const isOpen = DOM.navMenu?.classList.toggle('open');
      DOM.navToggle?.classList.toggle('active', isOpen);
      DOM.navToggle?.setAttribute('aria-expanded', String(isOpen));
    },

    close() {
      DOM.navMenu?.classList.remove('open');
      DOM.navToggle?.classList.remove('active');
      DOM.navToggle?.setAttribute('aria-expanded', 'false');
    },
  };

  
  const BackToTop = {
    init() {
      DOM.backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
  };

  
  const Reveal = {
    init() {
      const elements = document.querySelectorAll('.reveal');
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => observer.observe(el));
    },
  };

  
  const Ripple = {
    init() {
      document.querySelectorAll('.ripple').forEach((el) => {
        el.addEventListener('click', (e) => this.create(e, el));
      });
    },

    create(event, element) {
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      element.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    },
  };

  
  const InstallTabs = {
    init() {
      const buttons = document.querySelectorAll('.install-tabs__btn');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => this.switch(btn));
      });
    },

    switch(activeBtn) {
      const tabId = activeBtn.dataset.tab;

      document.querySelectorAll('.install-tabs__btn').forEach((btn) => {
        const isActive = btn === activeBtn;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      document.querySelectorAll('.install-tabs__panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
      });
    },
  };

  
  const Clipboard = {
    init() {
      document.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.copy(btn.dataset.copy, btn);
        });
      });
    },

    async copy(text, button) {
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.classList.add('copied');
        button.textContent = 'Copied!';
        Toast.show('Copied to clipboard');

        setTimeout(() => {
          button.classList.remove('copied');
          button.textContent = original;
        }, 2000);
      } catch {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          button.classList.add('copied');
          button.textContent = 'Copied!';
          Toast.show('Copied to clipboard');
          setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = original;
          }, 2000);
        } catch {
          Toast.show('Failed to copy');
        }
      }
    },
  };

  
  const Toast = {
    timeout: null,

    show(message) {
      if (!DOM.toast) return;
      DOM.toast.textContent = message;
      DOM.toast.classList.add('show');
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        DOM.toast.classList.remove('show');
      }, 2500);
    },
  };

  
  const Counters = {
    init() {
      const counters = document.querySelectorAll('.stat-card__number[data-target]');
      if (!counters.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((counter) => observer.observe(counter));
    },

    animate(element) {
      const target = parseInt(element.dataset.target, 10);
      const suffix = element.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        element.textContent = `${current.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = `${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    },
  };

  
  const TerminalTyper = {
    init() {
      const output = document.getElementById('terminalOutput');
      if (!output) return;
      const lines = [
        { text: 'list files in this project', cls: 'request' },
        { text: '✓ Local bridge ready', cls: 'ok' },
        { text: '✓ ChatGPT reply received', cls: 'ok' },
        { text: '✓ list_dir', cls: 'ok' },
        { text: 'do_it/', cls: 'dim' },
        { text: '├── agent/', cls: 'dim' },
        { text: '├── ext/', cls: 'dim' },
        { text: '└── server/', cls: 'dim' },
        { text: '', cls: '' },
        { text: 'Ready for your next request', cls: 'dim' },
      ];

      let lineIndex = 0;
      let charIndex = 0;
      let typing = true;

      const cursor = document.createElement('span');
      cursor.className = 'terminal__cursor';
      output.appendChild(cursor);
      const staticLine = document.createElement('div');
      staticLine.className = 'terminal__line';
      staticLine.innerHTML = '<span class="prompt">niranjan@do_it</span><span class="dim">:~$ </span><span class="cmd">python do_it.py</span>';
      output.insertBefore(staticLine, cursor);

      const type = () => {
        if (!typing) return;

        if (lineIndex < lines.length) {
          const line = lines[lineIndex];

          if (line.text === '') {
            const empty = document.createElement('div');
            empty.className = 'terminal__line';
            empty.innerHTML = '&nbsp;';
            output.insertBefore(empty, cursor);
            lineIndex++;
            setTimeout(type, 250);
            return;
          }
          let lineDiv = output.querySelector(`[data-line-index="${lineIndex}"]`);
          if (!lineDiv) {
            lineDiv = document.createElement('div');
            lineDiv.className = 'terminal__line';
            lineDiv.dataset.lineIndex = lineIndex;
            output.insertBefore(lineDiv, cursor);
          }

          const text = line.text;
          if (charIndex === 0) {
            lineDiv.innerHTML = '';
          }
          let content = '';
          const remaining = text.slice(0, charIndex + 1);
          if (line.cls === 'cmd') {
            content = `<span class="prompt">niranjan@do_it</span><span class="dim">:~$ </span>${escapeHtml(remaining)}`;
          } else if (line.cls === 'request') {
            content = `<span class="prompt">◆ do_it &gt; </span>${escapeHtml(remaining)}`;
          } else if (line.cls === 'ok') {
            content = escapeHtml(remaining);
          } else if (line.cls === 'err') {
            content = escapeHtml(remaining);
          } else if (line.cls === 'dim') {
            content = escapeHtml(remaining);
          } else {
            content = escapeHtml(remaining);
          }

          lineDiv.innerHTML = content;
          charIndex++;

          const delay = line.cls === 'cmd' ? 55 : 22;
          if (charIndex <= text.length) {
            setTimeout(type, delay);
          } else {
            charIndex = 0;
            lineIndex++;
            setTimeout(type, 350);
          }
        } else {
          typing = false;
          setTimeout(() => {
            output.querySelectorAll('[data-line-index]').forEach((el) => el.remove());
            lineIndex = 0;
            charIndex = 0;
            typing = true;
            type();
          }, 8000);
        }
      };

      type();
    },
  };

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  
  const FeatureGlow = {
    init() {
      document.querySelectorAll('.feature-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
      });
    },
  };

  
  const DocsSidebar = {
    init() {
      const sidebarLinks = document.querySelectorAll('.docs-sidebar nav a');
      const headings = document.querySelectorAll('.docs-content .docs-section');
      if (!sidebarLinks.length || !headings.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              sidebarLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
              });
            }
          });
        },
        { threshold: 0.2, rootMargin: '-100px 0px -70% 0px' }
      );

      headings.forEach((section) => observer.observe(section));
    },
  };

  
  function init() {
    Theme.init();
    Loader.init();
    Particles.init();
    Scroll.init();
    Navigation.init();
    BackToTop.init();
    Reveal.init();
    Ripple.init();
    InstallTabs.init();
    Clipboard.init();
    Counters.init();
    TerminalTyper.init();
    FeatureGlow.init();
    DocsSidebar.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

