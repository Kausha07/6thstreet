/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { getStore } from "Store";
import { setMinicartOpen } from "Store/Cart/Cart.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { customerType } from "Type/Account";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, {
  EVENT_GTM_PRODUCT_ADD_TO_CART,
  VUE_ADD_TO_CART,
} from "Util/Event";
import history from "Util/History";
import { ONE_MONTH_IN_SECONDS } from "Util/Request/QueryDispatcher";
import { NOTIFY_EMAIL } from "./PDPAddToCard.config";
import PDPAddToCart from "./PDPAddToCart.component";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  locale: state.AppState.locale,
  totals: state.CartReducer.cartTotals,
  customer: state.MyAccountReducer.customer,
  guestUserEmail: state.MyAccountReducer.guestUserEmail,
});

export const mapDispatchToProps = (dispatch) => ({
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  getCartTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
  setGuestUserEmail: (email) =>
    MyAccountDispatcher.setGuestUserEmail(dispatch, email),
  addProductToCart: (
    productData,
    color,
    optionValue,
    basePrice,
    brand_name,
    thumbnail_url,
    url,
    itemPrice,
    searchQueryId
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
      itemPrice,
      searchQueryId
    ),
  setMinicartOpen: (isMinicartOpen = false) =>
    dispatch(setMinicartOpen(isMinicartOpen)),
  getProductStock: (sku) => PDPDispatcher.getProductStock(dispatch, sku),
  sendNotifyMeEmail: (data) => PDPDispatcher.sendNotifyMeEmail(data),
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
    customer: customerType,
    guestUserEmail: PropTypes.string,
  };

  static defaultProps = {
    totals: {},
    PrevTotal: null,
    total: null,
    productAdded: false,
    customer: null,
  };

  containerFunctions = {
    onSizeTypeSelect: this.onSizeTypeSelect.bind(this),
    onSizeSelect: this.onSizeSelect.bind(this),
    addToCart: this.addToCart.bind(this),
    routeChangeToCart: this.routeChangeToCart.bind(this),
    showAlertNotification: this.showAlertNotification.bind(this),
    sendNotifyMeEmail: this.sendNotifyMeEmail.bind(this),
    setGuestUserEmail: this.setGuestUserEmail.bind(this),
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
      productStock: {},
      isOutOfStock: false,
      notifyMeLoading: false,
      notifyMeSuccess: false,
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
        sizeTypes: filteredProductSizeKeys?.length ? ["uk", "eu", "us"] : [],
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
      product: { sku, size_eu, size_uk, size_us,in_stock },
      getProductStock,
      setGuestUserEmail,
    } = this.props;
    const email = BrowserDatabase.getItem(NOTIFY_EMAIL);
    if (email) {
      setGuestUserEmail(email);
    }
    const {
      sizeObject: { sizeTypes },
    } = this.state;
    this.setState({ processingRequest: true });
    getProductStock(sku).then((response) => {
      const allSizes = Object.entries(response).reduce((acc, size) => {
        const sizeCode = size[0];
        const { quantity } = size[1];

        if (quantity !== null && quantity !== undefined) {
          acc.push(sizeCode);
        }

        return acc;
      }, []);
      const object = {
        sizeTypes,
        sizeCodes: allSizes,
      };
      this.setState({
        processingRequest: false,
        mappedSizeObject: object,
        productStock: response,
        ...(size_us.length === 0 &&
          size_uk.length === 0 &&
          size_eu.length === 0 &&
          in_stock === 0 && { isOutOfStock: true }),
      });
    });
  }

  setGuestUserEmail(email) {
    const { setGuestUserEmail } = this.props;
    setGuestUserEmail(email);
  }

  sendNotifyMeEmail(email) {
    const {
      locale,
      product: { sku },
      sendNotifyMeEmail,
      showNotification,
      customer,
    } = this.props;
    const { selectedSizeCode } = this.state;

    let data = { email, sku: selectedSizeCode || sku, locale };
    this.setState({ notifyMeLoading: true });

    sendNotifyMeEmail(data).then((response) => {
      if (response && response.success) {
        if (!(customer && customer.email)) {
          BrowserDatabase.setItem(email, NOTIFY_EMAIL, ONE_MONTH_IN_SECONDS);
        }
        this.setGuestUserEmail(email);
        //if success
        if (response.message) {
          showNotification("error", response.message);
          this.setState({ notifyMeSuccess: false, isOutOfStock: false });
        } else {
          this.setState({ notifyMeSuccess: true, isOutOfStock: false });
          if (customer && customer.id) {
            //if user is logged in then change email
            const loginEvent = new CustomEvent("userLogin");
            window.dispatchEvent(loginEvent);
          }
          setTimeout(() => {
            this.setState({ notifyMeSuccess: false, isOutOfStock: false });
          }, 4000);
        }
      } else {
        //if error
        showNotification("error", __("Something went wrong."));
      }
      this.setState({ notifyMeLoading: false });
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
    const { product, setStockAvailability, customer, guestUserEmail } =
      this.props;
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
      customer,
      guestUserEmail,
    };
  };

  onSizeTypeSelect(type) {
    this.setState({
      selectedSizeType: type.target.value,
    });
  }

  onSizeSelect({ target }) {
    const { value } = target;
    const { productStock, isOutOfStock } = this.state;
    let outOfStockVal = isOutOfStock;
    if (productStock && productStock[value]) {
      const selectedSize = productStock[value];
      if (
        selectedSize["quantity"] !== undefined &&
        selectedSize["quantity"] !== null &&
        (typeof selectedSize["quantity"] === "string"
          ? parseInt(selectedSize["quantity"], 0) === 0
          : selectedSize["quantity"] === 0)
      ) {
        outOfStockVal = true;
      } else {
        outOfStockVal = false;
      }
    }
    this.setState({
      selectedSizeCode: value,
      isOutOfStock: outOfStockVal,
      notifyMeSuccess: false,
    });
  }

  addToCart() {
    const {
      product: {
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
        product_type_6s,
      },
      addProductToCart,
      showNotification,
    } = this.props;
    const { productStock } = this.state;

    if (!price[0]) {
      showNotification("error", __("Unable to add product to cart."));

      return;
    }

    const { selectedSizeType, selectedSizeCode, insertedSizeStatus } =
      this.state;
    const itemPrice = price[0][Object.keys(price[0])[0]]["6s_special_price"];
    const basePrice = price[0][Object.keys(price[0])[0]]["6s_base_price"];

    this.setState({ productAdded: true });
    var qid = new URLSearchParams(window.location.search).get("qid");
    let searchQueryId;
    if (!qid) {
      searchQueryId = getStore().getState().SearchSuggestions.queryID;
    } else {
      searchQueryId = qid;
    }
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
      const { size } = productStock[selectedSizeCode];
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
        itemPrice,
        searchQueryId
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

      // vue analytics
      const locale = VueIntegrationQueries.getLocaleFromUrl();
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_ADD_TO_CART,
        params: {
          event: VUE_ADD_TO_CART,
          pageType: "pdp",
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          uuid: getUUID(),
          referrer: window.location.href,
          url: window.location.href,
          sourceProdID: configSKU,
          sourceCatgID: product_type_6s, // TODO: replace with category id
          prodPrice: basePrice,
        },
      });
    }

    if (!insertedSizeStatus) {
      this.setState({ isLoading: true });
      const code = Object.keys(productStock);
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
        itemPrice,
        searchQueryId
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

      // vue analytics
      const locale = VueIntegrationQueries.getLocaleFromUrl();
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_ADD_TO_CART,
        params: {
          event: VUE_ADD_TO_CART,
          pageType: "pdp",
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          uuid: getUUID(),
          referrer: window.location.href,
          url: window.location.href,
          sourceProdID: configSKU,
          sourceCatgID: product_type_6s, // TODO: replace with category id
          prodPrice: basePrice,
        },
      });
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

  showAlertNotification(message) {
    this.props.showNotification("error", message);
  }

  render() {
    return (
      <PDPAddToCart {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDPAddToCartContainer);
