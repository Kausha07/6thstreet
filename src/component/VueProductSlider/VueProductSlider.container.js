import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import VueProductSlider from './VueProductSlider.component';

export const mapDispatchToProps = (dispatch) => ({});

export class VueProductSliderContainer extends PureComponent {
    static propTypes = {
        withViewAll: PropTypes.bool,
        sliderLength: PropTypes.number,
        heading: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
    };

    static defaultProps = {
        sliderLength: 10,
        withViewAll: false,
    };

    render() {
        return (
            <VueProductSlider {...this.props} />
        );
    }
}


export default connect(null, mapDispatchToProps)(VueProductSliderContainer);
