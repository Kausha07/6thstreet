import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import PDPGalleryCrumb from 'Component/PDPGalleryCrumb';
import Slider from 'Component/Slider';

import './PDPGallery.style';

class PDPGallery extends PureComponent {
    static propTypes = {
        currentIndex: PropTypes.number.isRequired,
        gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
        crumbs: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])).isRequired
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
            <div block="PDPGallery" elem="Crumbs">
                { crumbs.map(this.renderCrumb) }
            </div>
        );
    }

    renderGallery() {
        const { gallery } = this.props;
        return gallery.map(this.renderGalleryImage);
    }

    renderSlider() {
        const { currentIndex, gallery } = this.props;
        const activeImage = currentIndex >= 0 ? currentIndex : 0;

        if (!gallery.length) {
            return null;
        }

        return (
            <Slider
              activeImage={ activeImage }
              mix={ { block: 'PDPGallery', elem: 'Slider' } }
            >
                { this.renderGallery() }
            </Slider>
        );
    }

    render() {
        return (
            <div block="PDPGallery">
                { this.renderCrumbs() }
                { this.renderSlider() }
            </div>
        );
    }
}

export default PDPGallery;
