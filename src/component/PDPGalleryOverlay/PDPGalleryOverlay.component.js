/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';
import { TransformWrapper } from 'react-zoom-pan-pinch';

import Image from 'Component/Image';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import ProductGalleryBaseImage from 'Component/ProductGalleryBaseImage';
import Slider from 'Component/Slider';
import SliderHorizontal from 'Component/SliderHorizontal';
import isMobile from 'Util/Mobile';

import { ReactComponent as Close } from './icons/close.svg';
import { ReactComponent as Minus } from './icons/minus.svg';
import { ReactComponent as Plus } from './icons/plus.svg';

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

    imageRef = createRef();

    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);

        this.state = {
            scale: 1,
            positionY: 0,
            positionX: 0,
            imageRef: null,
            addY: 0,
            addX: 0
        };
    }

    componentDidMount() {
        const { onSliderChange, crumbs } = this.props;
        const { imageRef, overlayRef } = this;
        const imgHeight = imageRef.current.offsetHeight;
        const imgWidth = imageRef.current.offsetWidth;
        const overlayHeight = overlayRef.current.children[3].offsetHeight;
        const overlayWidth = overlayRef.current.children[3].offsetWidth;
        const addX = (overlayWidth - imgWidth) / 2 - (overlayWidth - imgWidth * 1.5) / 2;
        const addY = (overlayHeight - imgHeight) / 2 - (overlayHeight - imgHeight * 1.5) / 2;

        this.setState({ addX, addY });

        // // eslint-disable-next-line array-callback-return
        // crumbs.map((crumb) => {
        //     this.setState(({ crumbArr }) => ({ crumbArr: crumbArr.push(crumb) }));
        //     this.setState(({ crumbArr }) => ({ crumbArr: crumbArr.push(crumb) }));
        //     this.setState(({ crumbArr }) => ({ crumbArr: crumbArr.push(crumb) }));
        // });

        // const { crumbArr } = this.state;

        // console.log(crumbs);

        onSliderChange(0);
    }

    renderCrumb = (index, i) => (
        <PDPGalleryCrumb
          key={ i }
          // prefer numerical index
          index={ +index }
        />
    );

    zoomIn = () => {
        const { scale, addX, addY } = this.state;

        if (scale < 8) {
            this.setState({
                scale: scale + 0.5,
                positionX: addX,
                positionY: addY
            });
        }
    };

    zoomOut = () => {
        const { scale, addX, addY } = this.state;
        if (scale !== 1) {
            this.setState({
                scale: scale - 0.5,
                positionX: -addX,
                positionY: -addY
            });
        }
    };

    renderImage(src, i) {
        // console.log(src);
        const { isZoomEnabled, handleZoomChange, disableZoom } = this.props;
        // eslint-disable-next-line object-curly-newline
        const { scale, positionX, positionY } = this.state;

        return (
            <TransformWrapper
              key={ i }
              scale={ scale }
              onZoomChange={ handleZoomChange }
              wheel={ { disabled: true, wheelEnabled: false } }
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
                        // console.log(previousScale);
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
                          imageRef={ this.imageRef }
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
        const {
            crumbs,
            currentIndex, onSliderChange,
            isZoomEnabled
        } = this.props;
        // console.log(crumbs);
        const arr = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15'
        ];

        return (
            <div block="PDPGalleryOverlay" elem="Crumbs">
                <SliderHorizontal
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
                  isZoomEnabled={ isZoomEnabled }
                >
                { arr.map(this.renderCrumb) }
                </SliderHorizontal>
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
        const {
            imgWidth,
            imgHeight,
            imageRef,
            overlayHeight,
            overlayWidth
        } = this.state;

        // console.log(imgWidth, imgHeight, imageRef, overlayHeight, overlayWidth);
        // console.log(closeGalleryOverlay);

        return (
            <div block="PDPGalleryOverlay" ref={ this.overlayRef }>
                <button block="PDPGalleryOverlay" elem="Button" onClick={ closeGalleryOverlay }>
                    <Close />
                </button>
                <button block="PDPGalleryOverlay" elem="ZoomIn" onClick={ this.zoomIn }>
                    <Plus />
                </button>
                <button block="PDPGalleryOverlay" elem="ZoomOut" onClick={ this.zoomOut }>
                    <Minus />
                </button>
                { this.renderCrumbs() }
                { this.renderSlider() }
            </div>
        );
    }
}

export default PDPGalleryOverlay;
