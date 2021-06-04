import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import './VueProductSlider.style.scss';

class VueProductSlider extends PureComponent {
    static propTypes = {
        withViewAll: PropTypes.bool,
        sliderLength: PropTypes.number,
        heading: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
    };

    render() {
        console.log("VueProductSlider this.props", this.props);
        const { heading } = this.props;
        return (
            <div block="VueProductSlider" elem="Container">
                <h4>{heading}</h4>
            </div>
        );
    }
}

export default VueProductSlider;
