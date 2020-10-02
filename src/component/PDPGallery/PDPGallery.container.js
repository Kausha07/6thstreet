import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setPDPGaleryImage } from 'Store/PDP/PDP.action';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPGallery from './PDPGallery.component';

export const mapStateToProps = (state) => ({
    currentIndex: state.PDP.imageIndex,
    isLoading: state.PDP.isLoading,
    product: state.PDP.product
});

export const mapDispatchToProps = (_dispatch) => ({
    setImageIndex: (index) => _dispatch(setPDPGaleryImage(index))
});

export class PDPGalleryContainer extends PureComponent {
    static propTypes = {
        currentIndex: PropTypes.number.isRequired,
        isLoading: PropTypes.bool.isRequired,
        product: Product.isRequired,
        setImageIndex: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired
    };

    containerFunctions = {
        handleZoomChange: this.handleZoomChange.bind(this),
        disableZoom: this.disableZoom.bind(this),
        onSliderChange: this.onSliderChange.bind(this)
    };

    constructor(props) {
        super(props);

        this.state = {
            isZoomEnabled: false
        };
    }

    containerProps = () => {
        const { isZoomEnabled } = this.state;
        const { currentIndex } = this.props;

        return {
            gallery: this.getGallery(),
            crumbs: this.getCrumbs(),
            currentIndex,
            isZoomEnabled
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

    disableZoom() {
        document.documentElement.classList.remove('overscrollPrevented');
        this.setState({ isZoomEnabled: false });
    }

    handleZoomChange(args) {
        const { isZoomEnabled } = this.state;

        if (args.scale !== 1) {
            if (isZoomEnabled) {
                return;
            }
            document.documentElement.classList.add('overscrollPrevented');
            this.setState({ isZoomEnabled: true });
        }
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
