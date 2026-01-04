import BasePage from './base-page';

class Order extends BasePage {
    onReady() {
        this.initReorderButton();
        this.initCancelOrderButton();
    }

    /**
     * Reorder previous order
     */
    initReorderButton() {
        const reorderBtn = document.querySelector('salla-button#btn-reorder');
        if (!reorderBtn) return;

        app.onClick(reorderBtn, async ({ currentTarget: btn }) => {
            try {
                await btn.load();
                await salla.order.createCartFromOrder();
            } catch (err) {
                console.error('Reorder failed:', err);
            } finally {
                btn.stop();
                const reorderModal = document.querySelector('#reorder-modal');
                reorderModal?.classList.add('hidden');
            }
        });
    }

    /**
     * Cancel an order
     */
    initCancelOrderButton() {
        const cancelBtn = document.querySelector('salla-button#confirm-cancel');
        if (!cancelBtn) return;

        app.onClick(cancelBtn, async ({ currentTarget: btn }) => {
            try {
                await btn.load();
                await salla.order.cancel();
            } catch (err) {
                console.error('Cancel order failed:', err);
            } finally {
                btn.stop();
                const cancelModal = document.querySelector('#modal-order-cancel');
                cancelModal?.classList.add('hidden');
                window.location.reload();
            }
        });
    }
}

Order.initiateWhenReady(['customer.orders.single']);
