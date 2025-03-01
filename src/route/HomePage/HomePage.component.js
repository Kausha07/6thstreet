import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from 'react-redux';

import DynamicContent from "Component/DynamicContent";
import LoginBlockContainer from "Component/LoginBlock";
import { DynamicContent as DynamicContentType } from "Util/API/endpoint/StaticFiles/StaticFiles.type";
import MyAccountOverlay from "Component/MyAccountOverlay";
import SignInSignUpMobileNudge from "../../component/SignInSignupNudge/SignInSignUpMobileNudge";
import Event, {
  EVENT_GTM_AUTHENTICATION,
  EVENT_SIGN_IN_SCREEN_VIEWED,
} from "Util/Event";
import {
  MOE_addUserAttribute,
  MOE_addMobile,
  MOE_addEmail,
  MOE_AddUniqueID,
  MOE_AddFirstName,
  MOE_addLastName,
} from "Util/Event";
import "./HomePage.style";
import { renderDynamicMetaTags } from "Util/Meta/metaTags";
import { Helmet } from "react-helmet";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
});

class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      signInPopUp: "",
      showPopup: false,
    };
  }
  static propTypes = {
    dynamicContent: DynamicContentType.isRequired,
    isLoading: PropTypes.bool.isRequired,
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

  renderMySignInPopup() {
    const { showPopup } = this.state;
    if (!showPopup) {
      return null;
    }
    const popupEventData = {
      name: EVENT_SIGN_IN_SCREEN_VIEWED,
      category: "user_login",
      action: EVENT_SIGN_IN_SCREEN_VIEWED,
    };
    Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }

  componentDidMount() {
    const { customer } = this.props;
    
    if(customer?.firstname) MOE_AddFirstName(customer?.firstname);
    if(customer?.lastName) MOE_addLastName(customer?.lastName);
    if(customer?.email) MOE_addEmail(customer?.email?.toLowerCase());
    if(customer?.email) MOE_AddUniqueID(customer?.email?.toLowerCase());
    if(customer?.phone) MOE_addMobile(customer?.phone );
    if(customer?.dob) MOE_addUserAttribute("Birthdate", customer?.dob);
  }

  componentDidUpdate() {
    const DynamicContent = document.getElementsByClassName("DynamicContent")[0];
    if (DynamicContent) {
      const { children = [] } = DynamicContent;
      const { href } = location;

      if (children) {
        // eslint-disable-next-line
        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeName === "HR") {
            children[i].style.backgroundColor = "#EFEFEF";
            children[i].style.height = "1px";
          } else if (
            children[i].className === "DynamicContentBanner" &&
            children[i].children[0] &&
            children[i].children[0].href !== `${href}#`
          ) {
            children[i].style.maxHeight = `${children[i].dataset.maxHeight}px`;
            children[i].style.maxWidth = `${children[i].dataset.maxWidth}px`;
            children[i].style.display = "inline-block";
          }
        }
      }
    }
  }

  appendSchemaData() {
    const pageUrl = new URL(window.location.href);
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: `${pageUrl.origin}/`,
      potentialAction: {
        "@type": "SearchAction",
        target: `${pageUrl.origin}/catalogsearch/result/?q={search_term_string}&utm_source=google_search_action&utm_medium=organic`,
        "query-input": "required name=search_term_string",
      },
    };
    return JSON.stringify(schemaData);
  }

  renderDynamicContent() {
    const { dynamicContent, vue_trending_brands = [],vue_trending_categories = [],gender, setLastTapItem } = this.props;

    return (
      <DynamicContent
        gender={gender}
        setLastTapItemOnHome={setLastTapItem}
        content={dynamicContent}
        renderMySignInPopup={this.showMyAccountPopup}
        trendingBrands={vue_trending_brands}
        trendingCategories={vue_trending_categories}
      />
    );
  }

  renderLoginBlock() {
    return <LoginBlockContainer />;
  }

  renderLoading() {
    return (
      <>
        {this.renderBannerAnimation()}
        {this.renderDynamiContentWithLabelAnimation()}
      </>
    );
  }

  renderBannerAnimation() {
    return <div block="AnimationWrapper"></div>;
  }
  renderDynamiContentWithLabelAnimation() {
    return (
      <div block="Wrapper">
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
      </div>
    );
  }

  renderMetaData() {
    const { metaTitle, metaDesc, imageUrl } = this.props;
    const altText = "6thStreet Banner";
    return (
      <>
        <Helmet>
          <title>{metaTitle}</title>
        </Helmet>
        {renderDynamicMetaTags(metaTitle, metaDesc, imageUrl, altText)};
      </>
    );
  }

  renderContent() {
    const { isLoading } = this.props;

    if (isLoading) {
      return this.renderLoading();
    }

    return this.renderDynamicContent();
  }

  render() {
    const { isExpressDelivery } = this.props;
    return (
      <>
        {this.renderMetaData()}
        <Helmet>
          <script type="application/ld+json">{this.appendSchemaData()}</script>
        </Helmet>
        <main block={`HomePage ${isExpressDelivery ? "expressPageCSS" : null}`}>
          {this.renderMySignInPopup()}
          {!isExpressDelivery && <SignInSignUpMobileNudge />}
          {this.renderContent()}
        </main>
      </>
    );
  }
}

export default connect(mapStateToProps, null)(HomePage);
