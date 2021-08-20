/* eslint-disable fp/no-let */
import { PureComponent } from "react";

import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import PLPDetails from "Component/PLPDetails";
import PLPFilters from "Component/PLPFilters";
import PLPPages from "Component/PLPPages";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";
import DynamicContent from "Component/DynamicContent";
// import DynamicContentCircleItemSlider from '../../component/DynamicContentCircleItemSlider';
import "./PLP.style";

export class PLP extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: null,
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
    return <PLPPages {...this.props} />;
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
    console.log("plp", plpWidgetData);
    console.log("plp", location);
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
    return (
      <main block="PLP">
        <ContentWrapper label={__("Product List Page")}>
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
