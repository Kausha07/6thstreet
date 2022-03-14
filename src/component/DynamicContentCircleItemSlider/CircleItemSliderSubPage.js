import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import isMobile from "Util/Mobile";

import './CircleItemSliderSubPage.style';
import Image from "Component/Image";

class CircleItemSliderSubPage extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

    render() {
        let url = this.props.bannerData.plp_config.banner.url
        let mWidth = (screen.width - 20).toString() + "px"
        let mHeight = ((screen.width - 20) / this.props.bannerData.plp_config.banner.aspect_ratio).toString() + "px"
        return (
            <div block="CircleItemSliderSubPage">
                <div block="CircleItemSliderSubPage-Video" style={isMobile.any() && { height: mHeight, width: mWidth }}>
                    {
                        this.props.bannerData.plp_config.banner.type === "image" ?
                            <img src={url} />
                            :
                            <video controls autoplay="true" loop muted>
                                <source src={url} type="video/mp4" />
                            </video>
                    }
                </div>
                <div block="CircleItemSliderSubPage-Discription">
                    <h2>{this.props.bannerData.plp_config.banner.title}</h2>
                    <p>{this.props.bannerData.plp_config.banner.description}</p>
                </div>

            </div>
        );
    }
}

export default CircleItemSliderSubPage;
