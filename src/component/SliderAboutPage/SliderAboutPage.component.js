import { PureComponent } from "react";
import "./SliderAboutPage.style";
import Link from "Component/Link";
import Image from "Component/Image";
import DragScroll from "Component/DragScroll/DragScroll.component";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

export class SliderAboutPage extends PureComponent {
  constructor(props) {
    super(props);
    this.cmpRef = React.createRef();
    this.scrollerRef = React.createRef();
    this.itemRef = React.createRef();
    this.state = {
      isArabic: isArabic(),
      isMobile: isMobile.any(),
      isTablet: isMobile.tablet(),
      screenWidth: window.innerWidth,
      minusWidth: 690,
    };
  }

  handleContainerScroll = (event) => {
    const target = event.nativeEvent.target;
    if (this.scrollerRef && this.scrollerRef.current) {
      this.scrollerRef.current.scrollLeft = target.scrollLeft;
    }
  };

  handleScroll = (event) => {
    const target = event.nativeEvent.target;
    const prentComponent = [...this.cmpRef.current.childNodes].filter(
      (node) => node.className == "SliderWithLabelWrapper"
    )[0];
    prentComponent && (prentComponent.scrollLeft = target.scrollLeft);
  };
  checkWidth() {
    const { screenWidth, minusWidth } = this.state;
    if (screenWidth > 1500) {
      this.setState({ minusWidth: 590 });
    } else if (screenWidth < 1400) {
      this.setState({ minusWidth: 660 });
    }
  }
  renderScrollbar = () => {
    const { sliderItems = [] } = this.props;
    const items = sliderItems;
    this.checkWidth();
    const { minusWidth } = this.state;

    const width = `${
      (this.itemRef.current && this.itemRef.current.clientWidth) *
        items.length +
      items.length * 7 * 2 -
      minusWidth
    }px`;

    return (
      <div
        block="Outer"
        mods={{
          Hidden:
            this.scrollerRef.current &&
            this.scrollerRef.current.clientWidth >= width,
        }}
        ref={this.scrollerRef}
        onScroll={this.handleScroll}
      >
        <div block="Outer" style={{ width: width }} elem="Inner"></div>
      </div>
    );
  };

  renderSliderWithLabel = (item, i) => {
    const {
      link,
      text,
      url,
      plp_config,
      height,
      width,
      text_align,
      textDescription,
      imglink,
      ArabicText,
      textDescriptionArabic,
    } = item;

    const { isArabic, isMobile, isTablet } = this.state;
    const { sliderType } = this.props;
    let parseLink = link;
    const wd = `${width.toString()}px`;
    const ht = `${height.toString()}px`;

    return (
      <div
        block={`${sliderType}Item SliderWithLabel`}
        mods={{ isArabic }}
        ref={this.itemRef}
        key={i * 11}
      >
        {sliderType === "AboutBrandSlider" && (
          <div className="AboutBrandOuterBox">
            <Link
              to={`${link}`}
              key={i * 10}
              block="SliderImage"
              elem="Link"
              data-banner-type="sliderWithLabel"
              data-promotion-name={
                item.promotion_name ? item.promotion_name : ""
              }
              data-tag={item.tag ? item.tag : ""}
            >
              <div className="SliderImage">
                <Image
                  lazyLoad={true}
                  src={url}
                  alt={text || "Brand Image"}
                  block="Image"
                />
              </div>
            </Link>
            {text ? (
              <div block="SliderText" style={{ textAlign: text_align }}>
                {text}
              </div>
            ) : null}
          </div>
        )}
        {sliderType === "ExperienceSlider" && (
          <div className="ExperienceOuterBox">
            <div className="SliderImage">
              <Image
                lazyLoad={true}
                src={imglink}
                alt={text}
                block="Image"
                style={
                  isMobile
                    ? { maxWidth: "50px", width: "50px", minWidth: "50px" }
                    : { maxWidth: wd, width: "84px", minWidth: "84px" }
                }
              />
            </div>

            <div block="SliderText" style={{ textAlign: text_align }}>
              {isArabic ? ArabicText : text}
            </div>

            <div
              block="SliderTextDescription"
              style={{ textAlign: text_align }}
            >
              {isArabic ? textDescriptionArabic : textDescription}
            </div>
          </div>
        )}
      </div>
    );
  };

  renderSliderWithLabels() {
    const { sliderItems } = this.props;
    const sliderItemsList = sliderItems || [];

    return (
      <DragScroll
        data={{ rootClass: `SliderWithLabelWrapper`, ref: this.cmpRef }}
      >
        <div
          block="SliderWithLabelWrapper"
          id="SliderWithLabelWrapper"
          ref={this.cmpRef}
          onScroll={this.handleContainerScroll}
        >
          <div className="SliderHelper"></div>
          {sliderItemsList.map(this.renderSliderWithLabel)}
          <div className="SliderHelper"></div>
        </div>
        {this.renderScrollbar()}
      </DragScroll>
    );
  }

  render() {
    const { sliderType, sliderItems } = this.props;

    return (
      <div
        block="DynamicContentSliderWithLabel"
        id={`DynamicContentSliderWithLabel${sliderType}`}
      >
        {sliderItems && this.renderSliderWithLabels()}
      </div>
    );
  }
}

export default SliderAboutPage;
