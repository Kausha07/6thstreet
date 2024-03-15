import Image from "Component/Image";
import Link from "Component/Link";
import Loader from "Component/Loader";
import { isArabic } from "Util/App";
import "./MegaMenuNestedCategoriesList.style.scss";
const MegaMenuNestedCategoriesList = ({
  isLoading,
  nestedCategoiresList = [],
}) => {
  const renderCategoriesList = (item = {}, index) => {
    const { label = "", link = "", image = "", promotion_name = "" } = item;
    const isArabicValue = isArabic();

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
            <div block="categoryLabel" mods={{ isArabicValue }}>
              {label}
            </div>
          </div>
        </Link>
      </li>
    );
  };

  return (
    <div block="nested-categories-list-container">
      <Loader isLoading={isLoading} />
      {nestedCategoiresList && Object.keys(nestedCategoiresList)?.length > 0
        ? renderCategoriesList(nestedCategoiresList)
        : null}
    </div>
  );
};

export default MegaMenuNestedCategoriesList;
