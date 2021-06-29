import Image from "Component/Image";
import Link from "Component/Link";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { getStore } from "Store";
import { Product } from "Util/API/endpoint/Product/Product.type";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import { getUUIDToken } from "Util/Auth";
import Event, {
  EVENT_GTM_PRODUCT_CLICK,
  SELECT_ITEM_ALGOLIA
} from "Util/Event";
import "./ProductItem.style";

class ProductItem extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    page: PropTypes.string,
    position: PropTypes.number,
    qid: PropTypes.string,
  };

  static defaultProps = {
    page: "",
  };

  state = {
    isArabic: isArabic(),
  };

  handleClick = this.handleProductClick.bind(this);

  handleProductClick() {
    const { product, position, qid } = this.props;
    var data = localStorage.getItem("customer");
    let userData = JSON.parse(data);
    let userToken;
    let queryID;
    if (!qid) {
      queryID = getStore().getState().SearchSuggestions.queryID;
    } else {
      queryID = qid;
    }
    if (userData?.data) {
      userToken = userData.data.id;
    }
    Event.dispatch(EVENT_GTM_PRODUCT_CLICK, product);
    if (queryID) {
      new Algolia().logAlgoliaAnalytics('click',SELECT_ITEM_ALGOLIA, [],{
        objectIDs: [product.objectID],
        queryID,
        userToken: userToken ? `user-${userToken}` : getUUIDToken(),
        position: [position],
      });
    }
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
          {" "}
          {`+${count} `} {__("Colors")}{" "}
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
          {" "}
          {promotion}{" "}
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
        <Image src={thumbnail_url} /> {this.renderExclusive()}{" "}
        {this.renderColors()}{" "}
      </div>
    );
  }

  renderBrand() {
    const {
      product: { brand_name },
    } = this.props;

    return (
      <h2 block="ProductItem" elem="Brand">
        {" "}
        {brand_name}{" "}
      </h2>
    );
  }

  renderTitle() {
    const {
      product: { name },
    } = this.props;

    return (
      <p block="ProductItem" elem="Title">
        {" "}
        {name}{" "}
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
      qid
    } = this.props;
    let queryID;
    if (!qid) {
      queryID = getStore().getState().SearchSuggestions.queryID;
    } else {
      queryID = qid;
    }
    const { pathname } = new URL(url);
    let urlWithQueryID;
    if (queryID) {
     urlWithQueryID = `${pathname}?qid=${queryID}`;
    } else {
      urlWithQueryID = pathname;
    }
    const linkTo = {
      pathname:urlWithQueryID,
      state: {
        product,
      },
    };

    return (
      <Link to={linkTo} onClick={this.handleClick}>
        {" "}
        {this.renderImage()} {this.renderBrand()} {this.renderTitle()}{" "}
        {this.renderPrice()}{" "}

      </Link>
    );
  }

  render() {
    const { isArabic } = this.state;

    return (
      <li
        block="ProductItem"
        mods={{
          isArabic,
        }}
      >
        {" "}
        {this.renderLabel()} {this.renderWishlistIcon()} {this.renderLink()}{" "}
      </li>
    );
  }
}

export default ProductItem;
