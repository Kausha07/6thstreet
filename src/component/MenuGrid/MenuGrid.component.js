import { PureComponent } from "react";

import Image from "Component/Image";
import Link from "Component/Link";
import { hideActiveOverlay } from "SourceStore/Overlay/Overlay.action";
import { MOBILE_MENU_SIDEBAR_ID } from "Component/MobileMenuSideBar/MoblieMenuSideBar.config";
import {
  CategoryButton,
  CategoryItems,
} from "Util/API/endpoint/Categories/Categories.type";
import { isArabic } from "Util/App";

import "./MenuGrid.style";

class MenuGrid extends PureComponent {
  state = {
    isArabic: isArabic(),
    isAllShowing: true,
  };

  static propTypes = {
    button: CategoryButton,
    items: CategoryItems.isRequired,
  };

  static defaultProps = {
    button: {},
  };

  constructor(props) {
    super(props);
    this.showAllCategories = this.showAllCategories.bind(this);
  }

  onItemClick = () => {
    const { toggleOverlayByKey } = this.props;

    toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
  };

  renderItem = (item, i) => {
    const { image_url, label, link } = item;
    
    let linkURL = link.split('?q=')[0]
    if (!linkURL) {
      return null;
    }

    const updatedLink = linkURL.match(
      /\/men|\/women|\/kids-baby_boy-boy-girl-baby_girl|\/kids/
    )
      ? linkURL
          .replace("/men.html", ".html")
          .replace("/women.html", ".html")
          .replace("/kids-baby_boy-boy-girl-baby_girl.html", ".html")
          .replace("/kids.html", ".html")
          .replace("/home.html", ".html")
      : linkURL;

    return (
      <Link to={updatedLink} key={i} title={label} onClick={this.onItemClick}>
        <Image src={image_url} width="80px" height="80px" ratio="custom" />
        <div block="MenuGrid" elem="ItemLabel">
          {label}
        </div>
      </Link>
    );
  };

  renderItems() {
    const { items = [] } = this.props;
    return items.slice(0, 14).map(this.renderItem);
  }

  renderDesktopButton() {
    const {
      button: { label = "", link },
    } = this.props;

    const linkTo = {
      pathname: link,
      state: { plp_config: {} },
    };

    return (
      <Link to={linkTo} onClick={this.hideMenu}>
        {label}
      </Link>
    );
  }

  hideMenu = () => {
    hideActiveOverlay();
  };

  showAllCategories() {
    this.setState(({ isAllShowing }) => ({ isAllShowing: !isAllShowing }));
  }

  renderViewAllButton() {
    const {
      button: { link },
    } = this.props;

    const linkTo = {
      pathname: link,
      state: { plp_config: {} },
    };

    return (
      <button block="ViewAll" elem="Button">
        <Link to={linkTo} onClick={this.hideMenu}>
          <span>{__("view all")}</span>
        </Link>
      </button>
    );
  }

  renderSubcategories() {
    const { isArabic } = this.state;

    return (
      <>
        <span block="MenuGrid" elem="Title">
          {__("Shop by product")}
        </span>
        {this.renderViewAllButton()}
        <div
          mix={{
            block: "MenuGrid-Column",
            elem: "Content",
            mods: { isArabic },
          }}
        >
          {this.renderDesktopButton()}
          {this.renderItems()}
        </div>
      </>
    );
  }

  render() {
    const { isArabic } = this.state;
    const { isAllShowing } = this.state;

    return (
      <div block="MenuGrid">
        <div
          mix={{
            block: "MenuGrid",
            elem: "Content",
            mods: { isArabic },
          }}
        >
          <div block="MenuGrid" elem="Columns">
            <div
              mix={{
                block: "MenuGrid",
                elem: "Column",
                mods: { isAllShow: isAllShowing },
              }}
            >
              {this.renderSubcategories()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MenuGrid;
