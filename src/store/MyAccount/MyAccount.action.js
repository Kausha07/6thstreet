export {
  UPDATE_CUSTOMER_SIGN_IN_STATUS,
  UPDATE_CUSTOMER_DETAILS,
  UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
  UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
  updateCustomerDetails,
  updateCustomerPasswordForgotStatus,
  updateCustomerPasswordResetStatus,
  updateCustomerSignInStatus,
} from "SourceStore/MyAccount/MyAccount.action";

export const SET_IS_MOBILE_TAB_ACTIVE = "SET_IS_MOBILE_TAB_ACTIVE";
export const SET_GUEST_USER_EMAIL = "SET_GUEST_USER_EMAIL";
export const SET_CUSTOMER_ADDRESS_DATA = "SET_CUSTOMER_ADDRESS_DATA";
export const SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS = "SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS";
export const SET_ADDRESS_LOADING_STATUS = "SET_ADDRESS_LOADING_STATUS";
export const SET_EDD_RESPONSE = "SET_EDD_RESPONSE";
export const SET_EDD_RESPONSE_FOR_PDP = "SET_EDD_RESPONSE_FOR_PDP";
export const SET_INTL_EDD_RESPONSE = "SET_INTL_EDD_RESPONSE";
export const SET_PDP_EDD_ADDRESS = "SET_PDP_EDD_ADDRESS";
export const SET_CITIES_DATA = "SET_CITIES_DATA";
export const SET_ADDRESS_LOADER = "SET_ADDRESS_LOADER";
export const SET_IS_CURRENT_TAB_ACTIVE = "SET_IS_CURRENT_TAB_ACTIVE";
export const SET_VUE_TRENDING_BRANDS_BANNER_ACTIVE = "SET_VUE_TRENDING_BRANDS_BANNER_ACTIVE";
export const SET_USER_ID_FOR_VUE_TRENDING_BRANDS = "SET_USER_ID_FOR_VUE_TRENDING_BRANDS";
export const SET_NEW_ADDRESS_CLICKED = "SET_NEW_ADDRESS_CLICKED";
export const SET_NEW_ADDRESS_SAVED ="SET_NEW_ADDRESS_SAVED";
export const SET_SELECTED_ADDRESS_ID = "SET_SELECTED_ADDRESS_ID";
export const SET_LAST_OFFSET_LIMIT_OF_MYORDERS =
  "SET_LAST_OFFSET_LIMIT_OF_MYORDERS";
export const SET_SIGNIN_IS_LOADING_STATUS = "SET_SIGNIN_IS_LOADING_STATUS";
export const SET_EXPRESS_SERVICE_AVAILABLE = "SET_EXPRESS_SERVICE_AVAILABLE";
export const SET_SELECTED_CITY_AREA = "SET_SELECTED_CITY_AREA";
export const SET_EXPRESS_CUTOFF_TIME = "SET_EXPRESS_CUTOFF_TIME";
export const SET_EXPRESS_POPUP_OPEN = "SET_EXPRESS_POPUP_OPEN";
export const SET_EXPRESS_PLP_ADDRESS_OPEN = "SET_EXPRESS_PLP_ADDRESS_OPEN";
export const SET_ADDRESS_DELETED = "SET_ADDRESS_DELETED";
export const SET_PREVIOUS_SELECTED_ADDRESS = "SET_PREVIOUS_SELECTED_ADDRESS";

export const setIsMobileTabActive = (isActive) => ({
  type: SET_IS_MOBILE_TAB_ACTIVE,
  isActive,
});

export const setIsCurrentTabActive = (currentTab) => ({
  type: SET_IS_CURRENT_TAB_ACTIVE,
  currentTab,
});

export const setAddressLoadingStatus = (isLoading) => ({
  type: SET_ADDRESS_LOADING_STATUS,
  isLoading,
});

export const updateGuestUserEmail = (guestUserEmail) => ({
  type: SET_GUEST_USER_EMAIL,
  guestUserEmail,
});

export const setCustomerAddressData = (addresses) => ({
  type: SET_CUSTOMER_ADDRESS_DATA,
  addresses,
});

export const setCitiesData = (citiesData) => ({
  type: SET_CITIES_DATA,
  citiesData,
});

export const setCustomerDefaultShippingAddress = (defaultaddress) => ({
  type: SET_CUSTOMER_DEFAULT_SHIPPING_ADDRESS,
  defaultaddress,
});

export const setEddResponse = (eddResponse, EddAddress) => {
  return ({
  type: SET_EDD_RESPONSE,
  eddResponse,
  EddAddress,
});
}

export const setEddResponseForPDP = (eddResponseForPDP, EddAddress) => ({
  type: SET_EDD_RESPONSE_FOR_PDP,
  eddResponseForPDP,
  EddAddress,
});

export const setIntlEddResponse = (eddResponse) => ({
  type: SET_INTL_EDD_RESPONSE,
  eddResponse,
});

export const setDefaultEddAddress = (defaultEddResponse, PdpEddAddress) => ({
  type: SET_PDP_EDD_ADDRESS,
  defaultEddResponse,
  PdpEddAddress,
});

export const setAddressLoader = (addressLoader) => ({
  type: SET_ADDRESS_LOADER,
  addressLoader,
});

export const setVueTrendingBrandsBannerActive = (isActive) => ({
  type: SET_VUE_TRENDING_BRANDS_BANNER_ACTIVE,
  isActive,
});

export const setUserIdForVueTrendingBrands = (userID) => ({
  type: SET_USER_ID_FOR_VUE_TRENDING_BRANDS,
  userID,
});
export const setNewAddressClicked = (addNewAddressClicked) => ({
  type: SET_NEW_ADDRESS_CLICKED,
  addNewAddressClicked,
});

export const setNewAddressSaved = (newAddressSaved) => ({
  type: SET_NEW_ADDRESS_SAVED,
  newAddressSaved,
});

export const setSelectedAddressID = (addressIDSelected) => ({
  type: SET_SELECTED_ADDRESS_ID,
  addressIDSelected,
});

export const setLastLimit = (limit) => ({
  type: SET_LAST_OFFSET_LIMIT_OF_MYORDERS,
  limit,
});

export const setSignInIsLoading = (isLoading) => ({
  type: SET_SIGNIN_IS_LOADING_STATUS,
  isLoading
})

export const setExpressServicable = (data) => ({
  type: SET_EXPRESS_SERVICE_AVAILABLE,
  data,
});

export const setSelectedCityArea = (data) => ({
  type: SET_SELECTED_CITY_AREA,
  data,
});

export const setExpressCutOffTime = (data) => ({
  type: SET_EXPRESS_CUTOFF_TIME,
  data,
});

export const setisExpressPopUpOpen = (val) => ({
  type: SET_EXPRESS_POPUP_OPEN,
  val,
});

export const setisExpressPLPAddressForm = (isExpressPLPAddressOpen) => ({
  type: SET_EXPRESS_PLP_ADDRESS_OPEN,
  isExpressPLPAddressOpen,
});

export const setAddressdeleted = (val) => ({
  type: SET_ADDRESS_DELETED,
  val,
});

export const setPrevSelectedAddressForPLPFilters = (val) => ({
  type: SET_PREVIOUS_SELECTED_ADDRESS,
  val,
})
