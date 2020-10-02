import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Slider from 'Component/Slider';

import './DynamicContentCircleItemSlider.style';

class DynamicContentCircleItemSlider extends PureComponent {
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

    renderCircle = (item, i) => {
        const {
            link,
            label,
            image_url,
            plp_config
        } = item;

        const linkTo = {
            pathname: link,
            state: { plp_config }
        };

        // TODO: move to new component

        return (
            <Link
              to={ linkTo }
              key={ i }
            >
                <Image
                  src={ image_url }
                  alt={ label }
                  mix={ { block: 'DynamicContentCircleItemSlider', elem: 'Image' } }
                  ratio="custom"
                  height="480px"
                />
                <button
                  block="DynamicContentCircleItemSlider"
                  elem="Label"
                  mix={ { block: 'button primary' } }
                >
                    { label }
                </button>
            </Link>
        );
    };

    renderCircles() {
        const { items } = this.props;
        return (
            <Slider showCrumbs>
                { items.map(this.renderCircle) }
            </Slider>
        );
    }

    render() {
        return (
            <div block="DynamicContentCircleItemSlider">
                { this.renderCircles() }
            </div>
        );
    }
}

export default DynamicContentCircleItemSlider;
