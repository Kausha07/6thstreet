import { useState, useEffect } from "react";
import DynamicContentGrid from "Component/DynamicContentGrid";
import "./BrandSelectionGrid.style.scss";
const BrandSelectionGrid = () => {
  const [brandsGridData, setBrandGridData] = useState([]);

  useEffect(() => {
    getBrandsSelectionGridData();
  },[])
  const getBrandsSelectionGridData = async() => {
    const respone = await fetch("http://localhost:3001/brands");
    const data = await respone.json();
    const finalBrandsdata = data?.data[1]?.data || [];
    setBrandGridData(finalBrandsdata);
  }

  return (
    <div block="brand-selection-grid-container">
      <DynamicContentGrid
        brandGridItem = {brandsGridData[0]?.items}
        items_per_row={2}
        type={brandsGridData?.type}
        isHomePage={true}
        widgetID={brandsGridData?.type}
        isMsiteMegaMenu={true}
      />
    </div>
  );
};

export default BrandSelectionGrid;
