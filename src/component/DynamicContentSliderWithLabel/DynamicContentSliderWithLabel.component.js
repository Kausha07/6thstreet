import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import TinySlider from 'tiny-slider-react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { formatCDNLink } from 'Util/Url';
import './DynamicContentSliderWithLabel.style';

const settings = {
    lazyload: true,
    nav: false,
    mouseDrag: true,
    controlsText: ["&#60", "&#62"],
    responsive: {
        1024:{
            items: 8
        },
        420: {
            items: 3
        }
    }
};

class DynamicContentSliderWithLabel extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                label: PropTypes.string,
                link: PropTypes.string,
                plp_config: PropTypes.shape({}) // TODO: describe
            })
        ).isRequired
    };

    clickLink = (a) => {
        localStorage.setItem("bannerData", JSON.stringify(a));
    };

    renderCircle = (item, i) => {
        const {
            link,
            text,
            url,
            plp_config,
            height,
            width
        } = item;

        const linkTo = {
            pathname: formatCDNLink(link),
            state: { plp_config }
        };

        let ht = height.toString() + "px";
        let wd = width.toString() + "px";

        // TODO: move to new component

        return (
            <div block="CircleSlider">

                <Link
                  to={ linkTo }
                  key={ i }
                  onClick={ () => {
                      this.clickLink(item);
                  } }

                >
                    <Image
                      src={ url }
                      alt={ text }
                      mix={ { block: 'DynamicContentCircleItemSlider', elem: 'Image' } }
                      ratio="custom"
                      height={ ht }
                      width={ wd }
                    />
                    { /* <button
                  block="DynamicContentCircleItemSlider"
                  elem="Label"
                  mix={ { block: 'button primary' } }
                >
                    { label }
                </button> */ }
                </Link>
                <div block="CircleSliderLabel">{ text }</div>
            </div>
        );
    };

    renderCircles() {
        const { items = [] } = this.props;
        return (
            <TinySlider settings={ settings } block="CircleSliderWrapper">
                { items.map(this.renderCircle) }
            </TinySlider>
        );
    }

    render() {
        return (
            <div block="DynamicContentSliderWithLabel">
                { this.renderCircles() }
            </div>
        );
    }
}

export default DynamicContentSliderWithLabel;
