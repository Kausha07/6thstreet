import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CircleItemSliderSubPage.style';
import Image from "Component/Image";

class CircleItemSliderSubPage extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

    render() {
        let url = this.props.bannerData.plp_config.banner.url
        return (
            <div block="CircleItemSliderSubPage">
                <div block="CircleItemSliderSubPage-Video">
                    {
                    this.props.bannerData.plp_config.banner.type === "image" ?
                    <img src={url}/>
                    :
                    <video controls autoplay="true" loop muted>
                        <source src={ url } type="video/mp4" />
                    </video>
                    }
                </div>
                <h2>{this.props.bannerData.plp_config.banner.title}</h2>
                <p>{this.props.bannerData.plp_config.banner.description}</p>

            </div>
        );
    }
}

export default CircleItemSliderSubPage;
