import React, { useState } from "react";
import { connect } from "react-redux";
import { isArabic } from "Util/App";
import ModalWithOutsideClick from "Component/ModalWithOutsideClick";
import Search from "Component/Icons/Search/icon.svg";
import "./CityAreaSelectionPopUp.style.scss";

export const mapStateToProps = (state) => ({
  addressCityData: state.MyAccountReducer.addressCityData,
});

export const CityAreaSelectionPopUp = (props) => {
  const {
    addressCityData,
    showHideCityAreaSelection,
    showCityAreaSelectionPopUp,
    autoPopulateCityArea,
    setExpressPopUp,
  } = props;

  const [isCityButtonActive, setCityButtonActive] = useState(true);
  const [isAreaButtonActive, setAreaButtonActive] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [cityAreaSearchedText, setCityAreaSearchedText] = useState("");

  const setActiveButton = (id) => {
    if (id === "city") {
      setCityButtonActive(true);
      setAreaButtonActive(false);
      setCityAreaSearchedText("");
    } else {
      setCityButtonActive(false);
      setAreaButtonActive(true);
      setCityAreaSearchedText("");
    }
  };

  const changeCity = (val) => {
    setSelectedCity(val);
    setCityButtonActive(false);
    setAreaButtonActive(true);
    setCityAreaSearchedText("");
  };

  const changeArea = (val) => {
    setSelectedArea(val);
    setCityAreaSearchedText("");
    showHideCityAreaSelection(false);
    let selectedAddress = { area: val, city: selectedCity };
    autoPopulateCityArea(selectedAddress);
  };

  const handleCityAreaText = (e) => {
    setCityAreaSearchedText(e.target.value);
  };

  const render = () => {
    const text = isCityButtonActive
      ? __("Select a City")
      : __("Select an Area");

    const areasForSelectedCity =
      isAreaButtonActive &&
      selectedCity &&
      Object.values(addressCityData)?.find(
        (data) => data?.[isArabic() ? "city_ar" : "city"] === selectedCity
      );
    const filteredList = isAreaButtonActive
      ? cityAreaSearchedText != ""
        ? areasForSelectedCity?.[isArabic() ? "areas_ar" : "areas"]?.filter(
            (val) => {
              if (
                val
                  ?.toLowerCase()
                  ?.includes(cityAreaSearchedText?.toLowerCase())
              ) {
                return val;
              }
            }
          )
        : Object.values(addressCityData)?.find(
            (data) => data?.[isArabic() ? "city_ar" : "city"] === selectedCity
          )?.[isArabic() ? "areas_ar" : "areas"]
      : isCityButtonActive && cityAreaSearchedText != ""
      ? addressCityData.filter((val) => {
          if (
            val?.[isArabic() ? "city_ar" : "city"]
              ?.toLowerCase()
              ?.includes(cityAreaSearchedText?.toLowerCase())
          ) {
            return val;
          }
        })
      : addressCityData;

    const activeCity = selectedCity ? selectedCity : __("City");
    const activeArea = selectedArea ? selectedArea : __("Area");
    return (
      <ModalWithOutsideClick
        show={showCityAreaSelectionPopUp}
        onClose={() => {
          setExpressPopUp(false);
          return showHideCityAreaSelection(false);
        }}
      >
        <div block="cityAreaSelectionMainBlock" mods={{ isArabic: isArabic() }}>
          <div block="cityAreaSelectionOuterblock">
            <div block="cityAreaSelectionPopUp">
              <div block="cityAreaSelectionInnerBlock">
                <div block="cityAreaButtons">
                  <button
                    block={`button ${isCityButtonActive ? "active" : ""}`}
                    onClick={() => setActiveButton("city")}
                  >
                    {activeCity}
                  </button>
                  <button
                    block={`button ${isAreaButtonActive ? "active" : ""}`}
                    onClick={() => setActiveButton("area")}
                    disabled={selectedCity ? false : true}
                  >
                    {activeArea}
                  </button>
                </div>
                <h3 block="headingText">{text}</h3>
                <div block="cityAreaSearchBox">
                  <img
                    block="searchIcon"
                    src={Search}
                    mods={{ isArabic: isArabic() }}
                  />
                  <input
                    type="text"
                    block="cityAreaSearchInputBoxForMobile"
                    placeholder={__("Search")}
                    id="cityAreasearchBox"
                    onChange={handleCityAreaText}
                    value={cityAreaSearchedText}
                    autoComplete="off"
                    mods={{ isArabic: isArabic() }}
                  />
                </div>
                <div block="cityAreaList">
                  {isCityButtonActive ? (
                    <ul block="cityAreaUL">
                      {Object.entries(filteredList)?.map((val, index) => {
                        return (
                          <li
                            onClick={() =>
                              changeCity(
                                val?.[1]?.[isArabic() ? "city_ar" : "city"]
                              )
                            }
                            key={index}
                            block="cityListLI"
                          >
                            {val?.[1]?.[isArabic() ? "city_ar" : "city"]}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul block="cityAreaUL">
                      {filteredList?.map((val, index) => {
                        return (
                          <li
                            onClick={() => changeArea(val)}
                            key={index}
                            block="areaListLI"
                          >
                            {val}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalWithOutsideClick>
    );
  };
  return render();
};

export default connect(mapStateToProps, null)(CityAreaSelectionPopUp);
