import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import TinySlider from 'tiny-slider-react';
import Image from 'Component/Image';
import Link from 'Component/Link';
import { formatCDNLink } from 'Util/Url';
import cx from "classnames";
import 'react-circular-carousel/dist/index.css';
import './DynamicContentRichContentBanner.style';

const settings = {
    lazyload: true,
    mouseDrag: true,
    touch: true,
    controlsText: ["&#60", "&#62"],
    nav: true,
    navPosition: "bottom",
    responsive: {
        1024:{
            items: 1
        },
        420: {
            items: 6
        },
        300: {
            items: 1
        }
    }
};

class DynamicContentRichContentBanner extends PureComponent {
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
            title,
            image_url,
            plp_config
        } = item;

        const linkTo = {
            pathname: formatCDNLink(link),
            state: { plp_config }
        };
        let ht;
        if(screen.width > 900){
            ht = item.height.toString() + "px";
        }
        else{
            ht = screen.width.toString() + "px";
        }
        let wd = screen.width.toString() + "px";

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
                    <Image
                      src={ image_url }
                      alt={ title }
                      mix={ { block: 'DynamicContentRichContentBanner', elem: 'Image' } }
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
                <div block="Label">
                    {item.title && <p block="Label-Title">{item.title}</p>}
                    {item.subtitle && <p block="Label-SubTitle">{item.subtitle}</p>}
                    {item.button && <a href={item.button.link} block="Label-Button">{item.button.label}</a>}
                </div>
                <div block={cx("Tag", {
                        "Tag-TopLeft": item.tag.position === "top_left",
                        "Tag-TopRight": item.tag.position === "top_right",
                        "Tag-TopCenter": item.tag.position === "top_center",
                        "Tag-BottomLeft": item.tag.position === "bottom_left",
                        "Tag-BottomRight": item.tag.position === "bottom_right",
                        "Tag-BottomCenter": item.tag.position === "bottom_center"
                    })}>{item.tag.label}</div>
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
            <div block="DynamicContentRichContentBanner">
                { this.renderCircles() }
            </div>
        );
    }
}

export default DynamicContentRichContentBanner;
