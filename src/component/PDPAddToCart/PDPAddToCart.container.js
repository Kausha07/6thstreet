/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import queryString from "query-string";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { getStore } from "Store";
import { setMinicartOpen } from "Store/Cart/Cart.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { Product } from "Util/API/endpoint/Product/Product.type";
import Algolia from "Util/API/provider/Algolia";
import { getUUIDToken } from "Util/Auth";
import Event, {
  ADD_TO_CART_ALGOLIA,
  EVENT_GTM_PRODUCT_ADD_TO_CART
} from "Util/Event";
import history from "Util/History";
import isMobile from "Util/Mobile";
import PDPAddToCart from "./PDPAddToCart.component";
import PDPAddToCartDesktop from "./PDPAddToCartDesktop.component";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  totals: state.CartReducer.cartTotals,
});

export const mapDispatchToProps = (dispatch) => ({
  showNotification: (type, message) => dispatch(showNotification(type, message)),
  getCartTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
  addProductToCart: (
    productData,
    color,
    optionValue,
    basePrice,
    brand_name,
    thumbnail_url,
    url,
    itemPrice
  ) =>
    CartDispatcher.addProductToCart(
      dispatch,
      productData,
      color,
      optionValue,
      basePrice,
      brand_name,
      thumbnail_url,
      url,
      itemPrice
    ),
  setMinicartOpen: (isMinicartOpen = false) => dispatch(setMinicartOpen(isMinicartOpen)),
  getProductStock: (sku) => PDPDispatcher.getProductStock(dispatch, sku),
});

