import { showNotification } from 'Store/Notification/Notification.action';
import { setWishlistItems } from 'Store/Wishlist/Wishlist.action';
import MagentoAPI from 'Util/API/provider/MagentoAPI';
import { isSignedIn } from 'Util/Auth';

export class WishlistDispatcher {
    updateInitialWishlistData(dispatch) {
        // backwards compatibility
        this.syncWishlist(dispatch);
    }

    async syncWishlist(dispatch) {
        if (!isSignedIn()) {
            // skip non-authorized users
            dispatch(setWishlistItems([]));
            return;
        }

        try {
            const items = await MagentoAPI.get('wishlist/items');
            dispatch(setWishlistItems(items));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    }

    async removeSkuFromWishlist(id, dispatch) {
        if (!isSignedIn()) {
            // skip non-authorized users
            dispatch(showNotification(
                'info',
                __('You must be logged in to remove items to wishlist')
            ));

            return;
        }

        try {
            await MagentoAPI.delete(`/wishlist/delete/${ id }`);

            this.updateInitialWishlistData(dispatch);

            dispatch(showNotification('success', __('Product has been removed from your Wish List!')));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);

            dispatch(showNotification(
                'info',
                __('Failed to remove item from wishlist')
            ));
        }
    }

    async addSkuToWishlist(dispatch, sku) {
        if (!isSignedIn()) {
            // skip non-authorized users
            dispatch(showNotification(
                'info',
                __('You must be logged in to add items to wishlist')
            ));

            return;
        }

        try {
            await MagentoAPI.post(`/wishlist/add/${sku.replace(/\//g, '%2F')}`);

            this.updateInitialWishlistData(dispatch);

            dispatch(showNotification('success', __('Product added to wish-list!')));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);

            dispatch(showNotification(
                'info',
                __('Failed to add item to wishlist')
            ));
        }
    }
}

export default new WishlistDispatcher();
