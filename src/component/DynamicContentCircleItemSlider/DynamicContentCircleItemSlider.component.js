import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import TinySlider from 'tiny-slider-react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { formatCDNLink } from 'Util/Url';

import 'react-circular-carousel/dist/index.css';
import './DynamicContentCircleItemSlider.style';

const settings = {
    lazyload: true,
    nav: false,
    mouseDrag: true,
    touch: true,
    controlsText: ["&#60", "&#62"],
    loop:false,
    responsive: {
        1024:{
            items: 8
        },
        420: {
            items: 6
        },
        300: {
            items: 4
        }
    }
};

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

    clickLink = (a) => {
        let link = '/' + a.link.split("?")[0]
        localStorage.setItem("bannerData", JSON.stringify(a));
        localStorage.setItem("CircleBannerUrl", link);
    };

    renderCircle = (item, i) => {
        const {
            link,
            label,
            image_url,
            plp_config
        } = item;

        const linkTo = {
            pathname: formatCDNLink(link),
            state: { plp_config }
        };

        // TODO: move to new component

        return (
            <div block="CircleSlider" key={i}>

                <Link
                  to={ linkTo }
                  key={ i }
                  onClick={ () => {
                      this.clickLink(item);
                  } }

                >
                <img src={ image_url } alt={ label } block="Image" width="70px" height="70px"/>
                    {/* <Image
                      src={ image_url }
                      alt={ label }
                      mix={ { block: 'DynamicContentCircleItemSlider', elem: 'Image' } }
                      ratio="custom"
                      height="70px"
                      width="70px"
                    /> */}
                    { /* <button
                  block="DynamicContentCircleItemSlider"
                  elem="Label"
                  mix={ { block: 'button primary' } }
                >
                    { label }
                </button> */ }
                </Link>
                <div block="CircleSliderLabel">{ label }</div>
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
            <div block="DynamicContentCircleItemSlider">
                { this.renderCircles() }
            </div>
        );
    }
}

export default DynamicContentCircleItemSlider;
