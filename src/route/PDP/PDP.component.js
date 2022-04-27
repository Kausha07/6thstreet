/* eslint-disable fp/no-let */
/* eslint-disable max-len */
import PDPDetail from "Component/PDPDetail";
import PDPDetailsSection from "Component/PDPDetailsSection";
import PDPMainSection from "Component/PDPMainSection";
import PDPMixAndMatch from "Component/PDPMixAndMatch";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import NoMatch from "Route/NoMatch";
import "./PDP.style";
import MyAccountOverlay from "Component/MyAccountOverlay";
import isMobile from "Util/Mobile";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import Loader from "Component/Loader";
import { connect } from "react-redux";
import address from "./icons/address.png";
import addressBlack from "./icons/address_black.png";
import Image from "Component/Image";
import { isArabic } from "Util/App";
import { DEFAULT_MESSAGE } from "../../component/Header/Header.config";
import { getCountryFromUrl } from "Util/Url/Url";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddDate } from "Util/Date/index";
import { isSignedIn } from "Util/Auth";

export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  EddResponse: state.MyAccountReducer.EddResponse,
  addressCityData: state.MyAccountReducer.addressCityData,
  edd_info: state.AppConfig.edd_info,
});

export const mapDispatchToProps = (dispatch) => ({
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
  estimateEddResponse: (request) =>
    MyAccountDispatcher.estimateEddResponse(dispatch, request)
});

