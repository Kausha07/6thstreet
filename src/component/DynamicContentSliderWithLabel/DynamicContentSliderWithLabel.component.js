import { createRef } from 'react';
import DragScroll from "Component/DragScroll/DragScroll.component";
import {
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
  HOME_PAGE_BANNER_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
// import VueIntegrationQueries from "Query/vueIntegration.query";
// import { getUUID } from "Util/Auth";
import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentSliderWithLabel.style";
import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer"
import { megaMenuCarousalEvent } from "Component/MobileMegaMenu/MoEngageTrackingEvents/MoEngageTrackingEvents.helper";
import { isMsiteMegaMenuCategoriesRoute } from "Component/MobileMegaMenu/Utils/MobileMegaMenu.helper";
import BrowserDatabase from "Util/BrowserDatabase";
import { getStore } from "Store";

class DynamicContentSliderWithLabel extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        label: PropTypes.string,
        link: PropTypes.string,
        plp_config: PropTypes.shape({}), // TODO: describe
      })
    ),
  };

  constructor(props) {
    super(props);
    this.cmpRef = React.createRef();
    this.scrollerRef = React.createRef();
    this.itemRef = React.createRef();
    this.state = {
      activeClass: false,
      isDown: false,
      startX: 0,
      scrollLeft: 0,
      isArabic: isArabic(),
      screenWidth: window.innerWidth,
      minusWidth: 690,
      settings: {
        lazyload: true,
        nav: false,
        mouseDrag: true,
        touch: true,
        controlsText: ["&#x27E8", "&#x27E9"],
        gutter: 8,
        loop: false,
        responsive: {
          1024: {
            items: 5,
            gutter: 25,
          },
          420: {
            items: 5,
          },
          300: {
            items: 2.3,
          },
        },
      },
      impressionSent: false,
      isMobile: isMobile.any() || isMobile.tablet(),
      isHideWidget: true,
    };
  }

  timerStartRef = createRef();
  timerEndRef = createRef();

  componentDidMount() {
    if (this.props?.items?.length < 8) {
      let setting = JSON.parse(JSON.stringify(this.state.settings));
      setting.responsive[1024].items = this.props.items.length;
      this.setState((prevState) => ({
        ...prevState,
        settings: {
          ...prevState.settings,
          responsive: {
            ...prevState.settings.responsive,
            1024: {
              ...prevState.settings.responsive[1024],
              items: this.props.items.length,
            },
          },
        },
      }));
    }
    this.registerViewPortEvent();
    this.showWidgetPostRender()
  }
  componentDidUpdate(prevProps) {
    if (
      this.props?.gender !== prevProps?.gender &&
      isMsiteMegaMenuCategoriesRoute() &&
      this.props?.megeMenuHorizontalSliderData &&
      this.props?.megeMenuHorizontalSliderData?.length > 0 &&
      isMobile.any()
    ) {
      this.sendImpressions();
    }
  }
  
  componentWillUnmount() {
    this.timerStartRef.current && clearTimeout(this.timerStartRef.current);
    this.timerEndRef.current && clearTimeout(this.timerEndRef.current);
  }

  showWidgetPostRender = () => {
    const now = new Date();
    const utcString = now.toUTCString();
    const { end_time, start_time } = this.props;
    const finalendDate = end_time;
    const time = Date.parse(finalendDate) - Date.parse(utcString);
    const timeToStart = Date.parse(start_time) - Date.parse(utcString);
    if (timeToStart > 0) {
      this.timerStartRef.current = setTimeout(() => {
        this.setState({ isHideWidget: false })
      }, timeToStart)
      this.timerEndRef.current = setTimeout(() => { this.setState({ isHideWidget: true }); }, time)
    }
    if (time <= 0) {
      this.setState({ isHideWidget: true });
    } else if (Date.parse(start_time) < Date.parse(utcString) && Date.parse(utcString) < Date.parse(finalendDate)) {
      this.setState({ isHideWidget: false });
      this.timerEndRef.current = setTimeout(() => { this.setState({ isHideWidget: true }); }, time)
    }
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
    const getStoreName = this.props?.promotion_name
      ? this.props?.promotion_name
      : "";
    const getIndexId = this.props?.index ? this.props.index : "";
      items.forEach((item, index) => {
        Object.assign(item, {
          store_code: getStoreName,
          indexValue: index + 1,
          default_Index: getIndexId,
        });
      });

    Event.dispatch( HOME_PAGE_BANNER_IMPRESSIONS,items);
    this.setState({ impressionSent: true });
  }
  handleIntersect = (entries, observer) => {
    const { impressionSent } = this.state;
    if (impressionSent) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.sendImpressions();
      }
    });
  };

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
    const { items = [], megamenuType, megeMenuHorizontalSliderData = []  } = this.props;
    const getStoreName = this.props?.promotion_name
      ? this.props?.promotion_name
      : "";
    const getIndexId = this.props?.index ? this.props.index : "";
    if(megamenuType) {
      megeMenuHorizontalSliderData.forEach((item, index) => {
        Object.assign(item, {
          promotion_name: item?.label || "",
          tag: item?.itemName || "",
          url:item?.image_url || "",
          link:item?.link || '',
          store_code: item?.label || "",
          indexValue: index + 1,
          default_Index: getIndexId || 0,
        });
      });
    } else {
      items.forEach((item, index) => {
        Object.assign(item, {
          store_code: getStoreName,
          indexValue: index + 1,
          default_Index: getIndexId,
        });
      });

    }
    Event.dispatch(HOME_PAGE_BANNER_IMPRESSIONS, megamenuType ? megeMenuHorizontalSliderData : items);
    this.setState({ impressionSent: true });
  }
  handleIntersect = (entries, observer) => {
    const { impressionSent } = this.state;
    if (impressionSent) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.sendImpressions();
      }
    });
  };

  onclick = (item, i = 0) => {
    const { index = 0, megamenuType = false, gender = "women" } = this.props;
    const {
      AppConfig: {
        variations: { HPP = "" },
        abTestingConfig: {
          HPP: { defaultUserSegment },
        },
      },
    } = getStore().getState();
    let banner = {
      link: item?.link,
      promotion_name: item?.promotion_name,
      segment_name: BrowserDatabase.getItem("customer")?.user_segment || defaultUserSegment,
      variant_name: HPP,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(item);
    if(megamenuType && item?.label) {
      megaMenuCarousalEvent({
        gender: gender,
        prev_screen_name: sessionStorage.getItem("prevScreen"),
        banner_label: item?.label,
        banner_position: i+1,
      });
    }
    (!megamenuType) && this.props?.setLastTapItemOnHome(`DynamicContentSliderWithLabel${index}`);
  };
  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderSliderWithLabel = (item, i) => {
    const { link = "", text, url, plp_config, height, width, text_align, image_url = "",label ="" } = item;
    const { megamenuType = false, gender = "women" } = this.props;
    const { isArabic } = this.state;
    let parseLink = megamenuType && (label === "Brands" || i === 0) ? `/brands-menu` : formatCDNLink(link);
    const wd = `${width?.toString()}px`;
    const ht = `${height?.toString()}px`;
    const modifiedText = text ? text : megamenuType && label ? label : null;
    const modifiedItem = megamenuType ? {
      promotion_id: `${modifiedText}_${i+1}`,
      promotion_name: modifiedText,
      ...item
    } : item;
    return (
      <div
        block="SliderWithLabel"
        mods={{ isArabic }}
        ref={this.itemRef}
        key={i * 10}
      >
        <Link
          to={parseLink}
          key={i * 10}
          block="SliderWithLabel"
          elem="Link"
          data-banner-type="sliderWithLabel"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(modifiedItem, i);
          }}
        >
          <Image
            src={megamenuType ? image_url : url}
            alt={text}
            block="Image"
            style={{ maxWidth: wd }}
          />
        </Link>
        {modifiedText ? (
          <div block={`SliderText${megamenuType ? " megaMenuSliderText": ""}`} style={{ textAlign: text_align }}>
            {modifiedText}
          </div>
        ) : null}
      </div>
    );
  };

  renderSliderWithLabelTrendingBrands = (item, i) => {
    const {
      brand = "",
      brand_arabic = "",
      brand_logo = "",
      url_path = "",
      plp_config,
      height = 140,
      width = 140,
      text_align = "center",
    } = item;
    const { isArabic, isMobile } = this.state;
    let parseLink = url_path;
    const wd = `${isMobile ? 65 : width?.toString()}px`;
    const borderRadius = "50%";
    const ht = `${isMobile ? 65 : height?.toString()}px`;
    const brandName = isArabic ? brand_arabic : brand;
    const isDesktop = !isMobile;
    const updateBrandName = isDesktop
      ? brandName?.length > 18
        ? `${brandName?.substring(0, 18)}...`
        : brandName
      : brandName?.length > 13
      ? `${brandName?.substring(0, 13)}...`
      : brandName;
    return (
      <div
        block="SliderWithLabel"
        mods={{ isArabic }}
        ref={this.itemRef}
        key={i * 10}
      >
        {this.props.start_time && this.props.end_time && this.renderTimer()}
        <Link
          to={`${formatCDNLink(parseLink)}.html`}
          key={i * 10}
          block="SliderWithLabel"
          elem="Link"
          data-banner-type="sliderWithLabel"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <Image
            lazyLoad={true}
            src={brand_logo}
            alt={brand}
            block="Image"
            style={{ width: wd, height:ht, minWidth:wd, minHeight: ht, borderRadius: borderRadius }}
          />
        </Link>
        {brandName ? (
          <div block="SliderText" style={{ textAlign: text_align }}>
            { updateBrandName }
          </div>
        ) : null}
      </div>
    );
  };

  renderSliderWithLabelTrendingCategories = (item, i) => {
    const {
      arabic_name = "",
      english_name = "",
      image = "",
      link = "",
      ontology,
      plp_config,
      height = 140,
      width = 140,
      text_align = "center",
    } = item;
    const { isArabic,isMobile } = this.state;
    let parseLink = link;
    const wd = `${isMobile ? 65 : width?.toString()}px`;
    const borderRadius = "50%";
    const ht = `${isMobile ? 65 : height?.toString()}px`;
    const isDesktop = !isMobile;
    const categoryName = isDesktop
      ? isArabic
        ? arabic_name?.length > 18
          ? `${arabic_name?.substring(0, 18)}...`
          : arabic_name
        : english_name?.length > 18
        ? `${english_name?.substring(0, 18)}...`
        : english_name
      : isArabic
      ? arabic_name?.length > 13
        ? `${arabic_name?.substring(0, 13)}...`
        : arabic_name
      : english_name?.length > 13
      ? `${english_name?.substring(0, 13)}...`
      : english_name;
    return (
      <div
        block="SliderWithLabel"
        mods={{ isArabic }}
        ref={this.itemRef}
        key={i * 10}
      >
        <Link
          to={`${formatCDNLink(parseLink)}.html`}
          key={i * 10}
          block="SliderWithLabel"
          elem="Link"
          data-banner-type="sliderWithLabel"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <Image
            lazyLoad={true}
            src={image}
            alt={isArabic ? arabic_name : english_name}
            block="Image"
            style={{ width: wd, height:ht, minWidth:wd, minHeight: ht, borderRadius: borderRadius }}
          />
        </Link>
        {categoryName ? (
          <div block="SliderText" style={{ textAlign: text_align }}>
            {categoryName}
          </div>
        ) : null}
      </div>
    );
  };

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
    const {
      items = [],
      trendingBrands = [],
      trendingCategories = [],
    } = this.props;
    this.checkWidth();
    const { minusWidth } = this.state;
    const finalItems =
      this.props.type === "vue_brands_for_you"
        ? trendingBrands
        : this.props.type === "vue_categories_for_you"
        ? trendingCategories
        : items;
    const width = `${
      (this.itemRef.current && this.itemRef.current.clientWidth) *
        finalItems?.length +
      finalItems?.length * 7 * 2 -
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

  renderSliderWithLabels() {
    const {
      items = [],
      trendingBrands = [],
      trendingCategories = [],
      megeMenuHorizontalSliderData = [],
      megamenuType = false,
      title,
    } = this.props;
    return (
      <DragScroll
        data={{ rootClass: "SliderWithLabelWrapper", ref: this.cmpRef }}
      >
        <div
          block="SliderWithLabelWrapper"
          id="SliderWithLabelWrapper"
          ref={this.cmpRef}
          onScroll={this.handleContainerScroll}
        >
          <div className="SliderHelper"></div>
          {this.props.type === "vue_brands_for_you" &&
            trendingBrands?.length > 0 &&
            trendingBrands.map(this.renderSliderWithLabelTrendingBrands)}
          {this.props.type === "vue_categories_for_you" &&
            trendingCategories?.length > 0 &&
            trendingCategories.map(
              this.renderSliderWithLabelTrendingCategories
            )}
          {megamenuType
            ? megeMenuHorizontalSliderData?.map(this.renderSliderWithLabel)
            : null
          }
          {items.map(this.renderSliderWithLabel)}
          <div className="SliderHelper"></div>
        </div>
        {this.renderScrollbar()}
      </DragScroll>
    );
  }

  getPromotionHeader = () => {
    const { header, layout, trendingBrands=[], trendingCategories=[], type="" } = this.props;

    if (
      (trendingBrands?.length === 0 && type === "vue_brands_for_you") ||
      (trendingCategories?.length === 0 && type === "vue_categories_for_you")
    ) {
      return null;
    } else if (header && header?.title) {
      return header;
    } else if (layout && layout?.title) {
      return layout;
    }

    return "";
  };

  renderTimer = () => {
    const { start_time = "", end_time = "", text_alignment = "", title = "", alignment = "" } = this.props;
    return <DynamicContentCountDownTimer start={start_time} end={end_time} alignment={alignment} textAlignment={text_alignment} infoText={title} />
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    const { isArabic } = this.state;
    const { index = 0, start_time, end_time } = this.props;

    if (start_time && end_time) {
      if (!this.state.isHideWidget) {
        return (
          <div
            ref={setRef}
            block="DynamicContentSliderWithLabel"
            id={`DynamicContentSliderWithLabel${index}`}
          >
            {this.getPromotionHeader() && (
              <div block="HeaderWithTimer">
                <DynamicContentHeader
                  header={this.getPromotionHeader()}
                  type={this.props.type}
                />
                {this.renderTimer()}
              </div>
            )}
            {this.props.title && (
              <div block="HeaderWithTimer">
                <h1 block="Title" mods={{ isArabic }}>
                  {this.props.title}
                </h1>
                {this.renderTimer()}
              </div>
            )}
            {this.renderSliderWithLabels()}
            {this.props.footer && (
              <DynamicContentFooter footer={this.props.footer} />
            )}
          </div>
        );
      } else {
        return <div ref={setRef}></div>
      }
    }

    return (
      <div
        ref={setRef}
        block="DynamicContentSliderWithLabel"
        id={`DynamicContentSliderWithLabel${index}`}
      >
        {this.getPromotionHeader() && (
          <DynamicContentHeader
            header={this.getPromotionHeader()}
            type={this.props.type}
          />
        )}
        {this.props.title && (
          <h1 block="Title" mods={{ isArabic }}>
            {this.props.title}
          </h1>
        )}       {this.renderSliderWithLabels()}
        {this.props.footer && (
          <DynamicContentFooter footer={this.props.footer} />
        )}
      </div>
    );
  }
}

export default DynamicContentSliderWithLabel;
