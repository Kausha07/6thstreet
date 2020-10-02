/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';
import { TransformWrapper } from 'react-zoom-pan-pinch';

import Image from 'Component/Image';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import ProductGalleryBaseImage from 'Component/ProductGalleryBaseImage';
import Slider from 'Component/Slider';
import isMobile from 'Util/Mobile';

import { ReactComponent as Close } from './icons/close.svg';
import { MAX_ZOOM_SCALE } from './PDPGalleryOverlay.config';

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
        closeGalleryOverlay: PropTypes.func.isRequired,
        isZoomEnabled: PropTypes.bool.isRequired,
        handleZoomChange: PropTypes.func.isRequired,
        disableZoom: PropTypes.func.isRequired
    };

    overlayRef = createRef();

    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);

        this.state = {
            scrollEnabled: true,
            scale: 1,
            positionY: 0,
            positionX: 0
        };
    }

    componentDidMount() {
        const { onSliderChange } = this.props;

        onSliderChange(0);
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

    zoomIn = () => {
        const { scale } = this.state;
        const addX = this.overlayRef.current.offsetWidth * 0.14;
        const addY = this.overlayRef.current.offsetHeight * 0.3;

        this.setState({
            scale: scale + 0.5,
            positionX: addX,
            positionY: addY
        });
        // console.log(this.overlayRef.current.offsetWidth);
    };

    zoomOut = () => {
        const { scale } = this.state;
        if (scale !== 1) {
            const addX = -this.overlayRef.current.offsetWidth * 0.14;
            const addY = -this.overlayRef.current.offsetHeight * 0.3;

            this.setState({
                scale: scale - 0.5,
                positionX: addX,
                positionY: addY
            });
        }
    };

    renderImage(src, i) {
        // console.log(src);
        const { isZoomEnabled, handleZoomChange, disableZoom } = this.props;
        // eslint-disable-next-line object-curly-newline
        const { scrollEnabled, scale, positionX, positionY } = this.state;

        return (
            <TransformWrapper
              key={ i }
              scale={ scale }
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
                  minScale: 1,
                  minPositionX: positionX,
                  minPositionY: positionY
              } }
            >
                { ({
                    scale,
                    previousScale,
                    resetTransform,
                    setTransform,
                    positionX,
                    positionY,
                    options
                }) => {
                    const { minPositionY, minPositionX } = options;
                    // console.log(previousScale);
                    if (scale === 1 && previousScale !== 1) {
                        console.log(previousScale);
                        resetTransform();
                    }

                    // console.log(positionX, minPositionX, minPositionY);
                    // console.log(positionY);

                    if (scale !== previousScale && scale !== 1) {
                        // eslint-disable-next-line no-magic-numbers
                        setTransform(positionX - minPositionX, positionY - minPositionY, scale, 0);
                    }

                    return (
                        <ProductGalleryBaseImage
                          centerContent
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
        console.log(gallery[0] !== undefined);

        if (gallery[0] !== undefined) {
            return gallery.map(this.renderImage);
        }

        return gallery.map(this.renderGalleryImage);
    }

    renderSlider() {
        const {
            gallery,
            currentIndex,
            onSliderChange,
            isZoomEnabled
        } = this.props;

        if (!gallery.length) {
            return null;
        }

        return (
            <Slider
              activeImage={ currentIndex }
              onActiveImageChange={ onSliderChange }
              mix={ { block: 'PDPGalleryOverlay', elem: 'Slider' } }
              showCrumbs={ isMobile.any() }
              isInteractionDisabled={ isZoomEnabled }
            >
                { this.renderGallery() }
            </Slider>
        );
    }

    render() {
        const { closeGalleryOverlay } = this.props;

        console.log(closeGalleryOverlay);

        return (
            <div block="PDPGalleryOverlay" ref={ this.overlayRef }>
                <button block="PDPGalleryOverlay" elem="Button" onClick={ this.zoomIn }>
                    <Close />
                </button>
                <button block="PDPGalleryOverlay" elem="ZoomIn" onClick={ this.zoomOut }>
                    <Close />
                </button>
                { this.renderCrumbs() }
                { this.renderSlider() }
            </div>
        );
    }
}

export default PDPGalleryOverlay;
