import { CUSTOMER } from "Store/MyAccount/MyAccount.dispatcher";
import { isSignedIn as isInitiallySignedIn } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { ONE_MONTH_IN_SECONDS } from "Util/Request/QueryDispatcher";

import {
  SET_IS_MOBILE_TAB_ACTIVE,
  SET_GUEST_USER_EMAIL,
  UPDATE_CUSTOMER_DETAILS,
  UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
  UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
  UPDATE_CUSTOMER_SIGN_IN_STATUS,
  SET_CUSTOMER_ADDRESS_DATA,
  SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS,
  SET_ADDRESS_LOADING_STATUS,
  SET_EDD_RESPONSE,
  SET_EDD_RESPONSE_FOR_PDP,
  SET_INTL_EDD_RESPONSE,
  SET_PDP_EDD_ADDRESS,
  SET_CITIES_DATA,
  SET_ADDRESS_LOADER,
  SET_IS_CURRENT_TAB_ACTIVE,
  SET_VUE_TRENDING_BRANDS_BANNER_ACTIVE,
  SET_USER_ID_FOR_VUE_TRENDING_BRANDS,
  SET_NEW_ADDRESS_CLICKED,
  SET_NEW_ADDRESS_SAVED,
  SET_SELECTED_ADDRESS_ID,
  SET_LAST_OFFSET_LIMIT_OF_MYORDERS,
  SET_SIGNIN_IS_LOADING_STATUS,
  SET_EXPRESS_SERVICE_AVAILABLE,
  SET_SELECTED_CITY_AREA,
  SET_EXPRESS_CUTOFF_TIME,
} from "./MyAccount.action";

export const initialState = {
  isSignedIn: isInitiallySignedIn(),
  passwordResetStatus: false,
  isPasswordForgotSend: false,
  customer: {},
  mobileTabActive: true,
  guestUserEmail: "",
  addresses: [],
  isAddressLoading: false,
  defaultShippingAddress: null,
  pdpEddAddressSelected: null,
  eddResponse: null,
  eddResponseForPDP: null,
  intlEddResponse: {},
  EddAddress: null,
  addressCityData: [],
  addressLoader: true,
  currentTabActive: true,
  VueTrendingBrandsEnable: false,
  vueTrendingBrandsUserID : null,
  addNewAddressClicked: false,
  newAddressSaved: false,
  addressIDSelected: null,
  myOrderLastOffsetLimit: {},
  isExpressServiceAvailable: false,
  currentSelectedCityArea: {},
  cutOffTime: null,
};

export const MyAccountReducer = (state = initialState, action) => {
  const {
    status,
    customer,
    guestUserEmail,
    addresses,
    isLoading,
    defaultaddress,
    eddResponse,
    eddResponseForPDP,
    EddAddress,
    PdpEddAddress,
    defaultEddResponse,
    citiesData,
  } = action;

  switch (action.type) {
    case UPDATE_CUSTOMER_SIGN_IN_STATUS:
      return {
        ...state,
        isSignedIn: status,
      };

    case SET_SIGNIN_IS_LOADING_STATUS: 
      return {
        ...state,
        isLoading
      }

    case SET_ADDRESS_LOADING_STATUS:
      return {
        ...state,
        isAddressLoading: isLoading,
      };

    case SET_GUEST_USER_EMAIL:
      return {
        ...state,
        guestUserEmail,
      };
    case SET_CUSTOMER_ADDRESS_DATA:
      return {
        ...state,
        addresses,
      };
    case SET_CITIES_DATA:
      return {
        ...state,
        addressCityData: citiesData,
      };
    case SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS:
      return {
        ...state,
        defaultShippingAddress: defaultaddress,
      };
    case SET_EDD_RESPONSE:
      return {
        ...state,
        eddResponse: eddResponse,
        EddAddress: EddAddress,
      };
    case SET_EDD_RESPONSE_FOR_PDP:
      return {
        ...state,
        eddResponseForPDP: eddResponseForPDP,
        EddAddress: EddAddress,
      };
    case SET_INTL_EDD_RESPONSE:
      return {
        ...state,
        intlEddResponse: eddResponse,
      };
    case SET_PDP_EDD_ADDRESS:
      return {
        ...state,
        pdpEddAddressSelected: PdpEddAddress,
        defaultEddResponse: defaultEddResponse,
      };
    case UPDATE_CUSTOMER_PASSWORD_RESET_STATUS:
      return {
        ...state,
        passwordResetStatus: status,
      };

    case UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS:
      return {
        ...state,
        isPasswordForgotSend: !state.isPasswordForgotSend,
      };

    case UPDATE_CUSTOMER_DETAILS:
      const { firstname = "", lastname = "" } = customer;
      const data =
        firstname || lastname
          ? {
              ...customer,
              firstname:
                firstname.indexOf(" ") > 0
                  ? firstname.substr(0, firstname.indexOf(" "))
                  : firstname,
              lastname:
                firstname.indexOf(" ") > 0
                  ? firstname.substr(firstname.indexOf(" ") + 1)
                  : lastname,
            }
          : customer;

      BrowserDatabase.setItem(data, CUSTOMER, ONE_MONTH_IN_SECONDS);

      return {
        ...state,
        customer: data,
      };

    case SET_IS_MOBILE_TAB_ACTIVE:
      const { isActive } = action;

      return {
        ...state,
        mobileTabActive: isActive,
      };

    case SET_IS_CURRENT_TAB_ACTIVE:
      const { currentTab } = action;

      return {
        ...state,
        currentTabActive: currentTab,
      };

    case SET_ADDRESS_LOADER:
      const { addressLoader } = action;
      return {
        ...state,
        addressLoader,
      };

    case SET_VUE_TRENDING_BRANDS_BANNER_ACTIVE:
      const { isActive : VueTrendingBannerEnabled  } = action;

      return {
        ...state,
        VueTrendingBrandsEnable: VueTrendingBannerEnabled,
      };

    case SET_USER_ID_FOR_VUE_TRENDING_BRANDS:
      const { userID  } = action;

      return {
        ...state,
        vueTrendingBrandsUserID: userID,
      };
    case SET_NEW_ADDRESS_CLICKED:
    const { addNewAddressClicked } = action;
    return {
      ...state,
      addNewAddressClicked,
    };

    case SET_NEW_ADDRESS_SAVED:
      const { newAddressSaved } = action;
    return {
      ...state,
      newAddressSaved,
    };
    
    case SET_SELECTED_ADDRESS_ID:
      const { addressIDSelected } = action;
    return {
      ...state,
      addressIDSelected,
    };

    case SET_LAST_OFFSET_LIMIT_OF_MYORDERS:
      const { limit } = action;
    return {
      ...state,
      myOrderLastOffsetLimit: limit,
    };

    case SET_EXPRESS_SERVICE_AVAILABLE:
      const { data: expressAvailable } = action;
      return {
        ...state,
        isExpressServiceAvailable: expressAvailable,
      };

    case SET_SELECTED_CITY_AREA:
      const { data: cityAreaObj } = action;

      return {
        ...state,
        currentSelectedCityArea: cityAreaObj,
      };

    case SET_EXPRESS_CUTOFF_TIME:
      const { data: cutOfftime } = action;

      return {
        ...state,
        cutOffTime: cutOfftime,
      };
  
    default:
      return state;
  }
};

export default MyAccountReducer;
