import { HOME_PAGE_BANNER_CLICK_IMPRESSIONS } from "Component/GoogleTagManager/events/BannerImpression.event";
import Image from "Component/Image";
import Link from "Component/Link";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import WishlistIcon from "Component/WishlistIcon";
import PLPAddToCart from "Component/PLPAddToCart/PLPAddToCart.component";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { getStore } from "Store";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import { getUUIDToken } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import isMobile from "Util/Mobile";
import Event, {
  EVENT_GTM_PRODUCT_CLICK,
  SELECT_ITEM_ALGOLIA,
} from "Util/Event";
import "./ProductItem.style";
import { setPrevPath } from "Store/PLP/PLP.action";
import { connect } from "react-redux";
import { withRouter } from "react-router";
//Global Variable for PLP AddToCart
var urlWithQueryID;
export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
});

export const mapDispatchToProps = (dispatch, state) => ({
  setPrevPath: (prevPath) => dispatch(setPrevPath(prevPath)),
});

class ProductItem extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    page: PropTypes.string,
    position: PropTypes.number,
    qid: PropTypes.string,
    isVueData: PropTypes.bool,
    pageType: PropTypes.string,
    prevPath: PropTypes.string,
  };

  static defaultProps = {
    page: "",
  };

  state = {
    isArabic: isArabic(),
    stockAvailibility: true,
    selectedSizeType: "eu",
    selectedSizeCode: "",
  };

  setSize = (sizeType, sizeCode) => {
    // this.setState({
    //   selectedSizeType: sizeType || "eu",
    //   selectedSizeCode: sizeCode || "",
    // });
  };

  setStockAvailability = (status) => {
    // const {
    //   product: { price },
    // } = this.props;
    // console.log("hi",status)
    // this.setState({ stockAvailibility: !!price && status });
  };

  handleClick = this.handleProductClick.bind(this);

  handleProductClick() {
    const { product, position, qid, isVueData, setPrevPath } = this.props;
    var data = localStorage.getItem("customer");
    let userData = JSON.parse(data);
    let userToken;
    let queryID;
    setPrevPath(window.location.href);
    if (!isVueData) {
      if (!qid) {
        queryID = getStore().getState().SearchSuggestions.queryID;
      } else {
        queryID = qid;
      }
    }
    if (userData?.data) {
      userToken = userData.data.id;
    }
    Event.dispatch(EVENT_GTM_PRODUCT_CLICK, product);
    if (queryID) {
      new Algolia().logAlgoliaAnalytics("click", SELECT_ITEM_ALGOLIA, [], {
        objectIDs: [product.objectID],
        queryID,
        userToken: userToken ? `user-${userToken}` : getUUIDToken(),
        position: [position],
      });
    }
    // this.sendBannerClickImpression(product);
  }

  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderWishlistIcon() {
    const {
      product: { sku },
      product,
      pageType,
      renderMySignInPopup,
    } = this.props;
    return (
      <WishlistIcon
        renderMySignInPopup={renderMySignInPopup}
        sku={sku}
        data={product}
        pageType={pageType}
      />
    );
  }

  renderLabel() {
    const { product } = this.props;
    return <ProductLabel product={product} section="productItem" />;
  }

  renderColors() {
    const {
      product: { also_available_color, promotion },
    } = this.props;

    if (also_available_color !== undefined && !promotion) {
      const count = also_available_color.split(",").length - 2;

      return count > 0 ? (
        <div block="PLPSummary" elem="Colors">
          {" "}
          {`+${count} `} {__("Colors")}{" "}
        </div>
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
        <div block="PLPSummary" elem="Exclusive">
          {" "}
          {promotion}{" "}
        </div>
      ) : null;
    }

    return null;
  }

  renderOutOfStock() {
    const {
      product: { in_stock, stock_qty },
    } = this.props;
    if (in_stock === 0 || (in_stock === 1 && stock_qty === 0)) {
      return (
        <span block="ProductItem" elem="OutOfStock">
          {" "}
          {__("out of stock")}
        </span>
      );
    }

    return null;
  }

  renderImage() {
    const {
      product: { thumbnail_url },
      lazyLoad = true,
    } = this.props;

    return (
      <div block="ProductItem" elem="ImageBox">
        <Image lazyLoad={lazyLoad} src={thumbnail_url} />
        {/* {this.renderOutOfStock()} */}
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
    return <Price price={price} page={page} renderSpecialPrice={true} />;
  }

  renderAddToCartOnHover() {
    const { product } = this.props;
    let price = Array.isArray(product.price)
      ? Object.values(product.price[0])
      : Object.values(product.price);
    if (price[0].default === 0) {
      return null;
    }
    return (
      <div block="ProductItem" elem="AddToCart">
        <PLPAddToCart product={this.props.product} url={urlWithQueryID} />
      </div>
    );
  }

  renderLink() {
    const {
      product,
      product: { url, link },
      qid,
      isVueData,
      prevPath = null,
    } = this.props;
    let queryID;
    if (!isVueData) {
      if (!qid) {
        queryID = getStore().getState().SearchSuggestions.queryID;
      } else {
        queryID = qid;
      }
    }

    let pathname = "/";
    if (!isVueData && url) {
      try {
        pathname = new URL(url)?.pathname;
      } catch (err) {
        console.error(err);
      }
      if (queryID) {
        urlWithQueryID = `${pathname}?qid=${queryID}`;
      } else {
        urlWithQueryID = pathname;
      }
    } else {
      urlWithQueryID = link;
    }
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "home";
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;

    let parseLink = urlWithQueryID;
    const linkTo = {
      pathname: parseLink,
      state: {
        product,
        prevPath: prevPath,
      },
    };

    return (
      <Link to={isVueData ? parseLink : linkTo} onClick={this.handleClick}>
        {this.renderImage()}
        {this.renderOutOfStock()}
        {this.renderBrand()}
        {this.renderTitle()}
        {this.renderPrice()}
      </Link>
    );
  }

  render() {
    const { isArabic } = this.state;
    const {
      product: { sku },
    } = this.props;
    return (
      <li
        id={sku}
        block="ProductItem"
        mods={{
          isArabic,
        }}
      >
        {" "}
        {this.renderLabel()}
        {this.renderWishlistIcon()} {this.renderLink()}{" "}
        {!isMobile.any() && this.renderAddToCartOnHover()}
      </li>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductItem)
);
