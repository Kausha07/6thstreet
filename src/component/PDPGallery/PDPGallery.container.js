import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPGallery from './PDPGallery.component';

export const mapStateToProps = (state) => ({
    currentIndex: state.PDP.imageIndex,
    isLoading: state.PDP.isLoading,
    product: state.PDP.product
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PDPGalleryContainer extends PureComponent {
    static propTypes = {
        currentIndex: PropTypes.number.isRequired,
        isLoading: PropTypes.bool.isRequired,
        product: Product.isRequired
    };

    containerFunctions = {
    };

    containerProps = () => {
        const { currentIndex } = this.props;

        return {
            gallery: this.getGallery(),
            crumbs: this.getCrumbs(),
            currentIndex
        };
    };

    getCrumbs() {
        // TODO: determine if has video append it here
        const galleryCrumbs = Object.keys(this.getGallery());
        return galleryCrumbs;
    }

    getGallery() {
        const {
            isLoading,
            product: {
                gallery_images = []
            }
        } = this.props;

        if (isLoading) {
            return Array.from({ length: 4 });
        }

        return gallery_images;
    }

    render() {
        return (
            <PDPGallery
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPGalleryContainer);
