import { v4 } from "uuid";
import ProductItem from "Component/ProductItem";
import Link from "Component/Link";
import "./CartPageSliders.style.scss";

const CartPageSliders = (props) => {
  const { sliderProducts, heading, linkTo, sliderType } = props;

  const renderSlider = () => {
    const slicedSliderProducts = sliderProducts?.slice(0, 5);
    if (slicedSliderProducts?.length > 0) {
      return (
        <div block="cartSlider">
          <div block="cartHeader">
            <h2 class="cartHeading">{heading}</h2>
            {sliderProducts.length > 5 && (
              <Link to={linkTo}>
                <button block="cartViewAllButton">{__("View All")}</button>
              </Link>
            )}
          </div>
          <div block="PLPPage">
            <ul block="spckItems">
              {slicedSliderProducts?.map((item, i) => {
                return (
                  <div block="spckItem" key={i}>
                    <ProductItem
                      position={1}
                      product={sliderType === "wishlist" ? item.product : item}
                      key={v4()}
                      page="cart"
                      pageType="cartSlider"
                      isVueData={false}
                    />
                    <button block="cartButton"> {__("Move to cart")}</button>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  return <>{renderSlider()}</>;
};

export default CartPageSliders;
