import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setPDPGaleryImage } from 'Store/PDP/PDP.action';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPGallery from './PDPGalleryOverlay.component';

export const mapStateToProps = (state) => ({
    currentIndex: state.PDP.imageIndex,
    isLoading: state.PDP.isLoading,
    product: state.PDP.product
});

export const mapDispatchToProps = (_dispatch) => ({
    setImageIndex: (index) => _dispatch(setPDPGaleryImage(index))
});

export class PDPGalleryOverlayContainer extends PureComponent {
    static propTypes = {
        currentIndex: PropTypes.number.isRequired,
        isLoading: PropTypes.bool.isRequired,
        product: Product.isRequired,
        setImageIndex: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        closeGalleryOverlay: PropTypes.func.isRequired
    };

    containerFunctions = {
        onSliderChange: this.onSliderChange.bind(this)
    };

    containerProps = () => {
        const { currentIndex, closeGalleryOverlay } = this.props;

        return {
            gallery: this.getGallery(),
            crumbs: this.getCrumbs(),
            currentIndex,
            closeGalleryOverlay
        };
    };

    onSliderChange(activeSlide) {
        const { setImageIndex } = this.props;

        return setImageIndex(activeSlide);
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(PDPGalleryOverlayContainer);
