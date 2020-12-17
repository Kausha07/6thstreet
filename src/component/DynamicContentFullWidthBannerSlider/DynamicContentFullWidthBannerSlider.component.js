import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Slider from 'Component/Slider';

import './DynamicContentFullWidthBannerSlider.style';

class DynamicContentFullWidthBannerSlider extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                image_url: PropTypes.string,
                label: PropTypes.string,
                link: PropTypes.string,
                plp_config: PropTypes.shape({}) // TODO: describe
            })
        ).isRequired
    };

    state = {
        activeSlide: 0
    };

    onSliderChange = (activeSlide) => {
        this.setState({ activeSlide });
    };

    renderSlide = (item, i) => {
        const {
            link,
            label,
            url: image_url,
            plp_config
        } = item;

        const linkTo = {
            pathname: link,
            state: { plp_config }
        };

        return (
            <Link
              to={ linkTo }
              key={ i }
            >
                <Image
                  src={ image_url }
                  alt={ label }
                  mix={ { block: 'DynamicContentFullWidthBannerSlider', elem: 'Image' } }
                  ratio="custom"
                  height="480px"
                />
            </Link>
        );
    };

    renderSlider() {
        const { items = [] } = this.props;
        const { activeSlide } = this.state;

        return (
            <Slider activeImage={ activeSlide } onActiveImageChange={ this.onSliderChange }>
                { items.map(this.renderSlide) }
            </Slider>
        );
    }

    render() {
        return (
            <div block="DynamicContentFullWidthBannerSlider">
                { this.renderSlider() }
            </div>
        );
    }
}

export default DynamicContentFullWidthBannerSlider;
