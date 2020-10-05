import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import PDPGalleryOverlay from 'Component/PDPGalleryOverlay';
import Slider from 'Component/Slider';
import SliderVertical from 'Component/SliderVertical';
import isMobile from 'Util/Mobile';

import { MAX_ZOOM_SCALE } from './PDPGallery.config';

import './PDPGallery.style';

class PDPGallery extends PureComponent {
    static propTypes = {
        currentIndex: PropTypes.number.isRequired,
        gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
        crumbs: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])).isRequired,
        onSliderChange: PropTypes.func.isRequired
    };

    maxScale = MAX_ZOOM_SCALE;

    state = {
        galleryOverlay: ''
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

    renderGalleryOverlay = () => {
        const galleryOverlay = (
            <PDPGalleryOverlay closeGalleryOverlay={ this.closeGalleryOverlay } />
        );

        document.body.style.overflow = 'hidden';

        this.setState({ galleryOverlay });
    };

    closeGalleryOverlay = () => {
        document.body.style.overflow = 'visible';
        this.setState({ galleryOverlay: '' });
    };

    renderCrumbs() {
        const { crumbs, currentIndex, onSliderChange } = this.props;

        return (
            <div block="PDPGallery" elem="Crumbs">
                <SliderVertical
                  mix={ {
                      block: 'Slider',
                      mods: { isCrumbs: true },
                      mix: {
                          block: 'Slider',
                          elem: 'Wrapper',
                          mods: { isCrumbs: true }
                      }
                  } }
                  activeImage={ currentIndex }
                  onActiveImageChange={ onSliderChange }
                  isInteractionDisabled
                >
                { crumbs.map(this.renderCrumb) }
                </SliderVertical>
            </div>

        );
    }

    renderGallery() {
        const { gallery } = this.props;

        if (gallery[0] !== undefined) {
            return gallery.map(this.renderGalleryImage);
        }

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
              mix={ { block: 'PDPGallery', elem: 'Slider' } }
              isInteractionDisabled={ !isMobile.any() }
              showCrumbs={ isMobile.any() }
            >
                { this.renderGallery() }
            </Slider>
        );
    }

    render() {
        const { galleryOverlay } = this.state;

        return (
            <div block="PDPGallery">
                { galleryOverlay }
                { this.renderCrumbs() }
                <button onClick={ this.renderGalleryOverlay }>
                    { this.renderSlider() }
                </button>
            </div>
        );
    }
}

export default PDPGallery;
