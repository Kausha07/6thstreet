import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import DynamicContentVueProductSlider from './DynamicContentVueProductSlider.component';

export const mapStateToProps = (state) => ({
});

export class DynamicContentVueProductSliderContainer extends PureComponent {
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
            <DynamicContentVueProductSlider {...this.props} />
        );
    }
}


export default connect(mapStateToProps, null)(DynamicContentVueProductSliderContainer);
