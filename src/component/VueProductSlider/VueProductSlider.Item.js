import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { getCurrency } from "Util/App/App";
import WishlistIcon from "Component/WishlistIcon";

class VueProductSliderItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  renderPrice(price) {
    if (price && price.length > 0) {
      const priceObj = price[0],
        currency = getCurrency();
      const priceToShow = priceObj[currency]["6s_base_price"];
      return <span id="price">{`${currency} ${priceToShow}`}</span>;
    }
    return null;
  }

  renderIsNew(is_new_in) {
    if (is_new_in) {
      return (
        <div block="VueProductSlider" elem="VueIsNewTag">
          <span>{__("New")}</span>
        </div>
      );
    }
    return null;
  }

  render() {
    return null;
    const {
      data: {
        thumbnail_url,
        name,
        brand_name,
        price,
        is_new_in = false,
        sku,
        link,
      },
    } = this.props;
    return (
      <div block="VueProductSlider" elem="VueProductContainer">
        <Link to={link} data-banner-type="vueSlider">
          <img
            block="VueProductSlider"
            elem="VueProductImage"
            src={thumbnail_url}
            alt={name}
          />
        </Link>
        <h6 id="brandName">{brand_name}</h6>
        <span id="productName">{name}</span>
        {this.renderPrice(price)}
        {this.renderIsNew(is_new_in)}
        <WishlistIcon sku={sku} />
      </div>
    );
  }
}

export default VueProductSliderItem;
