/**
 * 🎀 Beauty Theme - Home Page
 * Salla-compatible with beauty theme enhancements
 */

import "lite-youtube-embed";
import BasePage from "./base-page";
import Lightbox from "fslightbox";
window.fslightbox = Lightbox;

class Home extends BasePage {
    onReady() {
        this.initFeaturedTabs();
        this.initBeautyHomeFeatures();
        this.initBeautyHeroSlider();
        this.initBeautyTestimonials();
    }

    registerEvents() {
        // Add beauty theme classes once theme is ready
        document.addEventListener('theme::ready', () => {
            this.addBeautyThemeClasses();
        });
    }

    // Adds beauty classes to page elements
    addBeautyThemeClasses() {
        app.all('.home-container, #home-page', el => el.classList.add('beauty-home'));
        app.all('.hero-section, .s-hero', el => el.classList.add('beauty-hero'));
        app.all('.product-card, .s-product-card', el => el.classList.add('beauty-product-card'));
        app.all('.feature-card, .benefit-card', el => el.classList.add('beauty-feature-card'));
        app.all('.home-btn, .hero-btn', el => !el.classList.contains('s-button') && el.classList.add('beauty-btn'));

        const hour = new Date().getHours();
        document.body.classList.add(hour >= 18 || hour < 6 ? 'beauty-night-mode' : 'beauty-day-mode');
    }

    // Initialize home page features
    initBeautyHomeFeatures() {
        this.initBeautyCategoryFilters();
        this.initBeautyProductPreviews();
        this.initBeautyVideoBackgrounds();
        this.initBeautyNewsletterModal();
    }

    // Category filter buttons
    initBeautyCategoryFilters() {
        const filterButtons = document.querySelectorAll('.beauty-category-filter');
        if (!filterButtons.length) return;

        filterButtons.forEach(button => {
            app.onClick(button, e => {
                e.preventDefault();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active', 'beauty-pulse');
                setTimeout(() => button.classList.remove('beauty-pulse'), 600);

                const category = button.dataset.category;
                this.filterProductsByCategory(category);
            });
        });
    }

    filterProductsByCategory(category) {
        const cards = document.querySelectorAll('.beauty-product-card');
        if (!cards.length) return;

        cards.forEach(card => {
            const match = category === 'all' || card.dataset.category === category;
            app.toggleClassIf(card, ['hidden', 'beauty-fade-in'], [], () => !match);
        });
    }

    // Product hover effects
    initBeautyProductPreviews() {
        const cards = document.querySelectorAll('.beauty-product-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('beauty-hover');
                const quickView = card.querySelector('.beauty-quick-view');
                if (quickView) quickView.classList.add('visible');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('beauty-hover');
                const quickView = card.querySelector('.beauty-quick-view');
                if (quickView) quickView.classList.remove('visible');
            });

