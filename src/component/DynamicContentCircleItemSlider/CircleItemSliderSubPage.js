import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CircleItemSliderSubPage.style';

class CircleItemSliderSubPage extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

    render() {
        let url = this.props.bannerData.plp_config.banner.url
        return (
            <div block="CircleItemSliderSubPage">
                {
                    this.props.bannerData.plp_config.banner.type === "image" ?
                    <img src={url}/>
                    :
                    <video controls autoplay loop muted>
                        <source src={ url } type="video/mp4" />
                    </video>
                }

            </div>
        );
    }
}

export default CircleItemSliderSubPage;
