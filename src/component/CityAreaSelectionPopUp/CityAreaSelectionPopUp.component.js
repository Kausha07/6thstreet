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
  const [selectedCity, setSelectedCity] = useState(
    JSON.parse(localStorage?.getItem("currentSelectedAddress"))?.city
      ? JSON.parse(localStorage?.getItem("currentSelectedAddress"))?.[
          isArabic() ? "city_ar" : "city"
        ]
      : ""
  );
  const [selectedArea, setSelectedArea] = useState(
    JSON.parse(localStorage?.getItem("currentSelectedAddress"))?.area
      ? JSON.parse(localStorage?.getItem("currentSelectedAddress"))?.[
          isArabic() ? "area_ar" : "area"
        ]
      : ""
  );
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
    setSelectedCity(val?.[isArabic() ? "city_ar" : "city"]);
    setCityButtonActive(false);
    setAreaButtonActive(true);
    setCityAreaSearchedText("");
  };

  const changeArea = (val) => {
    setSelectedArea(val?.[isArabic() ? "area_ar" : "area"]);
    setCityAreaSearchedText("");
    showHideCityAreaSelection(false);
    let value = { ...val, isSelectedFromCitySelectionPopUp: true };
    autoPopulateCityArea(value);
  };

  const handleCityAreaText = (e) => {
    setCityAreaSearchedText(e.target.value);
  };

  const getCitiesForSearchedText = (addressCityData) => {
    return addressCityData.filter((val) => {
      if (
        val?.["city"]
          ?.toLowerCase()
          ?.includes(cityAreaSearchedText?.toLowerCase())
      ) {
        return val;
      }
    });
  };

  const getAreasForSearchedText = (areasForSelectedCity) => {
    let reqOBJ = {
      city: areasForSelectedCity?.city,
      city_ar: areasForSelectedCity?.city_ar,
      areas: areasForSelectedCity?.["areas"]?.filter((val) => {
        if (val?.toLowerCase()?.includes(cityAreaSearchedText?.toLowerCase())) {
          return val;
        }
      }),

      areas_ar: areasForSelectedCity?.["areas_ar"]?.filter((val) => {
        if (val?.toLowerCase()?.includes(cityAreaSearchedText?.toLowerCase())) {
          return val;
        }
      }),
    };

    return reqOBJ;
  };

  const render = () => {
    const text = isCityButtonActive
      ? __("Select a City")
      : __("Select an Area");

    const areasForSelectedCity =
      isAreaButtonActive &&
      selectedCity &&
      addressCityData?.find(
        (data) => data?.[isArabic() ? "city_ar" : "city"] === selectedCity
      );
    const filteredList = isAreaButtonActive
      ? cityAreaSearchedText != ""
        ? getAreasForSearchedText(areasForSelectedCity)
        : areasForSelectedCity
      : isCityButtonActive && cityAreaSearchedText != ""
      ? getCitiesForSearchedText(addressCityData)
      : addressCityData;

    const activeCity = selectedCity ? selectedCity : __("City");
    const activeArea = selectedArea ? selectedArea : __("Area");
    let valueClick = {};
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
                      {filteredList?.map((val, index) => {
                        return (
                          <li
                            onClick={() => changeCity(val)}
                            key={index}
                            block="cityListLI"
                          >
                            {val?.[isArabic() ? "city_ar" : "city"]}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul block="cityAreaUL">
                      {filteredList?.[isArabic() ? "areas_ar" : "areas"]?.map(
                        (val, index) => {
                          return (
                            <li
                              onClick={() => {
                                valueClick = {
                                  city: filteredList?.city,
                                  city_ar: filteredList?.city_ar,
                                  area: filteredList?.areas?.[index],
                                  area_ar: filteredList?.areas_ar?.[index],
                                };
                                changeArea(valueClick);
                              }}
                              key={index}
                              block="areaListLI"
                            >
                              {val}
                            </li>
                          );
                        }
                      )}
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
