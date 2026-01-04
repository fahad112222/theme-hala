import BasePage from './base-page';

class Brands extends BasePage {
    onReady() {
        this.setNavHeight();
        this.initNavItems();
        this.initStickyNav();
    }

    setNavHeight() {
        const nav = document.querySelector('#brands-nav');
        const navWrap = document.querySelector('.brands-nav-wrap');
        if (nav && navWrap) navWrap.style.height = nav.clientHeight + 'px';
    }

    initNavItems() {
        app.onClick('.brands-nav__item', ({ target: btn }) => {
            app.all('.brands-nav__item', el => app.toggleElementClassIf(el, 'is-selected', 'unselected', () => el === btn));
        });
    }

    initStickyNav() {
        window.addEventListener('scroll', () => {
            const scrolledTop = window.pageYOffset <= 200;
            app.toggleClassIf('#brands-nav', 'is-not-sticky', 'is-sticky', () => scrolledTop);
        });
    }
}

Brands.initiateWhenReady(['brands.index']);
