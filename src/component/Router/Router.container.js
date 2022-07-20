import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  mapDispatchToProps as sourceMapDispatchToProps,
  mapStateToProps as sourceMapStateToProps,
  RouterContainer as SourceRouterContainer,
  WishlistDispatcher,
} from "SourceComponent/Router/Router.container";
import { setCountry, setLanguage } from "Store/AppState/AppState.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { updateCustomerDetails, setEddResponse } from "Store/MyAccount/MyAccount.action";
import {
  deleteAuthorizationToken,
  deleteMobileAuthorizationToken,
  getAuthorizationToken,
  getMobileAuthorizationToken,
  isSignedIn,
  setAuthorizationToken,
  setMobileAuthorizationToken,
  setUUID,
  getUUID,
  setUUIDToken,
  getUUIDToken
} from "Util/Auth";
import { getCookie } from "Util/Url/Url";
import { v4 as uuidv4 } from "uuid";
import Algolia from "Util/API/provider/Algolia";

export const MyAccountDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapStateToProps = (state) => ({
  ...sourceMapStateToProps(state),
  locale: state.AppState.locale,
  addressCityData: state.MyAccountReducer.addressCityData,
  eddResponse: state.MyAccountReducer.eddResponse,
});

export const mapDispatchToProps = (dispatch) => ({
  ...sourceMapDispatchToProps(dispatch),
  init: async () => {
    const { default: wishlistDisp } = await WishlistDispatcher;
    wishlistDisp.syncWishlist(dispatch);
  },
  setCountry: (value) => dispatch(setCountry(value)),
  setEddResponse: (response, request) => dispatch(setEddResponse(response, request)),
  setLanguage: (value) => dispatch(setLanguage(value)),
  requestCustomerData: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch)
    ),
  getCitiesData: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.getCitiesData(dispatch)
    ),
  updateCustomerDetails: () => dispatch(updateCustomerDetails({})),
  getCart: (isNew = false) => CartDispatcher.getCart(dispatch, isNew),
});

export class RouterContainer extends SourceRouterContainer {

  constructor(props) {
    super(props);
    this.getAlgoliaIndex();
  }

  
  static propTypes = {
    ...SourceRouterContainer.propTypes,
    locale: PropTypes.string,
    requestCustomerData: PropTypes.func.isRequired,
    getCart: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ...SourceRouterContainer.defaultProps,
    locale: "",
  };

  componentDidMount() {
    const {
      getCart,
      requestCustomerData,
      updateCustomerDetails,
      requestPdpWidgetData,
      pdpWidgetsData,
      setEddResponse,
      eddResponse,
      addressCityData,
      getCitiesData
    } = this.props;
    const decodedParams = atob(getCookie("authData"));
    if (!getUUIDToken()) {
      setUUIDToken(uuidv4());
    }
    if (!getUUID()) {
      setUUID(uuidv4());
    }

    if (
      decodedParams.match("mobileToken") &&
      decodedParams.match("authToken")
    ) {
      const params = decodedParams.split("&").reduce((acc, param) => {
        acc[param.substr(0, param.indexOf("="))] = param.substr(
          param.indexOf("=") + 1
        );
        return acc;
      }, {});

      const { mobileToken } = params;
      const { authToken } = params;
      if (isSignedIn()) {
        if (
          getMobileAuthorizationToken() === mobileToken &&
          getAuthorizationToken() === authToken
        ) {
          requestCustomerData();
        } else {
          deleteAuthorizationToken();
          deleteMobileAuthorizationToken();
        }
      } else {
        setMobileAuthorizationToken(mobileToken);
        setAuthorizationToken(authToken);

        requestCustomerData().then(() => {
          window.location.reload();
        });
      }
      const QPAY_CHECK = JSON.parse(localStorage.getItem("QPAY_ORDER_DETAILS"));
      const TABBY_CHECK = JSON.parse(
        localStorage.getItem("TABBY_ORDER_DETAILS")
      );
      const now = new Date();
      if (
        (!QPAY_CHECK || now.getTime() >= QPAY_CHECK?.expiry) &&
        (!TABBY_CHECK || now.getTime() >= TABBY_CHECK?.expiry)
      ) {
        getCart(true);
      }
    } else {
      deleteAuthorizationToken();
      deleteMobileAuthorizationToken();
    }
    if (addressCityData.length === 0) {
      getCitiesData()
    }
    if (!eddResponse && sessionStorage.getItem('EddAddressReq')) {
      const response = sessionStorage.getItem('EddAddressRes') ? JSON.parse(sessionStorage.getItem('EddAddressRes')) : null
      const request = JSON.parse(sessionStorage.getItem('EddAddressReq'))
      setEddResponse(response, request)
    }
  }

  componentDidUpdate() {
    const countryCode = navigator.language.substr(0, 2);
    const currentLn = window.location.href.indexOf("://") + 3;
    const currentLang = window.location.href.substr(currentLn, 2);
    if (
      countryCode === "ar" &&
      currentLang !== countryCode &&
      window.location.pathname === "/superstars" &&
      window.location.href.indexOf("?_branch_match_id") > 0
    ) {
      const redirectPath = window.location.href
        .replace("en-", "ar-")
        .split("?")[0];
      window.location.href = redirectPath;
    }
    if (!getUUIDToken()) {
      setUUIDToken(uuidv4());
    }
  }

  async getAlgoliaIndex() {
    return await new Algolia().getIndex();
  }


  containerProps = () => {
    const { isBigOffline, setCountry, setLanguage } = this.props;

    return {
      isBigOffline,
      isAppReady: this.getIsAppReady(),
      setCountry,
      setLanguage,
    };
  };

  getIsAppReady() {
    const { locale } = this.props;

    return !!locale; // locale is '' => not ready
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterContainer);
