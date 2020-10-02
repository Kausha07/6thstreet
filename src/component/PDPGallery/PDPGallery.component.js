import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { TransformWrapper } from 'react-zoom-pan-pinch';

import Image from 'Component/Image';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import PDPGalleryOverlay from 'Component/PDPGalleryOverlay';
import ProductGalleryBaseImage from 'Component/ProductGalleryBaseImage';
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
        onSliderChange: PropTypes.func.isRequired,
        isZoomEnabled: PropTypes.bool.isRequired,
        handleZoomChange: PropTypes.func.isRequired,
        disableZoom: PropTypes.func.isRequired
    };

    maxScale = MAX_ZOOM_SCALE;

    state = {
        galleryOverlay: '',
        scrollEnabled: true
    };

    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);
    }

    renderCrumb = (index, i) => (
        <PDPGalleryCrumb
          key={ i }
          // prefer numerical index
          index={ +index }
        />
    );

    stopScrolling() {
        this.setState({ scrollEnabled: false });
        this.timeout = setTimeout(() => {
            this.setState({ scrollEnabled: true });
            this.timeout = null;

            // 20 ms is time give to scroll down, usually that is enough
            // eslint-disable-next-line no-magic-numbers
        }, 20);
    }

    onWheel = (zoomState) => {
        const { scale } = zoomState;

        if (this.timeout) {
            return;
        }

        if (scale === 1 || scale === MAX_ZOOM_SCALE) {
            this.stopScrolling();
        }
    };

    renderImage(src, i) {
        // console.log(src);
        const { isZoomEnabled, handleZoomChange, disableZoom } = this.props;
        const { scrollEnabled } = this.state;

        return (
            <TransformWrapper
              key={ i }
              onZoomChange={ handleZoomChange }
              onWheelStart={ this.onWheelStart }
              onWheel={ this.onWheel }
              wheel={ { limitsOnWheel: true, disabled: !scrollEnabled } }
            //   doubleClick={ { mode: 'reset' } }
              pan={ {
                  disabled: !isZoomEnabled,
                  limitToWrapperBounds: true,
                  velocity: false
              } }
              options={ {
                  limitToBounds: true,
                  minScale: 1
              } }
            >
                { ({
                    scale,
                    previousScale,
                    resetTransform,
                    setTransform
                }) => {
                    if (scale === 1 && previousScale !== 1) {
                        resetTransform();
                    }

                    return (
                        <ProductGalleryBaseImage
                          setTransform={ setTransform }
                          index={ i }
                          mediaData={ src }
                          scale={ scale }
                          previousScale={ previousScale }
                          disableZoom={ disableZoom }
                          isZoomEnabled={ isZoomEnabled }
                        />
                    );
                } }
            </TransformWrapper>
        );
    }

    renderGalleryImage = (src, i) => (
        <Image src={ src } key={ i } />
    );

    renderGalleryOverlay = () => {
        const galleryOverlay = (
            <PDPGalleryOverlay closeGalleryOverlay={ this.closeGalleryOverlay } />
        );

        this.setState({ galleryOverlay });
    };

    closeGalleryOverlay = () => {
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
                >
                { crumbs.map(this.renderCrumb) }
                </SliderVertical>
            </div>

        );
    }

    renderGallery() {
        const { gallery } = this.props;
        // console.log(gallery[0] !== undefined);

        if (gallery[0] !== undefined) {
            return gallery.map(this.renderImage);
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
