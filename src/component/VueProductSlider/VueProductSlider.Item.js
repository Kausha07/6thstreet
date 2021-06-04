import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { getCurrency } from 'Util/App/App';

class VueProductSliderItem extends PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
    };

    renderPrice(price) {
        if (price && price.length > 0) {
            const priceObj = price[0], currency = getCurrency();
            const priceToShow = priceObj[currency]['6s_base_price'];
            return (
                <span id="price">{`${currency} ${priceToShow}`}</span>
            );
        }
        return null;
    }

    render() {
        console.log("VueProductSliderItem", this.props.data)
        const { data: { thumbnail_url, name, brand_name, price } } = this.props;
        return (
            <div block="VueProductSlider" elem="VueProductContainer">
                <img block="VueProductSlider" elem="VueProductImage" src={thumbnail_url} alt={name} />
                <h6 id="brandName">{brand_name}</h6>
                <span id="productName">{name}</span>
                {this.renderPrice(price)}
            </div>
        );
    }
}

export default VueProductSliderItem;
