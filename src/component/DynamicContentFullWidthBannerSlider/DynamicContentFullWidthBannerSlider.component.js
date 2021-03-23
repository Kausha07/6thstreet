import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import SliderHomepage from 'Component/SliderHomepage';
import { formatCDNLink } from 'Util/Url';
import DynamicContentHeader from '../DynamicContentHeader/DynamicContentHeader.component'
import DynamicContentFooter from '../DynamicContentFooter/DynamicContentFooter.component'
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
            pathname: formatCDNLink(link),
            state: { plp_config }
        };

        return (
            <Link
              to={ linkTo }
              key={ i }
            >
                <img src={ image_url } alt={ label } />
            </Link>
        );
    };

    renderSlider() {
        const { items = [] } = this.props;
        const { activeSlide } = this.state;

        return (
            <div>
                { items.map(this.renderSlide) }
            </div>
        );
    }

    render() {
        return (
            <div block="DynamicContentFullWidthBannerSlider">
                {this.props.header &&
                    <DynamicContentHeader header={this.props.header}/>
                }
                { this.renderSlider() }
                {this.props.footer &&
                    <DynamicContentFooter footer={this.props.footer}/>
                }
            </div>
        );
    }
}

export default DynamicContentFullWidthBannerSlider;
