import { PureComponent } from "react";

import Image from "Component/Image";
import Link from "Component/Link";
import { connect } from "react-redux";
import MobileMenuSlider from "Component/MobileMenuSlider";
import { CategorySliderItems } from "Util/API/endpoint/Categories/Categories.type";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import { MOBILE_MENU_SIDEBAR_ID } from "Component/MobileMenuSideBar/MoblieMenuSideBar.config";
import { toggleOverlayByKey } from "Store/Overlay/Overlay.action";
import "./MenuBrands.scss";

export const mapDispatchToProps = (_dispatch) => ({
  toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key)),
});
class MenuBrands extends PureComponent {
  static propTypes = {
    items: CategorySliderItems.isRequired,
  };

  state = {
    isArabic: isArabic(),
    activeSliderImage: 0,
  };

  renderItems() {
    const { items = [] } = this.props;
    return items.map(this.renderItem);
  }

  handleChange = (activeImage) => {
    this.setState({ activeSliderImage: activeImage });
  };

  onItemClick = () => {
    const { toggleOverlayByKey } = this.props;

    toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
  };
  renderItem = (item, i) => {
    const { image_url, label, link } = item;

    const updatedLink = link.match(
      /\/men|\/women|\/kids-baby_boy-boy-girl-baby_girl|\/kids/
    )
      ? link
        .replace("/men.html", ".html")
        .replace("/women.html", ".html")
        .replace("/kids-baby_boy-boy-girl-baby_girl.html", ".html")
        .replace("/kids.html", ".html")
        .replace("/home.html", ".html")
      : link;
    let newUpdatedLink = link.includes("is_new_in")
      ? link.split("?")[0] + "?is_new_in=1"
      : link;

    return (
      <Link
        to={newUpdatedLink}
        title={label}
        key={i}
        onClick={this.onItemClick}
      >
        <Image lazyLoad={true} src={image_url} />
        {label}
      </Link>
    );
  };

  renderBrandsSlider() {
    const { isArabic, activeSliderImage } = this.state;

    return (
      <div
        mix={{
          block: "MenuBrands",
          elem: "MobileSliderWrapper",
          mods: { isArabic },
        }}
      >
        <MobileMenuSlider
          mix={{
            block: "MenuBrands",
            elem: "MobileSlider",
            mods: { isArabic },
          }}
          activeImage={activeSliderImage}
          onActiveImageChange={this.handleChange}
        >
          {this.renderItems()}
        </MobileMenuSlider>
      </div>
    );
  }

  renderBrands() {
    const { items = [] } = this.props;
    const minSliderBrandsCount = 3;

    if (items.length > minSliderBrandsCount && isMobile.any()) {
      return this.renderBrandsSlider();
    }

    return this.renderItems();
  }

  render() {
    const { isArabic } = this.state;

    return (
      <div block="MenuBrands">
        <div block="MenuBrands" elem="ContentWrapper">
          <span block="MenuBrands" elem="Title">
            {this.props.title}
            {/* {__("Shop By Brands")} */}
          </span>
          <div
            mix={{
              block: "MenuBrands",
              elem: "ContentWrapper-Brands",
              mods: { isArabic },
            }}
          >
            {this.renderBrands()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(MenuBrands);
