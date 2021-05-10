import { PureComponent } from "react";

import Image from "Component/Image";
import Link from "Component/Link";
import MobileMenuSlider from "Component/MobileMenuSlider";
import { CategorySliderItems } from "Util/API/endpoint/Categories/Categories.type";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

import "./MenuBrands.scss";

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
      : link;

    return (
      <Link to={updatedLink} key={i}>
        <Image src={image_url} />
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
            {__("Shop By Brands")}
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

export default MenuBrands;
