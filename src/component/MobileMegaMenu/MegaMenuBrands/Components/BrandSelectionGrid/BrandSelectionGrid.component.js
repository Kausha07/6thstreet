import DynamicContentGrid from "Component/DynamicContentGrid";
import "./BrandSelectionGrid.style.scss";
const BrandSelectionGrid = (props) => {
  const refinedBrandSelectionGridData =
    props?.BrandSelectionGridData?.[0] || {};

  return (
    <div block="brand-selection-grid-container" id="brand-selection-grid-container-id">
      {refinedBrandSelectionGridData &&
      Object.keys(refinedBrandSelectionGridData)?.length > 0 ? (
        <DynamicContentGrid
          brandGridItem={refinedBrandSelectionGridData?.items}
          items_per_row={2}
          type={refinedBrandSelectionGridData?.type}
          isHomePage={true}
          widgetID={refinedBrandSelectionGridData?.type}
          isMsiteMegaMenu={true}
        />
      ) : null}
    </div>
  );
};

export default BrandSelectionGrid;
