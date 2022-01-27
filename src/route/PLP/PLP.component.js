/* eslint-disable fp/no-let */
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import DynamicContent from "Component/DynamicContent";
import MyAccountOverlay from "Component/MyAccountOverlay";
import PLPDetails from "Component/PLPDetails";
import PLPFilters from "Component/PLPFilters";
import PLPPages from "Component/PLPPages";
import { PureComponent } from "react";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";
// import DynamicContentCircleItemSlider from '../../component/DynamicContentCircleItemSlider';
import "./PLP.style";

export class PLP extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: null,
      signInPopUp: "",
      showPopup: false,
      circleBannerUrl: null,
      activeFilters: {},
    };
  }

  componentDidMount() {
    let bannerData = localStorage.getItem("bannerData");
    let bannerUrl = localStorage.getItem("CircleBannerUrl");
    if (bannerData) {
      let banner = JSON.parse(bannerData);
      this.setState({
        bannerData: banner,
        circleBannerUrl: bannerUrl,
      });
    }
  }
  componentWillUnmount() {
    const { resetPLPData } = this.props;
    // resetPLPData();
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
  // componentWillUnmount(){
  //     localStorage.removeItem("bannerData");
  // }

  renderPLPDetails() {
    return <PLPDetails {...this.props} />;
  }

  renderPLPFilters() {
    return <PLPFilters {...this.props} />;
  }

  renderPLPPages() {
    const { prevPath = null, updateFiltersState } = this.props;
    return (
      <PLPPages
        {...this.props}
        updateFiltersState={updateFiltersState}
        renderMySignInPopup={this.showMyAccountPopup}
        prevPath={prevPath}
      />
    );
  }

  renderBanner() {
    let urlPath = window.location.pathname;
    let bannerUrl = localStorage.getItem("CircleBannerUrl");
    if (this.state.bannerData && bannerUrl === urlPath)
      return (
        <div>
          <CircleItemSliderSubPage bannerData={this.state.bannerData} />
        </div>
      );
  }

  renderPLPWidget = () => {
    const { plpWidgetData } = this.props;
    const { pathname } = location;
    const tagName = pathname
      .replace(".html", "")
      .replace("/", "")
      .replaceAll("/", "_");

    const widget = plpWidgetData.filter((item) => item.tag == tagName);
    if (widget && widget.length == 0) {
      return null;
    }
    const { gender } = this.props;

    // return <h1>Plp Widget</h1>;
    return (
      <DynamicContent
        gender={gender}
        content={widget}
        renderMySignInPopup={this.showMyAccountPopup}
      />
    );
  };

  render() {
    const { signInPopUp } = this.state;

    return (
      <main block="PLP">
        <ContentWrapper label={__("Product List Page")}>
          {this.renderMySignInPopup()}
          {this.renderPLPDetails()}
          {this.state.bannerData && this.renderBanner()}
          {this.renderPLPWidget()}
          <div block="Products" elem="Wrapper">
            {this.renderPLPFilters()}
            {this.renderPLPPages()}
          </div>
        </ContentWrapper>
      </main>
    );
  }
}

export default PLP;
