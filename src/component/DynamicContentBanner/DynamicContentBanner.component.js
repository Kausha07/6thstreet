import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { getUUID } from "Util/Auth";
import Event, { EVENT_GTM_BANNER_CLICK, VUE_CAROUSEL_CLICK } from "Util/Event";
import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentBanner.style";
class DynamicContentBanner extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        link: PropTypes.string,
        height: PropTypes.string,
        width: PropTypes.string,
      })
    ).isRequired,
    isMenu: PropTypes.bool,
  };

  static defaultProps = {
    isMenu: false,
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  onclick = (item) => {
    console.log("item1");
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    // vue analytics
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_CLICK,
      params: {
        event: VUE_CAROUSEL_CLICK,
        pageType: "plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        widgetID: "vue_visually_similar_slider", // TODO: will be added after vue product slider.
      },
    });
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  renderImage = (item, i) => {
    // const { items } = this.props;
    // const { height, width } = items[0];
    const { url, link, height = "", width = "" } = item;
    let ht, wd;
    if (screen.width < 900) {
      wd = (screen.width - 16).toString() + "px";
      ht = (height / width) * screen.width;
    } else {
      wd = width.toString() + "px";
      ht = height.toString() + "px";
    }

    // TODO: calculate aspect ratio to ensure images not jumping.
    if (!link) {
      return (
        <>
          <Image key={i} src={url} ratio="custom" height={ht} width={wd} />
          {this.renderButton()}
        </>
      );
    }

    return (
      <Link
        to={formatCDNLink(link)}
        key={i}
        data-banner-type="banner"
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        <img src={url} block="Image" style={{ width: wd, height: ht }} />

        {this.renderButton()}
      </Link>
    );
  };

  renderButton() {
    const { isMobile } = this.state;
    const { isMenu } = this.props;

    return isMobile || !isMenu ? null : <button>{__("Shop now")}</button>;
  }

  renderImages() {
    const { items = [] } = this.props;
    return items.map(this.renderImage);
  }

  render() {
    return (
      <div block="DynamicContentBanner">
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderImages()}
        {this.props.footer && (
          <DynamicContentFooter footer={this.props.footer} />
        )}
      </div>
    );
  }
}

export default DynamicContentBanner;
