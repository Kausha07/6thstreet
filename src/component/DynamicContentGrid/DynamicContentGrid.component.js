import PropTypes from "prop-types";
import { PureComponent } from "react";

import Image from "Component/Image";
import Link from "Component/Link";
import { formatCDNLink } from "Util/Url";
import isMobile from 'Util/Mobile';
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { isArabic } from "Util/App";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";

import "./DynamicContentGrid.style";

class DynamicContentGrid extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        link: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string
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
    let contentClass = 'contentAll';
    if(item_height >= 500 && items_per_row === 2) {
      contentClass = `Content_${i}`;
    }
    return (
      <div block="CategoryItem" mods={{ isArabic }} elem="Content" className={contentClass} key={i}>
        <Link
          to={formatCDNLink(link)}
          key={i}
          data-banner-type="grid"
          data-promotion-name= {item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          {/* <Image src={url} height={ht} /> */}
          <img src={ url } className='GridImage' style={{ maxHeight: ht }}/>
          {item.footer && (
            <div block="Footer">
              {item.footer.title && (
                <p block="Footer-Title">{item.footer.title}</p>
              )}
              {item.footer.subtitle && (
                <p block="Footer-SubTitle">{item.footer.subtitle}</p>
              )}
              {item.footer.button_label && (
                <p><a block="Footer-Button">{item.footer.button_label}</a></p>
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
    return (
      <div block="CategoryItem" elem="Content" key={i}>
        <Link
          to={formatCDNLink(link)}
          key={i}
          data-banner-type="grid"
          data-promotion-name= {item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <img src={url} ratio="custom"  />
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
    if(isMobile.any()){
      return items.map(this.renderItemMobile);
    }
    return items.map(this.renderItem);
  }

  renderGrid() {
    const { items_per_row, header: { title } = {} } = this.props;

    const style = { gridTemplateColumns: `repeat(${items_per_row}, 1fr)`}
    return (
      <>
        {this.props.header && title && (
          <DynamicContentHeader header={this.props.header} />
        )}

        <div block="DynamicContentGrid" elem="Grid" style={style }>
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
