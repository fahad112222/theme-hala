import BasePage from './base-page';
import MobileMenu from 'mmenu-light';

class Products extends BasePage {
    onReady() {
        this.productsList = app.element('salla-products-list');
        this.setSortFromUrl();
        this.initSortHandler();
        this.initMobileMenu();
        this.updatePageTitleOnFetch();
    }

    setSortFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('sort')) {
            app.element('#product-filter').value = urlParams.get('sort');
        }
    }

    initSortHandler() {
        app.on('change', '#product-filter', async event => {
            const value = event.currentTarget.value;
            window.history.replaceState(null, null, salla.helpers.addParamToUrl('sort', value));
            this.productsList.sortBy = value;
            await this.productsList.reload();
            this.productsList.setAttribute('filters', JSON.stringify({ sort: value }));
        });
    }

    updatePageTitleOnFetch() {
        salla.event.once('salla-products-list::products.fetched', res => {
            if (res.title) app.element('#page-main-title').innerHTML = res.title;
        });
    }

    initMobileMenu() {
        let filters = app.element("#filters-menu");
        const trigger = app.element("a[href='#filters-menu']");
        const close = app.element("button.close-filters");

        if (!filters) return;

        filters = new MobileMenu(filters, "(max-width: 1024px)");
        const drawer = filters.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

        if (trigger) app.onClick(trigger, event => {
            event.preventDefault();
            document.body.classList.add('filters-opened');
            drawer.open();
        });

        if (close) app.onClick(close, event => {
            event.preventDefault();
            document.body.classList.remove('filters-opened');
            drawer.close();
        });

        salla.event.on('salla-filters::changed', filters => {
            if (Object.entries(filters).length) {
                document.body.classList.remove('filters-opened');
                drawer.close();
            }
        });
    }
}

Products.initiateWhenReady([
    'product.index',
    'product.index.latest',
    'product.index.offers',
    'product.index.search',
    'product.index.tag',
]);
