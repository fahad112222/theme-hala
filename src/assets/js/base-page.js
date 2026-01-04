class BasePage {
  constructor(config = {}) {
    this.config = config; // Optional, in case we need per-page configs
  }

  /**
   * Called once page is ready
   */
  onReady() {
    // Override in subclasses
  }

  /**
   * Register DOM events
   */
  registerEvents() {
    // Override in subclasses
  }

  /**
   * Initiates this page class if allowed
   * @param {null|string[]} allowedPages
   */
  initiate(allowedPages = null) {
    const currentPage = window.salla?.config?.get('page.slug') || null;

    if (allowedPages && (!currentPage || !allowedPages.includes(currentPage))) {
      console.log(`The Class For (${allowedPages.join(',')}) Skipped.`);
      return;
    }

    this.onReady();
    this.registerEvents();
    console.log(`The Class For (${allowedPages?.join(',') || '*'}) Loaded 🎉`);
  }
}

/**
 * Static helper to initiate page classes when theme is ready
 * @param {null|string[]} allowedPages
 */
BasePage.initiateWhenReady = function (allowedPages = null) {
  const tryInitiate = () => {
    if (window.app?.status === 'ready') {
      new this().initiate(allowedPages);
    } else {
      document.addEventListener('theme::ready', () => new this().initiate(allowedPages));
    }
  };

  tryInitiate();
};

export default BasePage;
