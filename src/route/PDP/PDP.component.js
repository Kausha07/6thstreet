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
import { renderDynamicMetaTags } from "Util/Meta/metaTags";
import { getPdpSectionConfig } from 'Util/API/endpoint/Config/Config.endpoint';

export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch,
  prevPath: state.PLP.prevPath,
  isNewDesign: state.AppConfig?.vwoData?.NewPDP?.isFeatureEnabled || false
});

export const mapDispatchToProps = (dispatch) => ({
  getTabbyInstallment: (price) =>
    CheckoutDispatcher.getTabbyInstallment(dispatch, price),
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
    gnisNewDesign:(isNew) => PDPDispatcher.getIsNewDesign(dispatch,isNew)

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
    PDPJSON:[]
  };



  componentDidMount() {
    this.renderVueHits();
    this.renderPDPPageSection();
  
    
  }

  async renderPDPPageSection(){
    try{
      const response =  await getPdpSectionConfig();
      this.setState({
        PDPJSON:response.data
      });
      // this.props.gnisNewDesign(response.newDesign);
    } catch (e) {
      Logger.log(e);
    }
    
}


  showMyAccountPopup = (successCallback) => {
    const { showPopup } = this.state;
    this.setState({ showPopup: true, successCallback:successCallback });
    const popupEventData = {
      name: EVENT_SIGN_IN_SCREEN_VIEWED,
      category: "user_login",
      action: EVENT_SIGN_IN_SCREEN_VIEWED,
    };
    if (showPopup) {
      Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
    }
  };

  closePopup = () => {
    this.setState({ signInPopUp: "", showPopup: false });
    this.state.successCallback && this.state.successCallback()
  };

  onSignIn = () => {
    this.closePopup();
  };

  addTabbyPromo = (total, currency_code) => {
    const { isArabic } = this.state;
    try {
      new window.TabbyPromo({
        selector: "#TabbyPromo",
        currency: currency_code?.toString(),
        price: total,
        installmentsCount: 4,
        lang: isArabic ? "ar" : "en",
        source: "product",
      });
    } catch (error) {
      // if error - then wait for TabbyPromo object to be load then try again
      setTimeout(()=>{this.addTabbyPromo(total, currency_code)}, 500); 
    }
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
  renderMainSection(val) {
    return (
      <PDPMainSection
        renderMainSection={val}
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
  renderMetaData() {
    const { product, metaTitle, metaDesc } = this.props;
    const imageURL = product?.thumbnail_url
      ? product.thumbnail_url
      : product?.gallery_images && product?.gallery_images[0]
      ? product.gallery_images[0]
      : null;
    const altText =
      product?.name && product?.brand_name
        ? `${product?.brand_name} ${product?.name}`
        : product?.name;
    if (imageURL) {
      return renderDynamicMetaTags(metaTitle, metaDesc, imageURL, altText);
    }
  }
  

  renderPDP() {
    const {PDPJSON} = this.state;
    const {isNewDesign} = this.props;
    return (
      <>
        {this.renderMetaData()}
        <div block={`PDP ${isNewDesign ? '_newDesign':''}`} onClick={this.onPDPPageClicked}>
          {
            PDPJSON.map((data, index) => {
              
                if(data.name === 'renderMySignInPopup'){
                  return this.renderMySignInPopup()
                }
                if(data.name === 'renderMainSection'){
                  return this.renderMainSection(data.sectionData)
                }
                 if(data.name === 'renderSeperator'){
                    return this.renderSeperator()
                  }
                  if(data.name === 'renderMixAndMatchSection'){
                    return this.renderMixAndMatchSection()
                  }
                  if(data.name === 'renderDetailsSection'){
                    return this.renderDetailsSection()
                  }
                  if(data.name === 'renderDetail'){
                    return this.renderDetail()
                  }
            })
           }
          {/* {this.loadPDPMoreFunction()} */}
          {/* {this.renderMySignInPopup()}
          {this.renderMainSection()}
          {this.renderSeperator()}
          {this.renderMixAndMatchSection()}
          {this.renderDetailsSection()}
          {this.renderDetail()} */}
        </div>
      </>
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