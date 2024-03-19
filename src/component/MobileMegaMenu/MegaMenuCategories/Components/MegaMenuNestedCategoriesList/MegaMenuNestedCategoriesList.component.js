import Image from "Component/Image";
import Link from "Component/Link";
import Loader from "Component/Loader";
import { isArabic } from "Util/App";
import "./MegaMenuNestedCategoriesList.style.scss";
import { subCategoryClickEvent } from "Component/MobileMegaMenu/MoEngageTrackingEvents/MoEngageTrackingEvents.helper";
const MegaMenuNestedCategoriesList = ({
  isLoading,
  nestedCategoiresList = [],
  parentCategory = "",
  gender="women",
  subCategoryPosition = 1
}) => {
  const renderCategoriesList = (item = {}) => {
    const { label = "", link = "", image = "", promotion_name = "" } = item;
    const isArabicValue = isArabic();

    return (
      <li>
        <Link
          to={link}
          key={subCategoryPosition}
          data-banner-type="banner"
          data-promotion-name={promotion_name ? promotion_name : ""}
          onClick={()=>{
            console.log("test indexvalue")
            subCategoryClickEvent({
              gender: gender,
              parent_category: parentCategory,
              subcategory_name: label,
              subcategory_position: subCategoryPosition
            })
          }}
        >
          <div block="nested-categories-list">
            <Image
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
