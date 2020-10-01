import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import Slider from 'Component/Slider';

import { ReactComponent as Close } from './icons/close.svg';

import './PDPGalleryOverlay.style';

class PDPGalleryOverlay extends PureComponent {
    static propTypes = {
        currentIndex: PropTypes.number.isRequired,
        gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
        crumbs: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])).isRequired,
        onSliderChange: PropTypes.func.isRequired,
        closeGalleryOverlay: PropTypes.func.isRequired
    };

    renderCrumb = (index, i) => (
        <PDPGalleryCrumb
          key={ i }
          // prefer numerical index
          index={ +index }
        />
    );

    renderGalleryImage = (src, i) => (
        <Image src={ src } key={ i } />
    );

    renderCrumbs() {
        const { crumbs } = this.props;

        return (
            <div block="PDPGalleryOverlay" elem="Crumbs">
                { crumbs.map(this.renderCrumb) }
            </div>

        );
    }

    renderGallery() {
        const { gallery } = this.props;
        return gallery.map(this.renderGalleryImage);
    }

    renderSlider() {
        const { gallery, currentIndex, onSliderChange } = this.props;

        if (!gallery.length) {
            return null;
        }

        return (
            <Slider
              activeImage={ currentIndex }
              onActiveImageChange={ onSliderChange }
              mix={ { block: 'PDPGalleryOverlay', elem: 'Slider' } }
            >
                { this.renderGallery() }
            </Slider>
        );
    }

    renderCloseButton() {
    }

    render() {
        const { closeGalleryOverlay } = this.props;

        return (
            <div block="PDPGalleryOverlay">
                <button block="PDPGalleryOverlay" elem="Button" onClick={ closeGalleryOverlay }>
                    <Close />
                </button>
                { this.renderCrumbs() }
                { this.renderSlider() }
            </div>
        );
    }
}

export default PDPGalleryOverlay;
