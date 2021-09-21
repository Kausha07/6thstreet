import Link from "Component/Link";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import Image from "Component/Image";
import { formatCDNLink } from "Util/Url";
import "./DynamicContentTwiceBanner.style";
import Event from "Util/Event";
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";

class DynamicContentTwiceBanner extends PureComponent {
  state = {
    isArabic: isArabic(),
    isAllShowing: true,
    impressionSent: false,
  };

  static defaultProps = {
    button: {},
    typeOfBanner: "",
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.registerViewPortEvent();
  }

  registerViewPortEvent() {
    let observer;

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer = new IntersectionObserver(this.handleIntersect, options);
    observer.observe(this.viewElement);
  }
  sendImpressions() {
    const { items = [] } = this.props;
    Event.dispatch(HOME_PAGE_BANNER_IMPRESSIONS, items);
    this.setState({ impressionSent: true });
  }
  handleIntersect = (entries, observer) => {
    const { impressionSent } = this.state;
    if (impressionSent) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("twice banner component in view port ", entry);
        this.sendImpressions();
      }
    });
  };
  onclick = (item) => {
    this.sendBannerClickImpression(item);
  };

  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
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
      : "home";
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
        <Image
          src={url}
          className="BannerImage"
          style={{ maxWidth: width, maxHeight: height }}
        />

        {/* <img
          src={url}
          className="BannerImage"
          style={{ maxWidth: width, maxHeight: height }}
        /> */}
      </Link>
    );
  };

  renderImages(isTwiceBanner = false) {
    const { items = [] } = this.props;
    return this.renderImage(items[0], isTwiceBanner);
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    const { isArabic } = this.state;
    // const { isAllShowing } = this.state;
    const { typeOfBanner } = this.props;
    const BannerPosition = typeOfBanner === "header" ? "Right" : "Left";
    return (
      <div
        ref={setRef}
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
