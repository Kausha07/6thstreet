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
import Loader from "Component/Loader";
import { connect } from "react-redux";
import address from "./icons/address.png";
import addressBlack from "./icons/address_black.png";
import Image from "Component/Image";
import { isArabic } from "Util/App";

export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch,
});

export const mapDispatchToProps = (dispatch) => ({
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
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
    showPopupField: "",
    Countryresponse: {
      responseCode: "OK",
      success: true,
      errorMessage: null,
      result: [
        {
          city_id: 1,
          city_name_en: "Dubai",
          city_name_ar: "",
          area_list: null,
        },
        {
          city_id: 2,
          city_name_en: "Abu Dhabi",
          city_name_ar: "",
          area_list: [
            {
              area_id: 1,
              area_name_en: "Abu Dhabi Golf Club",
              area_name_ar: "",
            },
            {
              area_id: 2,
              area_name_en: "Abu Dhabi International Airport",
              area_name_ar: "",
            },
            {
              area_id: 3,
              area_name_en: "Abu Dhabi Mall",
              area_name_ar: "",
            },
          ],
        },
      ],
    },
  };

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

  renderSelectAreaItem() {
    const { selectedCityArea } = this.state;
    const isArea =
      selectedCityArea && Object.values(selectedCityArea).length > 0;
    return (
      <ul>
        {isArea ? (
          Object.values(selectedCityArea).map((area) => {
            return (
              <li
                id={area.area_id}
                onClick={() => {
                  this.setState({
                    selectedAreaId: area.area_id,
                    selectedArea: isArabic()
                      ? area.area_name_ar
                      : area.area_name_en,
                    showCityDropdown: false,
                    showPopupField: "",
                  });
                  this.handleAreaDropDownClick();
                }}
              >
                <button block={`CountrySwitcher`} elem="CountryBtn">
                  <span>
                    {isArabic() ? area.area_name_ar : area.area_name_en}
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
    const { Countryresponse } = this.state;
    return (
      <ul>
        {Object.values(Countryresponse.result).map((city) => {
          return (
            <li
              id={city.city_id}
              onClick={() =>
                this.setState({
                  showPopupField: "area",
                  selectedCityId: city.city_id,
                  selectedCityArea: city.area_list,
                  showAreaDropDown: true,
                })
              }
            >
              <button block={`CountrySwitcher`} elem="CountryBtn">
                <span>
                  {isArabic() ? city.city_name_ar : city.city_name_en}
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
      <div block="EDDMobileWrapper">
        <div mix={{ block: "EDDMobileWrapper", elem: "Content" }}>
          <div
            mix={{ block: "EDDMobileWrapper-Content", elem: "EDDBackHeader" }}
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
              block: "EDDMobileWrapper-Content",
              elem: "EDDContentHeader",
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
    } = this.state;

    const isArea = !(
      selectedCityArea && Object.values(selectedCityArea).length > 0
    );
    if (isMobile && showCityDropdown) {
      return this.renderMobileSelectCity();
    }
    return (
      <div block="EDDWrapper">
        {selectedAreaId ? (
          <div
            block="EDDWrapper SelectedAreaWrapper"
            onClick={() => this.handleAreaDropDownClick()}
          >
            <Image lazyLoad={false} src={addressBlack} alt="" />
            <div block="SelectAreaText">{selectedArea}</div>
          </div>
        ) : (
          <div
            mix={{ block: "EDDWrapper", elem: "AreaButton" }}
            onClick={() => this.handleAreaDropDownClick()}
          >
            <Image lazyLoad={false} src={address} alt="" />
            <div block="SelectAreaText">Select Area</div>
          </div>
        )}

        <div mix={{ block: "EDDWrapper", elem: "AreaText" }}>
          Select to check delivery date
        </div>
        <div block="DropDownWrapper">
          {showCityDropdown && !isMobile && (
            <div mix={{ block: "EDDWrapper", elem: "CountryDrop" }}>
              {this.renderSelectCityItem()}
            </div>
          )}
          {showCityDropdown && showAreaDropDown && !isMobile && (
            <div
              block="AreaDropdown"
              mix={{
                block: "EDDWrapper",
                elem: "CountryDrop",
                mods: { isArea },
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
    const { nbHits, isLoading } = this.props;
    const { isMobile } = this.state;
    if (!isLoading && nbHits === 1) {
      return (
        <div block="PDP" onClick={this.onPDPPageClicked}>
          {this.renderMySignInPopup()}
          {this.renderMainSection()}
          {this.renderSelectCity()}
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
