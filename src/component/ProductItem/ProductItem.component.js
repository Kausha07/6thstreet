import Image from "Component/Image";
import Link from "Component/Link";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Product } from "Util/API/endpoint/Product/Product.type";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import { getMobileAuthorizationToken } from 'Util/Auth';
import Event, { EVENT_GTM_PRODUCT_CLICK, SELECT_ITEM_ALGOLIA } from "Util/Event";
import "./ProductItem.style";
// const getClientIp = publicIp.v4();

class ProductItem extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    page: PropTypes.string,
    position: PropTypes.number,
  };

  static defaultProps = {
    page: "",
  };

  state = {
    isArabic: isArabic(),
  };

  handleClick = this.handleProductClick.bind(this);

    handleProductClick() {
        const token = getMobileAuthorizationToken();
        console.log('token',token)
      const { product,position } = this.props;
    Event.dispatch(EVENT_GTM_PRODUCT_CLICK, product);
      new Algolia().logProductClicked(
      SELECT_ITEM_ALGOLIA,
      {
        objectIDs: [product.objectID],
        queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
        // userToken: `user-${getClientIp.replace(/\./g, "-")}`,
          userToken: token,
        position: [position]
      }
    );
  }

  renderWishlistIcon() {
    const {
      product: { sku },
    } = this.props;

    return <WishlistIcon sku={sku} />;
  }

  renderLabel() {
    const { product } = this.props;
    return <ProductLabel product={product} />;
  }

  renderColors() {
    const {
      product: { also_available_color, promotion },
    } = this.props;

    if (also_available_color !== undefined && !promotion) {
      const count = also_available_color.split(",").length - 2;

      return count > 0 ? (
        <span block="PLPSummary" elem="Colors">
          {`+${count} `}
          {__("Colors")}
        </span>
      ) : null;
    }

    return null;
  }

  renderExclusive() {
    const {
      product: { promotion },
    } = this.props;

    if (promotion !== undefined) {
      return promotion !== null ? (
        <span block="PLPSummary" elem="Exclusive">
          {promotion}
        </span>
      ) : null;
    }

    return null;
  }

  renderImage() {
    const {
      product: { thumbnail_url },
    } = this.props;

    return (
      <div>
        <Image src={thumbnail_url} />
        {this.renderExclusive()}
        {this.renderColors()}
      </div>
    );
  }

  renderBrand() {
    const {
      product: { brand_name },
    } = this.props;

    return (
      <h2 block="ProductItem" elem="Brand">
        {brand_name}
      </h2>
    );
  }

  renderTitle() {
    const {
      product: { name },
    } = this.props;

    return (
      <p block="ProductItem" elem="Title">
        {name}
      </p>
    );
  }

  renderPrice() {
    const {
      product: { price },
      page,
    } = this.props;

    return <Price price={price} page={page} />;
  }

  renderLink() {
    const {
      product,
      product: { url },
    } = this.props;

    const { pathname } = new URL(url);

    const linkTo = {
      pathname,
      state: { product },
    };

    return (
      <Link to={linkTo} onClick={this.handleClick}>
        {this.renderImage()}
        {this.renderBrand()}
        {this.renderTitle()}
        {this.renderPrice()}
      </Link>
    );
  }

  render() {
    const { isArabic } = this.state;

    return (
      <li block="ProductItem" mods={{ isArabic }}>
        {this.renderLabel()}
        {this.renderWishlistIcon()}
        {this.renderLink()}
      </li>
    );
  }
}

export default ProductItem;
