import Image from "Component/Image";
import Link from "Component/Link";
import "./MegaMenuNestedCategoriesList.style.scss";
const MegaMenuNestedCategoriesList = ({ nestedCategoiresList = [] }) => {
  const renderCategoriesList = (item = [],index) => {
    const {
      label = "",
      link = "",
      image = "",
      promotion_name = "",
    } = item;
    return (
      <li>
        <Link
          to={link}
          key={index}
          data-banner-type="banner"
          data-promotion-name={promotion_name ? promotion_name : ""}
        >
          <div block="nested-categories-list">
            <Image
              lazyLoad={true}
              src={image}
              block="categriesImage"
              alt={
                promotion_name
                  ? promotion_name
                  : "megamenu-nested-categoires-list"
              }
            />
            <div block="categoryLabel">{label}</div>
          </div>
        </Link>
      </li>
    );
  };
  return (
    <div block="nested-categories-list-container">{
        nestedCategoiresList?.map((item)=>renderCategoriesList(item))
    }</div>
  );
};

export default MegaMenuNestedCategoriesList;
