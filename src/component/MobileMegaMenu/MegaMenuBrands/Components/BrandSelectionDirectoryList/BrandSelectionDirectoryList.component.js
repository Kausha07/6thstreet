import { useState, useRef, useEffect } from "react";
import Loader from "Component/Loader";
import Link from "Component/Link";
import { isArabic } from "Util/App";
import "./BrandSelectionDirectoryList.style.scss";
const BrandSelectionDirectoryList = (props) => {
  const [alphabet, setAlphabet] = useState("");
  const isArabicValue = isArabic();
  const alphabetRefs = useRef({});
  const [fixFilter, setFixFilter] = useState(false);
  const [fixWindow, setFixWindow] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  },[])
 
  const getFilteredData =() => {
    const { brands = [] } = props;
    const brandsData = brands?.filter((data)=>{
      if(data?.[0]?.toLowerCase() === alphabet?.toLowerCase()){
        return data;
      }
    })
    return brandsData;
  }
  const requestedGender = (gender) => {
    if (gender === "kids") {
      return isArabicValue ? "أولاد,بنات" : "Boy,Girl";
    } else if (gender === "نساء") {
      return "نساء";
    } else if (gender === "رجال") {
      return "رجال";
    } else if (gender === "أطفال") {
      return  "أولاد,بنات";
    } else {
      return gender;
    }
  }
  const capitalizeFirstLetter = (string = "") => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const onFixWindowMethod = (e) => {
    let myDiv = document.getElementById("brands-letter-filter-scroll")
    let n = myDiv.scrollHeight - myDiv.offsetHeight
    myDiv.scrollBy(
      {
        top: n,
        left: 0,
        behavior: 'instant'
      }
    )
  }

  const onNotFixWindow = () => {
    let myDiv = document.getElementById("brands-letter-filter-scroll")
    let n = myDiv.scrollHeight - myDiv.offsetHeight
    myDiv.scrollBy(
      {
        top: -n,
        left: 0,
        behavior: 'instant'
      }
    )
  }

  const handleScroll = (e) => {
    let k = document.getElementById("megamenu-brands-main-container-id");
    let gridKvalue = document.getElementById("brand-selection-grid-container-id");
    if (k) {
      if ((k.offsetHeight - (document.body.offsetHeight - gridKvalue?.offsetHeight) + 50) < window.pageYOffset) {
        if (!fixWindow) {
          setFixWindow(true);
          onFixWindowMethod(e)
        }


      }
      if ((k.offsetHeight - (document.body.offsetHeight - gridKvalue?.offsetHeight) + 50) > window.pageYOffset) {
        if (fixWindow) {
          setFixWindow(false);
          onNotFixWindow(e)
        }

      }

      if (window.pageYOffset > gridKvalue?.offsetHeight) {
          setFixFilter(true);
      }else {
        setFixFilter(false);
      }
    }
  }
 
 
  const renderBrandGroups = () => {
    const { brands = [], gender = "women" } = props;
    const refinedData = alphabet ? getFilteredData() : brands;
    return refinedData?.map((brand,index)=>{
      const alphabeticalBrands = brand[1] || [];
      const alphabet = brand[0] || "";
      return (
        <div
          block="Brand"
          key={alphabet}
          ref={(ref) => (alphabetRefs.current[alphabet] = ref)}
        >
          <h3>{alphabet}</h3>
          {alphabeticalBrands?.map((individualBrand,index) => (
            <Link
              to={`/${individualBrand?.url_path}.html?q=${encodeURIComponent(
                individualBrand?.name
              )}&p=0&dFR[brand_name][0]=${encodeURIComponent(
                individualBrand?.name
              )}&dFR[gender][0]=${capitalizeFirstLetter(
                requestedGender(gender)
              )}&dFR[in_stock][0]=${1}`}
              block="BrandLink"
              key={index}
            >
              {isArabicValue ? individualBrand?.name_ar : individualBrand?.name}
            </Link>
          ))}
          <div block="horizatal-line"></div>
        </div>
      );
    });
  }
  const onBrandLetterClick = (key) => {
    if (alphabetRefs?.current?.[key]) {
      window.scrollTo(0, alphabetRefs?.current?.[key].offsetTop);
      handleScroll();
    }
  };
  const renderLetterSelector = () => {
    const { brands = [] } = props;
 
    return (
      <div block="Brands" elem={fixFilter ? "FixScroll" : "Scroll"} mods={{isArabicValue}} id="brands-letter-filter-scroll">
        {brands.map(([key]) => (
          <button
            key={key}
            block="Brands"
            elem="LetterButton"
            onClick={() => onBrandLetterClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    );
  };
 
  return (
    <div block="brand-selection-directory-main-container" id="brand-selection-directory-main-container-id">
      <Loader isLoading={props?.isLoading} />
      <h2 block="Brands" elem="Heading">
        {__("A-Z Brands")}
      </h2>
      <div block='brands-list-alphabetically-container'>
        <div block="Brands" elem="Groups">
          {renderBrandGroups()}
        </div>
        {renderLetterSelector()}
      </div>
    </div>
  );
};
export default BrandSelectionDirectoryList;
