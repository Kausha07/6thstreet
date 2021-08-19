import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentGrid.style.scss";
class DynamicContentGrid extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        link: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string,
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
    isArabic: isArabic(),
    isAllShowing: true,
  };
  onclick = (item) => {
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  renderItem = (item, i) => {
    const { link, url } = item;
    const { isArabic } = this.state;
    const { items_per_row, item_height } = this.props;
    let ht = item_height.toString() + "px";
    let contentClass = "contentAll";
    if (item_height >= 500 && items_per_row === 2) {
      contentClass = `Content_${i}`;
    }
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "all";
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;
    let parseLink = link.includes("/catalogsearch/result")
      ? link.split("&")[0] +
        `&gender=${requestedGender.replace(
          requestedGender.charAt(0),
          requestedGender.charAt(0).toUpperCase()
        )}`
      : link;
    return (
      <div
        block="CategoryItem"
        mods={{ isArabic }}
        elem="Content"
        className={contentClass}
        key={i}
      >
        <Link
          to={formatCDNLink(parseLink)}
          key={i}
          data-banner-type="grid"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          {/* <Image src={url} height={ht} /> */}
          <img src={url} className="GridImage" style={{ maxHeight: ht }} />
          {item.footer && (
            <div block="Footer">
              {item.footer.title && (
                <p block="Footer-Title">{item.footer.title}</p>
              )}
              {item.footer.subtitle && (
                <p block="Footer-SubTitle">{item.footer.subtitle}</p>
              )}
              {item.footer.button_label && (
                <p>
                  <a block="Footer-Button">{item.footer.button_label}</a>
                </p>
              )}
            </div>
          )}
        </Link>
      </div>
    );
  };

  renderItemMobile = (item, i) => {
    const { link, url } = item;
    let ht = this.props.item_height.toString() + "px";
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "all";
    let requestedGender = isArabic ? getGenderInArabic(gender) : gender;
    let parseLink = link.includes("/catalogsearch/result")
      ? link.split("&")[0] +
        `&gender=${requestedGender.replace(
          requestedGender.charAt(0),
          requestedGender.charAt(0).toUpperCase()
        )}`
      : link;
    return (
      <div block="CategoryItem" elem="Content" key={i}>
        <Link
          to={formatCDNLink(parseLink)}
          key={i}
          data-banner-type="grid"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <img src={url} />
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
    if (isMobile.any()) {
      return items.map(this.renderItemMobile);
    }
    return items.map(this.renderItem);
  }

  renderGrid() {
    const { items_per_row, header: { title } = {} } = this.props;

    const style = { gridTemplateColumns: `repeat(${items_per_row}, 1fr)` };
    return (
      <>
        {this.props.header && title && (
          <DynamicContentHeader header={this.props.header} />
        )}

        <div block="DynamicContentGrid" elem="Grid" style={style}>
          {this.renderItems()}
        </div>
      </>
    );
  }

  render() {
    return <div block="DynamicContentGrid">{this.renderGrid()}</div>;
  }
}

export default DynamicContentGrid;
