import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import { zoom } from './partials/image-zoom';

class Product extends BasePage {
    onReady() {
        app.watchElements({
            totalPrice: '.total-price',
            productWeight: '.product-weight',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',
        });

        this.initProductOptionValidations();
        this.initImagesZooming();
        window.addEventListener('resize', () => this.initImagesZooming());
    }

    initProductOptionValidations() {
        document.querySelector('.product-form')?.addEventListener('change', function() {
            if (this.reportValidity()) salla.product.getPrice(new FormData(this));
        });
    }

    initImagesZooming() {
        const activeSlide = document.querySelector('.image-slider .swiper-slide-active');
        if (!activeSlide || window.innerWidth < 1024 || activeSlide.querySelector('.img-magnifier-glass')) return;

        setTimeout(() => {
            const image = activeSlide.querySelector('img');
            if (image) zoom(image.id, 2);
        }, 250);

        const slider = document.querySelector('salla-slider.details-slider');
        slider?.addEventListener('slideChange', () => {
            setTimeout(() => {
                const slide = document.querySelector('.image-slider .swiper-slide-active');
                if (!slide || window.innerWidth < 1024 || slide.querySelector('.img-magnifier-glass')) return;
                const image = slide.querySelector('img');
                if (image) zoom(image.id, 2);
            }, 250);
        });
    }

    registerEvents() {
        // Price update failed
        salla.event.on('product::price.updated.failed', () => {
            app.element('.price-wrapper')?.classList.add('hidden');
            app.element('.out-of-stock')?.classList.remove('hidden');
            app.anime('.out-of-stock', { scale: [0.88, 1] });
        });

        // Price updated
        salla.product.event.onPriceUpdated(res => {
            const data = res.data;
            const isOnSale = data.has_sale_price && data.regular_price > data.price;

            app.element('.out-of-stock')?.classList.add('hidden');
            app.element('.price-wrapper')?.classList.remove('hidden');

            app.startingPriceTitle?.classList.add('hidden');
            app.productWeight.forEach(el => el.innerHTML = data.weight || '');
            app.totalPrice.forEach(el => el.innerHTML = salla.money(data.price));
            app.beforePrice.forEach(el => el.innerHTML = salla.money(data.regular_price));

            app.toggleClassIf('.price_is_on_sale','showed','hidden', ()=> isOnSale);
            app.toggleClassIf('.starting-or-normal-price','hidden','showed', ()=> isOnSale);

            app.anime('.total-price, .product-weight', { scale: [0.88, 1] });
        });

        // Show more button
        app.onClick('#btn-show-more', e => {
            app.all('#more-content', div => {
                e.target.classList.add('is-expanded');
                div.style.maxHeight = div.scrollHeight + 'px';
            });
            e.target.remove();
        });
    }
}

Product.initiateWhenReady(['product.single']);
