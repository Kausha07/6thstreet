import Link from "Component/Link";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
// import Image from 'Component/Image';
import { formatCDNLink } from "Util/Url";
import "./DynamicContentTwiceBanner.style";

class DynamicContentTwiceBanner extends PureComponent {
  state = {
    isArabic: isArabic(),
    isAllShowing: true,
  };

  static defaultProps = {
    button: {},
    typeOfBanner: "",
  };

  constructor(props) {
    super(props);
  }

  renderImage = (item, isTwiceBanner) => {
    const { typeOfBanner } = this.props;
    const { title, subtitle, button_label, button_link } =
      typeOfBanner && this.props[typeOfBanner];
    const { url, link, height = "", width = "" } = item;
    // TODO: calculate aspect ratio to ensure images not jumping.
    // if (!link) {
    //     return (
    //         <>
    //             <Image
    //               key={ i }
    //               src={ url }
    //               ratio="custom"
    //               height={ ht }
    //               width={ wd }
    //             />
    //             { this.renderButton() }
    //         </>
    //     );
    // }
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "all";
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;
    let parseLink =
      button_link && button_link.includes("/catalogsearch/result")
        ? button_link.split("&")[0] +
          `&gender=${requestedGender.replace(
            requestedGender.charAt(0),
            requestedGender.charAt(0).toUpperCase()
          )}`
        : button_link;

    if (isTwiceBanner) {
      return (
        <div className="TwiceBanner">
          <div className="TwiceBannerBlock">
            <div className="TwiceBannerBlockChildTitle">{title}</div>
            <div className="TwiceBannerBlockChildSub">{subtitle}</div>
            <div className="TwiceBannerBlockChild">
              {" "}
              <a href={parseLink}>
                <button>{button_label}</button>
              </a>{" "}
            </div>
          </div>
        </div>
      );
    }
    return (
      <Link
        to={formatCDNLink(link)}
        data-banner-type="banner"
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        <img
          src={url}
          className="BannerImage"
          style={{ maxWidth: width, maxHeight: height }}
        />
      </Link>
    );
  };

  renderImages(isTwiceBanner = false) {
    const { items = [] } = this.props;
    return this.renderImage(items[0], isTwiceBanner);
  }

  render() {
    const { isArabic } = this.state;
    // const { isAllShowing } = this.state;
    const { typeOfBanner } = this.props;
    const BannerPosition = typeOfBanner === "header" ? "Right" : "Left";
    return (
      <div
        block="DynamicContentTwiceBanner"
        className="row"
        elem="Content"
        mods={{ isArabic }}
      >
        {BannerPosition === "Left" ? (
          <>
            <div
              block="DynamicContentTwiceBanner"
              elem="BannerImg"
              class="banner1"
            >
              {this.renderImages()}
            </div>
            <div
              block="DynamicContentTwiceBanner"
              elem="Figure"
              class="banner2"
            >
              {this.renderImages(true)}
            </div>
          </>
        ) : (
          <>
            <div
              block="DynamicContentTwiceBanner"
              elem="FigureRight"
              class="banner1"
            >
              {this.renderImages(true)}
            </div>
            <div
              block="DynamicContentTwiceBanner"
              elem="BannerImgRight"
              class="banner2"
            >
              {this.renderImages()}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default DynamicContentTwiceBanner;
