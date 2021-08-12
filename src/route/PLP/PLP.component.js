/* eslint-disable fp/no-let */
import { PureComponent } from "react";

import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import PLPDetails from "Component/PLPDetails";
import PLPFilters from "Component/PLPFilters";
import PLPPages from "Component/PLPPages";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";

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

  render() {
    return (
      <main block="PLP">
        <ContentWrapper label={__("Product List Page")}>
          {this.renderPLPDetails()}
          {this.state.bannerData && this.renderBanner()}
          {this.renderPLPFilters()}
          {this.renderPLPPages()}
        </ContentWrapper>
      </main>
    );
  }
}

export default PLP;
