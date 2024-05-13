import React, { useState, useEffect, createRef } from "react";
import { connect } from "react-redux";

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
  } = props;

  const [isCityButtonActive, setCityButtonActive] = useState(true);
  const [isAreaButtonActive, setAreaButtonActive] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [cityAreaSearchedText, setCityAreaSearchedText] = useState("");
  const wrapperRef = createRef();

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (showCityAreaSelectionPopUp) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [showCityAreaSelectionPopUp]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showCityAreaSelectionPopUp &&
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target)
    ) {
      showHideCityAreaSelection(false);
    }
  };

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
        (data) => data?.city === selectedCity
      );
    const filteredList = isAreaButtonActive
      ? cityAreaSearchedText != ""
        ? areasForSelectedCity?.areas.filter((val) => {
            if (
              val?.toLowerCase()?.includes(cityAreaSearchedText.toLowerCase())
            ) {
              return val;
            }
          })
        : Object.values(addressCityData)?.find(
            (data) => data?.city === selectedCity
          ).areas
      : isCityButtonActive && cityAreaSearchedText != ""
      ? addressCityData.filter((val) => {
          if (
            val?.city
              ?.toLowerCase()
              .includes(cityAreaSearchedText.toLowerCase())
          ) {
            return val;
          }
        })
      : addressCityData;

    const activeCity = selectedCity ? selectedCity : __("City");
    const activeArea = selectedArea ? selectedArea : __("Area");
    return (
      <div block="cityAreaSelectionMainBlock">
        <div block="cityAreaSelectionOuterblock">
          <div block="cityAreaSelectionPopUp">
            <div block="cityAreaSelectionInnerBlock" ref={wrapperRef}>
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
              <h3>{text}</h3>
              <div block="cityAreaSearchBox">
                <img block="searchIcon" src={Search} />
                <input
                  type="text"
                  block="cityAreaSearchInputBoxForMobile"
                  placeholder={__("Search")}
                  id="cityAreasearchBox"
                  onChange={handleCityAreaText}
                  value={cityAreaSearchedText}
                  autoComplete="off"
                />
              </div>
              <div block="cityAreaList">
                <ul>
                  {isCityButtonActive
                    ? Object.entries(filteredList)?.map((val, index) => {
                        return (
                          <li
                            onClick={() => changeCity(val?.[1]?.city)}
                            key={index}
                          >
                            {val?.[1]?.city}
                          </li>
                        );
                      })
                    : filteredList?.map((val, index) => {
                        return (
                          <li onClick={() => changeArea(val)} key={index}>
                            {val}
                          </li>
                        );
                      })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return render();
};

export default connect(mapStateToProps, null)(CityAreaSelectionPopUp);