            const quickViewBtn = card.querySelector('.beauty-quick-view');
            if (quickViewBtn) {
                app.onClick(quickViewBtn, e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showQuickView(card.dataset.productId);
                });
            }
        });
    }

    showQuickView(productId) {
        salla.notify.info(salla.lang.get('pages.products.quick_view_coming_soon'));
    }

    // Hero slider
    initBeautyHeroSlider() {
        app.all('.beauty-hero-slider', slider => this.initSlider(slider));
    }

    initSlider(container) {
        const slides = container.querySelectorAll('.beauty-slide');
        const prevBtn = container.querySelector('.beauty-slider-prev');
        const nextBtn = container.querySelector('.beauty-slider-next');
        const dots = container.querySelectorAll('.beauty-slider-dot');
        if (!slides.length) return;

        let current = 0;
        const show = i => {
            slides.forEach(slide => slide.classList.add('hidden'));
            slides[i].classList.remove('hidden', 'active');
            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
            current = i;
        };

        if (nextBtn) app.onClick(nextBtn, () => show((current + 1) % slides.length));
        if (prevBtn) app.onClick(prevBtn, () => show((current - 1 + slides.length) % slides.length));
        dots.forEach((dot, idx) => app.onClick(dot, () => show(idx)));

        if (container.dataset.autoAdvance === 'true') {
            setInterval(() => show((current + 1) % slides.length), 5000);
        }

        show(0);
    }

    // Testimonials
    initBeautyTestimonials() {
        app.all('.beauty-testimonial-slider', slider => this.initTestimonialSlider(slider));
        app.all('.beauty-testimonial-card', card => {
            card.addEventListener('mouseenter', () => card.classList.add('beauty-hover'));
            card.addEventListener('mouseleave', () => card.classList.remove('beauty-hover'));
        });
    }

    initTestimonialSlider(container) {
        const testimonials = container.querySelectorAll('.beauty-testimonial');
        const prev = container.querySelector('.beauty-testimonial-prev');
        const next = container.querySelector('.beauty-testimonial-next');
        if (!testimonials.length) return;

        let current = 0;
        const show = i => {
            testimonials.forEach(t => t.classList.add('hidden'));
            testimonials[i].classList.remove('hidden', 'active');
            current = i;
        };

        if (next) app.onClick(next, () => show((current + 1) % testimonials.length));
        if (prev) app.onClick(prev, () => show((current - 1 + testimonials.length) % testimonials.length));

        show(0);
    }

    // Video backgrounds
    initBeautyVideoBackgrounds() {
        const sections = document.querySelectorAll('.beauty-video-background');
        sections.forEach(section => {
            const video = section.querySelector('video');
            if (!video) return;

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => entry.isIntersecting ? video.play().catch(()=>{}) : video.pause());
            }, { threshold: 0.5 });
            observer.observe(section);

            const muteBtn = section.querySelector('.beauty-video-mute');
            if (muteBtn) {
                app.onClick(muteBtn, () => {
                    video.muted = !video.muted;
                    muteBtn.classList.toggle('muted', video.muted);
                });
            }
        });
    }

    // Newsletter modal
    initBeautyNewsletterModal() {
        const modal = document.querySelector('#beauty-newsletter-modal');
        if (!modal) return;

        if (!localStorage.getItem('beauty_newsletter_seen')) {
            setTimeout(() => {
                modal.classList.remove('hidden');
                modal.classList.add('beauty-fade-in');
                localStorage.setItem('beauty_newsletter_seen', 'true');
            }, 3000);
        }

        const closeBtn = modal.querySelector('.beauty-modal-close');
        if (closeBtn) app.onClick(closeBtn, () => modal.classList.add('hidden'));

        const form = modal.querySelector('#beauty-newsletter-form');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const input = form.querySelector('input[type="email"]');
                if (!input.value) return input.classList.add('beauty-error');
                salla.notify.success(salla.lang.get('pages.home.newsletter_subscribed'));
                modal.classList.add('hidden');
            });
        }
    }

    // Featured tabs
    initFeaturedTabs() {
        app.all('.tab-trigger', btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.componentId;
                btn.classList.add('beauty-pulse');
                setTimeout(() => btn.classList.remove('beauty-pulse'), 300);

                app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'is-active opacity-0 translate-y-3', 'inactive', tab => tab.id === btn.dataset.target)
                    .toggleClassIf(`#${id} .tab-trigger`, 'is-active', 'inactive', tabBtn => tabBtn === btn);

                setTimeout(() => {
                    app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'opacity-100 translate-y-0', 'opacity-0 translate-y-3', tab => tab.id === btn.dataset.target);
                    const activeTab = document.querySelector(`#${btn.dataset.target}`);
                    if (activeTab) activeTab.classList.add('beauty-fade-in');
                }, 100);
            });
        });

        app.all('.s-block-tabs', block => block.classList.add('tabs-initialized', 'beauty-tabs'));
        app.all('.tab-trigger', tab => tab.classList.add('beauty-tab-trigger'));
    }
}

// Initiate only on home page
Home.initiateWhenReady(['index']);
