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
import { connect } from "react-redux";
import { isArabic } from "Util/App";
import { VUE_PAGE_VIEW } from "Util/Event";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { getUUID } from "Util/Auth";
import Event, {
  EVENT_GTM_AUTHENTICATION,
  EVENT_SIGN_IN_SCREEN_VIEWED,
} from "Util/Event";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";

export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch,
  prevPath: state.PLP.prevPath,
});

export const mapDispatchToProps = (dispatch) => ({
  getTabbyInstallment: (price) =>
    CheckoutDispatcher.getTabbyInstallment(dispatch, price),
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
    showPopupField: "",
  };

  componentDidMount() {
    this.renderVueHits();
  }
  showMyAccountPopup = () => {
    const { showPopup } = this.state;
    this.setState({ showPopup: true });
    const popupEventData = {
      name: EVENT_SIGN_IN_SCREEN_VIEWED,
      category: "user_login",
      action: EVENT_SIGN_IN_SCREEN_VIEWED,
      popupSource: "Wishlist",
    };
    if (showPopup) {
      Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
    }
  };

  closePopup = () => {
    this.setState({ signInPopUp: "", showPopup: false });
  };

  onSignIn = () => {
    this.closePopup();
  };

  addTabbyPromo = (total, currency_code) => {
    const { isArabic } = this.state;
    new window.TabbyPromo({
      selector: "#TabbyPromo",
      currency: currency_code?.toString(),
      price: total,
      installmentsCount: 4,
      lang: isArabic ? "ar" : "en",
      source: "product",
    });
  };

  TabbyInstallment = (defPrice, currency) => {
    const { getTabbyInstallment } = this.props;
    getTabbyInstallment(defPrice)
      .then((response) => {
        if (response?.value) {
          this.addTabbyPromo(defPrice, currency);
        } else {
          document.getElementById("TabbyPromo").classList.add("d-none");
        }
      }, this._handleError)
      .catch(() => {});
  };

  renderVueHits() {
    const { prevPath = null, dataForVueCall = {} } = this.props;
    const locale = VueIntegrationQueries?.getLocaleFromUrl();
    VueIntegrationQueries?.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "pdp",
        currency: VueIntegrationQueries?.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath,
        url: window.location.href,
        sourceProdID: dataForVueCall?.sourceProdID,
        sourceCatgID: dataForVueCall?.sourceCatgID, // TODO: replace with category id
        prodPrice: dataForVueCall?.prodPrice,
      },
    });
  }

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
        TabbyInstallment={this.TabbyInstallment}
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

  renderPDP() {
    return (
      <div block="PDP" onClick={this.onPDPPageClicked}>
        {this.renderMySignInPopup()}
        {this.renderMainSection()}
        {this.renderSeperator()}
        {this.renderMixAndMatchSection()}
        {this.renderDetailsSection()}
        {this.renderDetail()}
      </div>
    );
  }

  renderLabelAnimation() {
    return (
      <>
        <div className="PDP-AnimationWrapper">
          <div block="PDP" elem="MainSection">
            <div block="animation" elem="Gallery">
              <div block="Gallery" elem="crumbs">
                <div block="card"></div>
                <div block="card"></div>
                <div block="card"></div>
                <div block="card"></div>
                <div block="card"></div>
              </div>
              <div block="Gallery" elem="image">
                <div block="card"></div>
              </div>
            </div>

            <div block="animation" elem="Summary">
              <div block="icons">
                <div block="miniCards card" ></div>
                <div block="miniCards card"></div>
              </div>
              <div block="title summaryCard card"></div>
              <div block="addToCartBtn summaryCard card"></div>
            </div>
          </div>
          <div block="card PDP" elem="line"></div>
          <div block="PDP" elem="detailsSection">
              <div block="card title"></div>
              <div block="Icons">
                <div block="icons card"></div>
                <div block="icons card"></div>
              </div>
              <div block="detailWrapper">
                <div block="detailInner card"></div>
                <div block="detailInner card"></div>
              </div>
              <div block="card detailWrapper" elem="Btn"></div>
          </div>
          <div block="card PDP" elem="line"></div>
          <div block="PDP" elem="brandDetail">
            <div block="card image"></div>
            <div block="content">
              <div block="card text"></div>
              <div block="card moreBtn"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  render() {
    const { isLoading, product, nbHits } = this.props;
    if (isLoading) {
      return this.renderLabelAnimation();
    } else if (!isLoading && nbHits > 0 && product) {
      return this.renderPDP();
    } else if (
      !isLoading &&
      (!nbHits || nbHits === 0) &&
      Object.keys(product)?.length === 0
    ) {
      return <NoMatch />;
    } else {
      return this.renderLabelAnimation();
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDP);