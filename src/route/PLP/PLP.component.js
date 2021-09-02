/* eslint-disable fp/no-let */
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import DynamicContent from "Component/DynamicContent";
import PLPDetails from "Component/PLPDetails";
import PLPFilters from "Component/PLPFilters";
import PLPPages from "Component/PLPPages";
import { PureComponent } from "react";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";
// import DynamicContentCircleItemSlider from '../../component/DynamicContentCircleItemSlider';
import "./PLP.style";
import MyAccountOverlay from "Component/MyAccountOverlay";

export class PLP extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: null,
      signInPopUp: "",
      circleBannerUrl: null,
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

  closePopup = () => {
    this.setState({ signInPopUp: "" });
  };

  renderMySignInPopup = () => {
    const { signInPopUp } = this.state;
    const popUpElement = (
      <MyAccountOverlay isPopup={signInPopUp} closePopup={this.closePopup} />
    );

    this.setState({ signInPopUp: popUpElement });
    return popUpElement;
  };
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
    return (
      <PLPPages
        {...this.props}
        renderMySignInPopup={this.renderMySignInPopup}
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
    console.log("plp data", plpWidgetData);
    const { pathname } = location;
    const tagName = pathname
      .replace(".html", "")
      .replace("/", "")
      .replaceAll("/", "_");

    const widget = plpWidgetData.filter((item) => item.tag == tagName);
    if (widget && widget.length == 0) {
      return null;
    }
    console.log("plp widget", widget);
    const { gender } = this.props;

    // return <h1>Plp Widget</h1>;
    return <DynamicContent gender={gender} content={widget} />;
  };

  render() {
    const { signInPopUp } = this.state;
    return (
      <main block="PLP">
        <ContentWrapper label={__("Product List Page")}>
          {signInPopUp}
          {this.renderPLPDetails()}
          {this.state.bannerData && this.renderBanner()}
          {this.renderPLPWidget()}
          {this.renderPLPFilters()}
          {this.renderPLPPages()}
        </ContentWrapper>
      </main>
    );
  }
}

export default PLP;
