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
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function () {
      document.body.classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
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
        <div class="ajax-overlay-panel" role="dialog" aria-modal="true">
          <button class="ajax-overlay-close" aria-label="Close project details">&times;</button>
          <div class="ajax-overlay-body"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      // click outside to close
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
      });
      // close button
      overlay.querySelector('.ajax-overlay-close').addEventListener('click', closeOverlay);
      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeOverlay();
      });
      return overlay;
    }

    function openOverlay(htmlContent) {
      const overlay = createOverlay();
      const body = overlay.querySelector('.ajax-overlay-body');
      // inject content
      body.innerHTML = htmlContent;
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
      // focus for accessibility
      const firstFocusable = overlay.querySelector('button, a, [tabindex]');
      if (firstFocusable) firstFocusable.focus();
    }

    function closeOverlay() {
      const overlay = document.getElementById('ajax-portfolio-overlay');
      if (!overlay) return;
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      // clear content after animation
      setTimeout(() => {
        const body = overlay.querySelector('.ajax-overlay-body');
        if (body) body.innerHTML = '';
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