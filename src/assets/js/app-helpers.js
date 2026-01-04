export default class AppHelpers {

  toggleClassIf(selector, classes1, classes2, callback) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => this.toggleElementClassIf(el, classes1, classes2, callback));
    return this;
  }

  toggleElementClassIf(elements, classes1, classes2, callback) {
    classes1 = Array.isArray(classes1) ? classes1 : classes1.split(' ');
    classes2 = Array.isArray(classes2) ? classes2 : classes2.split(' ');
    const elementsArray = Array.isArray(elements) || elements instanceof NodeList ? [...elements] : [elements];

    elementsArray.forEach(element => {
      if (!element) return;
      const useClasses1 = callback(element);
      element.classList.remove(...(useClasses1 ? classes2 : classes1));
      element.classList.add(...(useClasses1 ? classes1 : classes2));
    });

    return this;
  }

  element(selector) {
    if (selector instanceof HTMLElement) return selector;
    const nodeList = document.querySelectorAll(selector);
    return nodeList.length > 1 ? nodeList : nodeList[0];
  }

  watchElement(name, selector) {
    this[name] = this.element(selector);
    return this;
  }

  watchElements(elements) {
    Object.entries(elements).forEach(([name, selector]) => this.watchElement(name, selector));
    return this;
  }

  on(action, element, callback, options = {}) {
    if (element instanceof HTMLElement) {
      element.addEventListener(action, callback, options);
    } else {
      document.querySelectorAll(element).forEach(el => el.addEventListener(action, callback, options));
    }
    return this;
  }

  onClick(element, callback) {
    return this.on('click', element, callback);
  }

  onKeyUp(element, callback) {
    return this.on('keyup', element, callback);
  }

  all(element, callback) {
    document.querySelectorAll(element).forEach(callback);
    return this;
  }

  hideElement(element) {
    const el = this.element(element);
    if (el instanceof NodeList || Array.isArray(el)) {
      el.forEach(e => (e.style.display = 'none'));
    } else if (el) {
      el.style.display = 'none';
    }
    return this;
  }

  showElement(element, display = 'block') {
    const el = this.element(element);
    if (el instanceof NodeList || Array.isArray(el)) {
      el.forEach(e => (e.style.display = display));
    } else if (el) {
      el.style.display = display;
    }
    return this;
  }

  removeClass(element, ...classes) {
    const el = this.element(element);
    if (!el) return this;
    if (el instanceof NodeList || Array.isArray(el)) {
      el.forEach(e => e.classList.remove(...classes));
    } else {
      el.classList.remove(...classes);
    }
    return this;
  }

  addClass(element, ...classes) {
    const el = this.element(element);
    if (!el) return this;
    if (el instanceof NodeList || Array.isArray(el)) {
      el.forEach(e => e.classList.add(...classes));
    } else {
      el.classList.add(...classes);
    }
    return this;
  }
}
