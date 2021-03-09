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
            items: 5
        },
        300: {
            items: 2
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
            <div block="SliderWithLabel" key={i*10}>

                <Link
                  to={ linkTo }
                  key={ i*10 }
                  onClick={ () => {
                      this.clickLink(item);
                  } }

                >
                    <Image
                      src={ url }
                      alt={ text }
                      mix={ { block: 'DynamicContentSliderWithLabel', elem: 'Image' } }
                      ratio="custom"
                      height={ ht }
                      width={ wd }
                    />

                </Link>
                <div block="CircleSliderLabel">{ text }</div>
            </div>
        );
    };

    renderCircles() {
        const { items = [] } = this.props;
        return (
            <TinySlider settings={ settings } block="SliderWithLabelWrapper">
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
