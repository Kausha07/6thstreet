import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import PDPGalleryOverlay from 'Component/PDPGalleryOverlay';
import Slider from 'Component/Slider';
import SliderVertical from 'Component/SliderVertical';
import WishlistIcon from 'Component/WishlistIcon';
import CSS from 'Util/CSS';
import { isArabic } from 'Util/App';
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
        sku: PropTypes.string.isRequired
    };

    overlaybuttonRef = createRef();

    crumbsRef = createRef();

    maxScale = MAX_ZOOM_SCALE;

    state = {
        galleryOverlay: ''
    };

    componentDidMount() {
        CSS.setVariable(this.crumbsRef, 'gallery-crumbs-height', `${this.overlaybuttonRef.current.offsetHeight}px`);
    }

    renderBackButton() {
        return (
            <div block="BackArrow" mods={ { isArabic } } key="back">
                <button
                    block="BackArrow-Button"
                    // onClick={ this.isPLP() ? this.backFromPLP : history.goBack }
                >
            </button>
        </div>
        );
    }

    renderCartIcon() {
        return (
            <Link block='CartIcon' to='/cart'>
                <div block='CartIcon' elem='Icon' />
            </Link>
        )
    }
    renderWishlistIcon() {
        const { sku } = this.props;
        return (
                <WishlistIcon sku={ sku } />
        );
    }

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
        const { crumbs = [], currentIndex, onSliderChange } = this.props;

        return (
            <div ref={ this.crumbsRef } block="PDPGallery" elem="Crumbs">
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
        const { gallery = [] } = this.props;

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
                { this.renderBackButton() }
                { this.renderCrumbs() }
                <div block="OverlayIcons">
                    { this.renderCartIcon() }
                    { this.renderWishlistIcon() }
                </div>
                <button
                  ref={ this.overlaybuttonRef }
                  block="PDPGallery"
                  elem="OverlayButton"
                  onClick={ this.renderGalleryOverlay }
                >
                    { this.renderSlider() }
                </button>
            </div>
        );
    }
}

export default PDPGallery;
