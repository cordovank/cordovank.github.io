/**
* Template Name: SnapFolio
* Template URL: https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/
* Updated: Jul 21 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    if (headerToggleBtn) {
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    }
  }
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Top header mobile nav toggle (for .mobile-nav-toggle)
   */
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

  // Mobile nav open/close helpers and handlers
  let _outsideClickHandler = null;
  let _escKeyHandler = null;
  let _focusTrapHandler = null;
  let _lastFocusedEl = null;

  function openMobileNav() {
    document.body.classList.add('mobile-nav-active');
    if (mobileNavToggle) {
      mobileNavToggle.classList.remove('bi-list');
      mobileNavToggle.classList.add('bi-x');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('no-scroll');

    const menu = document.querySelector('.header-top .navmenu ul');
    // store last focused element so we can restore focus when closing
    try {
      _lastFocusedEl = document.activeElement;
    } catch (e) {
      _lastFocusedEl = null;
    }
    try {
      const btnRect = mobileNavToggle.getBoundingClientRect();
      if (menu) {
          // position menu to the left of the toggle and align the top edges
          const top = Math.max(8, Math.round(btnRect.top));
          menu.style.top = top + 'px';
          // set menu.right so its right edge sits slightly left of the button's left edge
          menu.style.right = (window.innerWidth - btnRect.left + 8) + 'px';
          // trigger animation on next frame
          requestAnimationFrame(() => menu.classList.add('open'));
      }
    } catch (err) {
      if (menu) menu.classList.add('open');
    }

    // Focus trap: keep Tab navigation inside the menu while open
    (function attachFocusTrap() {
      if (!menu) return;
      const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      // focus the first focusable element in the menu
      const focusable = Array.from(menu.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
      if (focusable.length) {
        focusable[0].focus();
      }

      _focusTrapHandler = function(e) {
        if (e.key !== 'Tab') return;
        const focusableEls = Array.from(menu.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
        if (!focusableEls.length) {
          e.preventDefault();
          return;
        }
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else { // Tab
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      };

      document.addEventListener('keydown', _focusTrapHandler);
    })();

    // outside click closes the menu
    _outsideClickHandler = function(e) {
      const menuEl = document.querySelector('.header-top .navmenu ul');
      if (!menuEl) return;
      if (menuEl.contains(e.target) || (mobileNavToggle && mobileNavToggle.contains(e.target))) return;
      closeMobileNav();
    };
    document.addEventListener('click', _outsideClickHandler);

    // Escape key closes the menu
    _escKeyHandler = function(e) {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
    };
    document.addEventListener('keydown', _escKeyHandler);
  }

  function closeMobileNav() {
    const menu = document.querySelector('.header-top .navmenu ul');
    if (menu) {
      // start closing animation
      menu.classList.remove('open');
    }
    if (mobileNavToggle) {
      mobileNavToggle.classList.remove('bi-x');
      mobileNavToggle.classList.add('bi-list');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
    }
    // wait for animation to finish before removing active class and clearing styles
    setTimeout(() => {
      document.body.classList.remove('mobile-nav-active');
      document.body.classList.remove('no-scroll');
      if (menu) {
        menu.style.top = '';
        menu.style.right = '';
      }
      if (_outsideClickHandler) {
        document.removeEventListener('click', _outsideClickHandler);
        _outsideClickHandler = null;
      }
      if (_escKeyHandler) {
        document.removeEventListener('keydown', _escKeyHandler);
        _escKeyHandler = null;
      }
      // remove focus trap and restore focus to the element that had it before opening
      if (_focusTrapHandler) {
        document.removeEventListener('keydown', _focusTrapHandler);
        _focusTrapHandler = null;
      }
      try {
        if (_lastFocusedEl && typeof _lastFocusedEl.focus === 'function') {
          _lastFocusedEl.focus();
        }
      } catch (e) {
        // ignore focus restore errors
      }
      _lastFocusedEl = null;
    }, 240); // match CSS transition duration
  }

  function mobileNavToogle() {
    if (document.body.classList.contains('mobile-nav-active')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', mobileNavToogle);
    mobileNavToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileNavToogle();
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links (MinimalFolio behavior)
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
    // Failsafe: remove preloader after 8s in case 'load' doesn't fire or JS execution is blocked elsewhere
    setTimeout(() => {
      if (document.getElementById('preloader')) {
        document.getElementById('preloader').remove();
        console.warn('Preloader removed by timeout fallback');
      }
    }, 8000);
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   * Exclude links marked .portfolio-lightbox so those are handled by the AJAX overlay.
   */
  const glightbox = GLightbox({
    selector: '.glightbox:not(.portfolio-lightbox)'
  });

  /**
   * AJAX portfolio detail overlay
   * Intercepts links with class "portfolio-lightbox", fetches their HTML, extracts the project
   * content, and displays it in an on-page overlay that matches site styles and animates smoothly.
   */
  function initPortfolioAjaxOverlay() {
    // create overlay element when needed
    function createOverlay() {
      if (document.getElementById('ajax-portfolio-overlay')) return document.getElementById('ajax-portfolio-overlay');
      const overlay = document.createElement('div');
      overlay.id = 'ajax-portfolio-overlay';
      overlay.innerHTML = `
        <div class="ajax-overlay-panel" role="dialog" aria-modal="true" aria-labelledby="ajax-overlay-title">
          <button class="ajax-overlay-close" aria-label="Close project details">&times;</button>
          <div class="ajax-overlay-body"></div>
        </div>
        <div id="ajax-portfolio-announcer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
      `;
      document.body.appendChild(overlay);
      // click outside to close
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
      });
      // close button
      overlay.querySelector('.ajax-overlay-close').addEventListener('click', closeOverlay);
      // ESC key (scoped handler so we can remove it later)
      overlay._escHandler = function(e) { if (e.key === 'Escape') closeOverlay(); };
      document.addEventListener('keydown', overlay._escHandler);
      // simple visually-hidden helper for announcer
      const style = document.createElement('style');
      style.innerHTML = '.visually-hidden{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;border:0;padding:0;margin:-1px}';
      document.head.appendChild(style);
      return overlay;
    }

    function openOverlay(htmlContent) {
      const overlay = createOverlay();
      const body = overlay.querySelector('.ajax-overlay-body');
      // inject content
      body.innerHTML = htmlContent;
      // set a sensible title for screen readers if present in content
      const titleEl = body.querySelector('h1, h2, h3');
      if (titleEl) titleEl.id = titleEl.id || 'ajax-overlay-title';
      // make links inside overlay open in new tab if they are external
      overlay.querySelectorAll('a').forEach(a => {
        try {
          const url = new URL(a.href, window.location.href);
          if (url.origin !== window.location.origin) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
          }
        } catch (err) {
          // ignore
        }
      });
      document.body.classList.add('no-scroll');
      // small delay for CSS transition
      requestAnimationFrame(() => overlay.classList.add('open'));
      // announce to screen readers
      const announcer = document.getElementById('ajax-portfolio-announcer');
      if (announcer) announcer.textContent = 'Project details opened';
      // attach focus trap for overlay
      attachOverlayFocusTrap(overlay);
      // focus for accessibility
      const firstFocusable = overlay.querySelector('button, a, [tabindex]');
      if (firstFocusable) firstFocusable.focus();
    }

    function attachOverlayFocusTrap(overlay) {
      const panel = overlay.querySelector('.ajax-overlay-panel');
      if (!panel) return;
      const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(panel.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
      const firstEl = focusable[0] || panel;
      const lastEl = focusable[focusable.length - 1] || panel;
      // save previously focused element
      overlay._prevFocus = document.activeElement;
      // trap handler
      overlay._trap = function(e) {
        if (e.key !== 'Tab') return;
        const els = Array.from(panel.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
        if (!els.length) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', overlay._trap);
    }

    function closeOverlay() {
      const overlay = document.getElementById('ajax-portfolio-overlay');
      if (!overlay) return;
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      // announce close
      const announcer = document.getElementById('ajax-portfolio-announcer');
      if (announcer) announcer.textContent = 'Project details closed';
      // remove trap and esc handler
      if (overlay._trap) {
        document.removeEventListener('keydown', overlay._trap);
        overlay._trap = null;
      }
      if (overlay._escHandler) {
        document.removeEventListener('keydown', overlay._escHandler);
        overlay._escHandler = null;
      }
      // restore focus
      setTimeout(() => {
        const body = overlay.querySelector('.ajax-overlay-body');
        if (body) body.innerHTML = '';
        try {
          if (overlay._prevFocus && typeof overlay._prevFocus.focus === 'function') overlay._prevFocus.focus();
        } catch (e) {}
      }, 300);
    }

    // Attach click handlers to portfolio detail links
    document.querySelectorAll('a.portfolio-lightbox').forEach(link => {
      // Ignore links that point to non-HTML (PDF etc.)
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href) return;
        // only handle same-origin .html files
        if (!href.endsWith('.html')) return;
        e.preventDefault();
        fetch(href, { cache: 'no-store' }).then(resp => {
          if (!resp.ok) throw new Error('Network response was not ok');
          return resp.text();
        }).then(text => {
          // parse the returned HTML and extract the main project content
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          // prefer the element with id "portfolio-details" or .portfolio-details, fall back to main
          const content = doc.querySelector('#portfolio-details') || doc.querySelector('.portfolio-details') || doc.querySelector('main') || doc.body;
          openOverlay(content ? content.innerHTML : '<p>Project details could not be loaded.</p>');
        }).catch(err => {
          // fallback: navigate directly
          window.location.href = href;
        });
      });
    });
  }

  // initialize after load so DOM is ready
  window.addEventListener('load', initPortfolioAjaxOverlay);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();