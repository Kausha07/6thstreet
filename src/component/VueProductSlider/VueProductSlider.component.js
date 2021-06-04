import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import './VueProductSlider.style.scss';
import VueProductSliderItem from './VueProductSlider.Item';

class VueProductSlider extends PureComponent {
    static propTypes = {
        withViewAll: PropTypes.bool,
        sliderLength: PropTypes.number,
        heading: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
    };

    getProducts = () => {
        const { products: data, sliderLength } = this.props;
        let products = [...data];
        if (products.length > sliderLength) {
            products.length = sliderLength;
        }
        return [...products];
    }

    viewAllBtn() {
        const { withViewAll } = this.props;
        if (withViewAll) {
            return (
                <div block="VueProductSlider" elem="ViewAllBtn">
                    <span>{"View All"}</span>
                </div>
            );
        }
        return null;
    }

    renderHeader() {
        const { heading } = this.props;
        return (
            <div block="VueProductSlider" elem="HeaderContainer">
                <h4>{heading}</h4>
                {this.viewAllBtn()}
            </div>
        );
    }

    renderSliderContainer() {
        const productsToRender = this.getProducts(),
            pLength = productsToRender.length,
            containerStyle = { gridTemplateColumns: `repeat(${pLength}, 17.041vw)` };
        return (
            <div block="VueProductSlider" elem="SliderContainer" style={containerStyle}>
                {
                    productsToRender.map((item) => {
                        const { sku } = item;
                        return (
                            <VueProductSliderItem key={sku} data={item} />
                        );
                    })
                }
            </div>
        );
    }

    render() {
        return (
            <div block="VueProductSlider" elem="Container">
                {this.renderHeader()}
                {this.renderSliderContainer()}
            </div>
        );
    }
}

export default VueProductSlider;
