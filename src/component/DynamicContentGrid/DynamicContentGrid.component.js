import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
// import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
// import { getUUID } from "Util/Auth";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentGrid.style";
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";

class DynamicContentGrid extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        link: PropTypes.string,
        url: PropTypes.string,
      })
    ).isRequired,
    header: PropTypes.shape({
      title: PropTypes.string,
    }),
    items_per_row: PropTypes.number,
  };

  static defaultProps = {
    items_per_row: 4,
    header: {},
  };

  state = {
    impressionSent: false,
  };
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
        this.sendImpressions();
      }
    });
  };

  onclick = (item) => {
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    // vue analytics
    // const locale = VueIntegrationQueries.getLocaleFromUrl();
    // VueIntegrationQueries.vueAnalayticsLogger({
    //   event_name: VUE_CAROUSEL_CLICK,
    //   params: {
    //     event: VUE_CAROUSEL_CLICK,
    //     pageType: "plp",
    //     currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
    //     clicked: Date.now(),
    //     uuid: getUUID(),
    //     referrer: "desktop",
    //     widgetID: "vue_visually_similar_slider", // TODO: will be added after vue product slider.
    //   },
    // });
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(item);
  };
  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderItem = (item, i) => {
    const { link, url } = item;
    let ht = this.props.item_height.toString() + "px";
    return (
      <div block="CategoryItem" elem="Content" key={i}>
        <Link
          to={formatCDNLink(link)}
          key={i}
          data-banner-type="grid"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <Image src={url} ratio="custom" height={ht} />
          {item.footer && (
            <div block="Footer">
              {item.footer.title && (
                <p block="Footer-Title">{item.footer.title}</p>
              )}
              {item.footer.subtitle && (
                <p block="Footer-SubTitle">{item.footer.subtitle}</p>
              )}
              {item.footer.button_label && (
                <a block="Footer-Button">{item.footer.button_label}</a>
              )}
            </div>
          )}
        </Link>
      </div>
    );
  };

  renderItems() {
    const { items = [] } = this.props;
    return items.map(this.renderItem);
  }

  renderGrid() {
    const { items_per_row, header: { title } = {} } = this.props;

    return (
      <>
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}

        <div block="DynamicContentGrid" elem="Grid" mods={{ items_per_row }}>
          {this.renderItems()}
        </div>
      </>
    );
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    return (
      <div ref={setRef} block="DynamicContentGrid">
        {this.renderGrid()}
      </div>
    );
  }
}

export default DynamicContentGrid;
