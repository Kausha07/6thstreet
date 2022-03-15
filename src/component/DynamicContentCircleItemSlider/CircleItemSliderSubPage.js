import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import './CircleItemSliderSubPage.style';
import Image from "Component/Image";

class CircleItemSliderSubPage extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

    componentDidMount() {
        let ele = document.getElementById("CircleItemSliderSubPage-Video")
        if (ele) {
            ele.controls = true,
                ele.playsinline = false,
                ele.muted = true,
                ele.loop = true,
                ele.autoplay = true,
                ele.setAttribute("muted", "")

            setTimeout(() => {
                const promise = ele.play();
            }, 0)

        }
    }

    render() {
        let banner = this.props.bannerData.plp_config && this.props.bannerData.plp_config.banner
        let url = banner.url
        let mWidth = (screen.width - 20).toString() + "px"
        let mHeight = ((screen.width - 20) / banner.aspect_ratio).toString() + "px"
        return (
            <div block="CircleItemSliderSubPage">
                <div block="CircleItemSliderSubPage-Video" style={isMobile.any() && { height: mHeight, width: mWidth }}>
                    {
                        banner.type === "image" ?
                            <img src={url} />
                            :
                            <video id="CircleItemSliderSubPage-Video" >
                                <source src={url} type="video/mp4" />
                            </video>
                    }
                </div>
                <div block="CircleItemSliderSubPage-Discription">
                    <h2 block="CircleItemSliderSubPage-Discription" elem="Title" mods={{ isArabic: isArabic() }}>{banner.title}</h2>
                    <p block="CircleItemSliderSubPage-Discription" elem="Desc" mods={{ isArabic: isArabic() }}>{banner.description}</p>
                </div>

            </div>
        );
    }
}

export default CircleItemSliderSubPage;