export class PDPAddToCartContainer extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    addProductToCart: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    totals: PropTypes.object,
    PrevTotal: PropTypes.number,
    total: PropTypes.number,
    productAdded: PropTypes.bool,
    setMinicartOpen: PropTypes.func.isRequired,
    getProductStock: PropTypes.func.isRequired,
    setStockAvailability: PropTypes.func.isRequired,
  };

  static defaultProps = {
    totals: {},
    PrevTotal: null,
    total: null,
    productAdded: false,
  };

  containerFunctions = {
    onSizeTypeSelect: this.onSizeTypeSelect.bind(this),
    onSizeSelect: this.onSizeSelect.bind(this),
    addToCart: this.addToCart.bind(this),
    routeChangeToCart: this.routeChangeToCart.bind(this),
  };

  constructor(props) {
    super(props);

    this.state = {
      sizeObject: {},
      mappedSizeObject: {},
      selectedSizeType: "eu",
      selectedSizeCode: "",
      insertedSizeStatus: true,
      isLoading: false,
      addedToCart: false,
      buttonRefreshTimeout: 1250,
      showProceedToCheckout: false,
      hideCheckoutBlock: false,
      clearTime: false,
      processingRequest: false,
    };

    this.fullCheckoutHide = null;
    this.startCheckoutHide = null;
  }

  static getDerivedStateFromProps(props) {
    const { product } = props;

    if (product.simple_products !== undefined) {
      const { simple_products, size_eu } = product;

      const filteredProductKeys = Object.keys(simple_products)
        .reduce((acc, key) => {
          const {
            size: { eu: productSize },
          } = simple_products[key];

          acc.push([size_eu.indexOf(productSize), key]);

          return acc;
        }, [])
        .sort((a, b) => {
          if (a[0] < b[0]) {
            return -1;
          }

          if (a[0] > b[0]) {
            return 1;
          }

          return 0;
        })
        .reduce((acc, item) => {
          acc.push(item[1]);

          return acc;
        }, []);

      const filteredProductSizeKeys = Object.keys(
        product.simple_products[filteredProductKeys[0]].size || {}
      );

      const object = {
        sizeCodes: filteredProductKeys || [],
        sizeTypes: filteredProductSizeKeys || [],
      };

      if (
        filteredProductKeys.length <= 1 &&
        filteredProductSizeKeys.length === 0
      ) {
        return { insertedSizeStatus: false, sizeObject: object };
      }

      if (
        filteredProductKeys.length > 1 &&
        filteredProductSizeKeys.length === 0
      ) {
        const object = {
          sizeCodes: [filteredProductKeys[1]],
          sizeTypes: filteredProductSizeKeys,
        };

        return { insertedSizeStatus: false, sizeObject: object };
      }

      return { sizeObject: object };
    }

    return {
      insertedSizeStatus: false,
      sizeObject: {
        sizeCodes: [],
        sizeTypes: [],
      },
    };
  }

  componentDidMount() {
    const {
      product: { sku },
      getProductStock,
    } = this.props;
    const {
      sizeObject: { sizeCodes = [], sizeTypes },
    } = this.state;
    this.setState({ processingRequest: true });

    getProductStock(sku).then((response) => {
      const emptyStockSizes = Object.entries(response).reduce((acc, size) => {
        const sizeCode = size[0];
        const { quantity } = size[1];

        if (parseInt(quantity, 0) === 0) {
          acc.push(sizeCode);
        }

        return acc;
      }, []);

      const mappedSizes = sizeCodes.reduce((acc, sizeCode) => {
        if (!emptyStockSizes.includes(sizeCode)) {
          acc.push(sizeCode);
        }

        return acc;
      }, []);

      const object = {
        sizeTypes,
        sizeCodes: mappedSizes,
      };

      this.setState({ processingRequest: false, mappedSizeObject: object });
    });
  }

  componentDidUpdate(prevProps, _) {
    const {
      totals: { total: PrevTotal = null },
    } = prevProps;
    const {
      totals: { total = null },
    } = this.props;
    const { productAdded } = this.state;

    if (productAdded && total && PrevTotal !== total) {
      this.clearTimeAll();
      this.proceedToCheckout();
    }
  }

  containerProps = () => {
    const { product, setStockAvailability } = this.props;
    const { mappedSizeObject } = this.state;
    const basePrice =
      product.price[0] &&
      product.price[0][Object.keys(product.price[0])[0]]["6s_base_price"];

    return {
      ...this.state,
      sizeObject: mappedSizeObject,
      product,
      basePrice,
      setStockAvailability,
    };
  };

  onSizeTypeSelect(type) {
    this.setState({
      selectedSizeType: type.target.value,
      selectedSizeCode: "",
    });
  }

  onSizeSelect(size) {
    this.setState({ selectedSizeCode: size.target.value });
  }

  addToCart() {
    const {
      product: {
        simple_products = {},
        thumbnail_url,
        url,
        color,
        brand_name,
        price = {},
        size_uk = [],
        size_eu = [],
        size_us = [],
        name,
        sku: configSKU,
        objectID,
      },
      addProductToCart,
      showNotification,
    } = this.props;
    
    if (!price[0]) {
      showNotification("error", __("Unable to add product to cart."));

      return;
    }

    const { selectedSizeType, selectedSizeCode, insertedSizeStatus } =
      this.state;
    const itemPrice = price[0][Object.keys(price[0])[0]]["6s_special_price"];
    const basePrice = price[0][Object.keys(price[0])[0]]["6s_base_price"];

    this.setState({ productAdded: true });

    if (
      (size_uk.length !== 0 || size_eu.length !== 0 || size_us.length !== 0) &&
      selectedSizeCode === ""
    ) {
      showNotification("error", __("Please select a size."));
    }

    if (
      (size_uk.length !== 0 || size_eu.length !== 0 || size_us.length !== 0) &&
      selectedSizeCode !== ""
    ) {
      this.setState({ isLoading: true });
      const { size } = simple_products[selectedSizeCode];
      const optionId = selectedSizeType.toLocaleUpperCase();
      const optionValue = size[selectedSizeType];
      addProductToCart(
        {
          sku: selectedSizeCode,
          configSKU,
          qty: 1,
          optionId,
          optionValue,
        },
        color,
        optionValue,
        basePrice,
        brand_name,
        thumbnail_url,
        url,
        itemPrice
      ).then((response) => {
        // Response is sent only if error appear
        if (response) {
          showNotification("error", __(response));
          this.afterAddToCart(false);
        } else {
          this.afterAddToCart();
        }
      });

      Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
        product: {
          brand: brand_name,
          category: "",
          id: configSKU,
          name,
          price: itemPrice,
          quantity: 1,
          size: optionValue,
          variant: color,
        },
      });
      var data = localStorage.getItem("customer");
      let userData = JSON.parse(data);
      let userToken;
      var qid = queryString.parse(window.location.search)?.qid
        ? queryString.parse(window.location.search)?.qid
        : null;
      let queryID;
      if (!qid) {
        queryID = getStore().getState().SearchSuggestions.queryID;
      } else {
        queryID = qid;
      }
      if (userData?.data?.id) {
        userToken = userData.data.id;
      }
      if (queryID) {
        new Algolia().logAlgoliaAnalytics('conversion',ADD_TO_CART_ALGOLIA, [], {
          objectIDs: [objectID],
          queryID,
          userToken: userToken ? `user-${userToken}` : getUUIDToken(),
        });
      }
    }

    if (!insertedSizeStatus) {
      this.setState({ isLoading: true });
      const code = Object.keys(simple_products);

      addProductToCart(
        {
          sku: code[0],
          configSKU,
          qty: 1,
          optionId: "",
          optionValue: "",
        },
        color,
        null,
        basePrice,
        brand_name,
        thumbnail_url,
        url,
        itemPrice
      ).then((response) => {
        // Response is sent only if error appear
        if (response) {
          showNotification("error", __(response));
          this.afterAddToCart(false);
        } else {
          this.afterAddToCart();
        }
      });

      Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
        product: {
          brand: brand_name,
          category: "",
          id: configSKU,
          name,
          price: itemPrice,
          quantity: 1,
          size: "",
          variant: "",
        },
      });
      var data = localStorage.getItem("customer");
      let userData = JSON.parse(data);
      let userToken;
      const queryID = getStore().getState().SearchSuggestions.queryID;
      if (userData?.data?.id) {
        userToken = userData.data.id;
      }
      if (queryID) {
        new Algolia().logAlgoliaAnalytics('conversion',ADD_TO_CART_ALGOLIA, [], {
          objectIDs: [objectID],
          queryID,
          userToken: userToken ? `user-${userToken}` : getUUIDToken(),
        });
      }
    }
  }

  afterAddToCart(isAdded = "true") {
    const { setMinicartOpen } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { buttonRefreshTimeout } = this.state;
    this.setState({ isLoading: false });
    // TODO props for addedToCart
    const timeout = 1250;

    if (isAdded) {
      setMinicartOpen(true);
      this.setState({ addedToCart: true });
    }

    setTimeout(
      () => this.setState({ productAdded: false, addedToCart: false }),
      timeout
    );
  }

  clearTimeAll() {
    this.setState({ hideCheckoutBlock: false });

    clearTimeout(this.fullCheckoutHide);
    clearTimeout(this.startCheckoutHide);
  }

  proceedToCheckout() {
    this.setState({ showProceedToCheckout: true });

    this.startCheckoutHide = setTimeout(
      () => this.setState({ hideCheckoutBlock: true }),
      5000
    );
    this.fullCheckoutHide = setTimeout(
      () =>
        this.setState({
          showProceedToCheckout: false,
          hideCheckoutBlock: false,
        }),
      7000
    );
  }

  routeChangeToCart() {
    history.push("/cart");
  }

  render() {
    if (!isMobile.any()) {
      return (
        <PDPAddToCartDesktop
          {...this.containerFunctions}
          {...this.containerProps()}
        />
      );
    }

    return (
      <PDPAddToCart {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDPAddToCartContainer);