class PDP extends PureComponent {
  static propTypes = {
    nbHits: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  state = {
    signInPopUp: "",
    isArabic: isArabic(),
    showPopup: false,
    isMobile: isMobile.any() || isMobile.tablet(),
    showCityDropdown: false,
    showAreaDropDown: false,
    selectedCityId: null,
    selectedAreaId: null,
    selectedArea: null,
    selectedCityArea: null,
    selectedCity: null,
    showPopupField: "",
    countryCode: null,
    Cityresponse: null,
  };

  getIdFromCityArea = (addressCityData, city, area) => {
    let cityEntry;
    let areaEntry;
    const { isArabic } = this.state
    Object.values(addressCityData).filter((entry) => {
      if (entry.city === city || entry.city_ar === city) {
        cityEntry = isArabic ? entry.city_ar : entry.city;
        if (entry.city === city) {
          Object.values(entry.areas).filter((cityArea, index) => {
            if (cityArea === area) {
              areaEntry = isArabic ? entry.areas_ar[index] : entry.areas[index];
            }
          });
        } else {
          Object.values(entry.areas_ar).filter((cityArea) => {
            if (cityArea === area) {
              areaEntry = isArabic ? entry.areas[index] : entry.areas_ar[index];
            }
          });
        }
      }
    });
    return { cityEntry, areaEntry }
  }

  getCityAreaFromStorage = (addressCityData, countryCode) => {
    const sessionData = JSON.parse(sessionStorage.getItem('EddAddressReq'))
    const { city, area } = sessionData
    const { cityEntry, areaEntry } = this.getIdFromCityArea(addressCityData, city, area)
    this.setState({
      Cityresponse: addressCityData,
      selectedCity: cityEntry,
      selectedCityId: cityEntry,
      selectedAreaId: areaEntry,
      selectedArea: areaEntry,
      countryCode: countryCode,
    });
    return { cityEntry, areaEntry }
  }
  getCityAreaFromDefault = (addressCityData, countryCode) => {
    const { defaultShippingAddress } = this.props;
    const { area, city } = defaultShippingAddress;
    const { cityEntry, areaEntry } = this.getIdFromCityArea(addressCityData, city, area)
    this.setState({
      Cityresponse: addressCityData,
      selectedCity: cityEntry,
      selectedCityId: cityEntry,
      selectedAreaId: areaEntry,
      selectedArea: areaEntry,
      countryCode: countryCode,
    });
    return { cityEntry, areaEntry }

  }
  validateEddStatus = () => {
    const countryCode = getCountryFromUrl();
    const { defaultShippingAddress, addressCityData } = this.props;
    if (isSignedIn() && defaultShippingAddress) {
      this.getCityAreaFromDefault(addressCityData, countryCode)
    } else if (isSignedIn() && !defaultShippingAddress && sessionStorage.getItem('EddAddressReq')) {
      this.getCityAreaFromStorage(addressCityData, countryCode)
    } else if (!isSignedIn() && sessionStorage.getItem('EddAddressReq')) {
      this.getCityAreaFromStorage(addressCityData, countryCode)
    }
    else {
      this.setState({
        Cityresponse: addressCityData,
        countryCode: countryCode,
      });
    }
  }
  componentDidMount() {
    const countryCode = getCountryFromUrl();
    const { edd_info } = this.props;
    if (edd_info && edd_info.is_enable) {
      this.validateEddStatus(countryCode)
    } else {
      this.setState({
        countryCode: countryCode,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { defaultShippingAddress, estimateEddResponse, addressCityData, edd_info } = this.props;
    const { defaultShippingAddress: prevdefaultShippingAddress, addressCityData: prevCitiesData } = prevProps;
    if (prevCitiesData && addressCityData && prevCitiesData.length !== addressCityData.length) {
      this.setState({
        Cityresponse: addressCityData,
      })
      this.validateEddStatus()
    }
    if (
      JSON.stringify(prevdefaultShippingAddress) !==
      JSON.stringify(defaultShippingAddress)
    ) {
      const { country_code, area, city } = defaultShippingAddress;

      if (edd_info && edd_info.is_enable) {
        const { cityEntry, areaEntry } = this.getIdFromCityArea(addressCityData, city, area)
        this.setState(
          {
            Cityresponse: addressCityData,
            selectedCity: cityEntry,
            selectedCityId: cityEntry,
            selectedAreaId: areaEntry,
            selectedArea: areaEntry,
          },
          () => {
            let request = {
              country: country_code,
              city: city,
              area: area,
              courier: null,
              source: null,
            };
            estimateEddResponse(request);
          }
        );
      }
    }
  }

  showMyAccountPopup = () => {
    this.setState({ showPopup: true });
  };

  closePopup = () => {
    this.setState({ signInPopUp: "", showPopup: false });
  };

  onSignIn = () => {
    this.closePopup();
  };

  onPDPPageClicked = () => {
    const { showPDPSearch, displaySearch } = this.props;
    if (displaySearch) {
      showPDPSearch(false);
    }
  };
  renderMySignInPopup() {
    const { showPopup } = this.state;
    if (!showPopup) {
      return null;
    }
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }
  renderMainSection() {
    return (
      <PDPMainSection
        renderMySignInPopup={this.showMyAccountPopup}
        {...this.props}
      />
    );
  }

  renderDetailsSection() {
    return (
      <PDPDetailsSection
        {...this.props}
        renderMySignInPopup={this.showMyAccountPopup}
      />
    );
  }

  renderMixAndMatchSection() {
    return <PDPMixAndMatch renderMySignInPopup={this.showMyAccountPopup} />;
  }

  renderDetail() {
    const { isMobile } = this.state;
    if (isMobile) {
      return null;
    }
    return <PDPDetail {...this.props} />;
  }

  renderSeperator() {
    const { isMobile } = this.state;
    return <div block="Seperator" mods={{ isMobile: !!isMobile }} />;
  }

  closeAreaOverlay = () => {
    const { showCityDropdown } = this.state;
    document.body.style.overflow = "visible";
    this.setState({
      showCityDropdown: !showCityDropdown,
      showAreaDropDown: false,
    });
  };

  handleAreaDropDownClick = () => {
    const { showCityDropdown, isMobile } = this.state;
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
    this.setState({
      showCityDropdown: !showCityDropdown,
      showAreaDropDown: false,
      showPopupField: "city",
    });
  };

  handleAreaSelection = (area) => {
    const { selectedCity, countryCode, isArabic } = this.state;
    const { estimateEddResponse } = this.props;
    this.setState({
      selectedAreaId: area,
      selectedArea: area,
      showCityDropdown: false,
      showPopupField: "",
    });
    this.handleAreaDropDownClick();
    let request = {
      country: countryCode,
      city: selectedCity,
      area: area,
      courier: null,
      source: null,
    };
    estimateEddResponse(request);
    document.body.style.overflow = "visible";
  };

  handleCitySelection = (city) => {
    const { isArabic } = this.state;
    this.setState({
      showPopupField: "area",
      selectedCityId: isArabic ? city.city_ar : city.city,
      selectedCity: isArabic ? city.city_ar : city.city,
      selectedCityArea: isArabic ? city.areas_ar : city.areas,
      showAreaDropDown: true,
    })
  }

  renderSelectAreaItem() {
    const { selectedCityArea, isArabic } = this.state;
    const isArea =
      selectedCityArea && selectedCityArea.length > 0;
    return (
      <ul>
        {isArea ? (
          selectedCityArea.map((area) => {
            return (
              <li
                id={area}
                onClick={() => this.handleAreaSelection(area)}
              >
                <button
                  block={`CountrySwitcher`}
                  elem="CountryBtn"
                  mods={{ isArabic, isArea }}
                >
                  <span>
                    {area}
                  </span>
                </button>
              </li>
            );
          })
        ) : (
          <span block="NoAreaFound">No Area Found</span>
        )}
      </ul>
    );
  }
  renderSelectCityItem() {
    const { Cityresponse, isArabic } = this.state;
    if (!Cityresponse) {
      return (
        <ul>
          <span block="NoAreaFound">No City Found</span>
        </ul>
      );
    }
    return (
      <ul>
        {Object.values(Cityresponse).map((city) => {
          return (
            <li
              id={city.city_id}
              onClick={
                () => this.handleCitySelection(city)
              }
            >
              <button
                block={`CountrySwitcher`}
                elem="CountryBtn"
                mods={{ isArabic }}
              >
                <span>
                  {isArabic ? city.city_ar : city.city}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
  renderMobileSelectCity() {
    const { isArabic, showPopupField } = this.state;
    return (
      <div block="EddMobileWrapper">
        <div mix={{ block: "EddMobileWrapper", elem: "Content" }}>
          <div
            mix={{ block: "EddMobileWrapper-Content", elem: "EddBackHeader" }}
          >
            <button
              elem="Button"
              block="MyAccountMobileHeader"
              onClick={this.closeAreaOverlay}
              mods={{ isArabic }}
            />
          </div>
          <div
            mix={{
              block: "EddMobileWrapper-Content",
              elem: "EddContentHeader",
            }}
          >
            <div
              block="CityText ContentText"
              mods={{ isShown: showPopupField === "city" ? true : false }}
              onClick={() => this.setState({ showPopupField: "city" })}
            >
              <span>Select City</span>
            </div>
            <div
              block="ContentText"
              mods={{ isShown: showPopupField === "area" ? true : false }}
            >
              <span>Select Area</span>
            </div>
          </div>

          {showPopupField === "city" && (
            <div block="CityDrop">{this.renderSelectCityItem()}</div>
          )}
          {showPopupField === "area" && (
            <div block="CityDrop">{this.renderSelectAreaItem()}</div>
          )}
        </div>
      </div>
    );
  }
  renderSelectCity() {
    const {
      showCityDropdown,
      showAreaDropDown,
      selectedCityArea,
      selectedAreaId,
      selectedArea,
      isMobile,
      isArabic,
    } = this.state;
    const {
      defaultEddDateString,
      defaultEddDay,
      defaultEddMonth,
      defaultEddDat,
    } = getDefaultEddDate(2);
    const { EddResponse } = this.props;
    let ActualEddMess = "";
    let ActualEdd = "";
    if (EddResponse) {
      if (isObject(EddResponse)) {
        Object.values(EddResponse).filter((entry) => {
          if (entry.source === "pdp" && entry.featute_flag_status === 1) {
            ActualEddMess = isArabic
              ? entry.edd_message_ar
              : entry.edd_message_en;
            ActualEdd = entry.edd_date;
          }
        });
      } else {
        ActualEddMess = `${DEFAULT_MESSAGE} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
        ActualEdd = defaultEddDateString;
      }
    } else {
      ActualEddMess = `${DEFAULT_MESSAGE} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
      ActualEdd = defaultEddDateString;
    }

    const isArea = !(
      selectedCityArea && Object.values(selectedCityArea).length > 0
    );
    if (isMobile && showCityDropdown) {
      return this.renderMobileSelectCity();
    }
    return (
      <div block="EddWrapper">
        {selectedAreaId ? (
          <div
            block="EddWrapper SelectedAreaWrapper"
            mods={{ isArabic }}
            onClick={() => this.handleAreaDropDownClick()}
          >
            <Image lazyLoad={false} src={addressBlack} alt="" />
            <div block="SelectAreaText">{selectedArea}</div>
          </div>
        ) : (
          <div
            block="EddWrapper"
            elem="AreaButton"
            mods={{ isArabic }}
            onClick={() => this.handleAreaDropDownClick()}
          >
            <Image lazyLoad={false} src={address} alt="" />
            <div block="SelectAreaText">Select Area</div>
          </div>
        )}
        {ActualEddMess &&
          <div mix={{ block: "EddWrapper", elem: "AreaText" }}>
            <span>{ActualEddMess}</span>
          </div>

          // <div mix={{ block: "EddWrapper", elem: "AreaText" }}>
          //   {isArabic
          //     ? "حدد للتحقق من تاريخ التسليم"
          //     : "Select to check delivery date"}
          // </div>
        }

        <div block="DropDownWrapper">
          {showCityDropdown && !isMobile && (
            <div mix={{ block: "EddWrapper", elem: "CountryDrop" }}>
              {this.renderSelectCityItem()}
            </div>
          )}
          {showCityDropdown && showAreaDropDown && !isMobile && (
            <div
              block="AreaDropdown"
              mix={{
                block: "EddWrapper",
                elem: "CountryDrop",
                mods: { isArea, isArabic },
              }}
            >
              {this.renderSelectAreaItem()}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderPDP() {
    const { nbHits, isLoading, product: { cross_border = 0 } } = this.props;
    const { Cityresponse } = this.state;
    if (!isLoading && nbHits === 1) {
      return (
        <div block="PDP" onClick={this.onPDPPageClicked}>
          {this.renderMySignInPopup()}
          {this.renderMainSection()}
          {Cityresponse && cross_border === 0 && this.renderSelectCity()}
          {this.renderSeperator()}
          {this.renderMixAndMatchSection()}
          {this.renderDetailsSection()}
          {this.renderDetail()}
        </div>
      );
    } else if (!isLoading && nbHits < 1) {
      return <NoMatch />;
    }

    return <Loader isLoading={isLoading} />;
  }

  render() {
    return this.renderPDP();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDP);
