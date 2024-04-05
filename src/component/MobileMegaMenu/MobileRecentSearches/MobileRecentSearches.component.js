import React, { useEffect, useState } from "react";
import Link from "Component/Link";
import "./MobileRecentSearches.style";
import BrowserDatabase from "Util/BrowserDatabase";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import CDN from "Util/API/provider/CDN";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import {
  capitalizeFirstLetter,
  requestedGender,
  saveBrandRecentSearch,
} from "Component/SearchSuggestion/utils/SearchSuggestion.helper";
import Event, {
  EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK,
  MOE_trackEvent
} from "Util/Event";
import { renderMegaMenuAnimationShimer } from "Component/MobileMegaMenu/Utils/MegaMenuShimers.helper";
import { clickPopularSearch, clickRecentSearch } from "Component/MobileMegaMenu/MoEngageTrackingEvents/MoEngageTrackingEvents.helper";


function MobileRecentSearches({ isArabic, recentSearches = [] }) {
  const [trendingBrands, setTrendingBrands] = useState([]);
  const [trandingBrandsLoading, setTrandingBrandsLoading] = useState(true);
  const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender;
  let recentSearchesObj =  JSON.parse(localStorage.getItem("brandRecentSearches")) || {};
  let recentSearchesBrands =  recentSearchesObj[gender] ? recentSearchesObj[gender] : [];
  const countryCode = getCountryFromUrl();

  async function getTrendingBrands() {
    let url = `brands/data_stg/mega_menu_brands_2024-03-11.json`;
    if (process.env.REACT_APP_FOR_JSON === "production") {
      url = `brands/data_prd/mega_menu_brands_2024-03-11.json`;
    }

    try {
      const resp = await CDN.get(url);

      if (resp && resp[countryCode]) {
        const jsonGender = gender.toUpperCase();
        const tempData = resp[countryCode]?.[0]?.[jsonGender];
        // Sort the array based on the "rk" property
        tempData.sort((a, b) => parseInt(a.rk) - parseInt(b.rk));
        setTrendingBrands(tempData);
        setTrandingBrandsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setTrandingBrandsLoading(false);
    }
  }

  const onSearchQueryClick = (search, i) => {
    saveBrandRecentSearch(search);
    clickRecentSearch({
      screen_name: sessionStorage.getItem("currentScreen"),
      gender : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender,
      search_term: search || "",
    })
    MOE_trackEvent(EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK, {
      country: getCountryFromUrl()?.toUpperCase(),
      language: getLanguageFromUrl()?.toUpperCase(),
      search_term: search || "",
      current_page: sessionStorage.getItem("currentScreen"),
      gender : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender,
      suggestion_position: i+1,
      app6thstreet_platform: "Web",
    })
  };

  const renderNewRecentSearch = ({ name, link }, i) => {
    return (
      <li key={i}>
        <Link
          to={
            link
              ? link
              : `/catalogsearch/result/?q=${encodeURIComponent(
                  name
                )}&p=0&dFR[gender][0]=${gender}&prevPage=brands-menu`
          }
          onClick={() => onSearchQueryClick(name, i)}
          key={name}
        >
          <div
            block="SearchSuggestionNew"
            elem="TrandingTagNew"
            className="NewSearchSuggetions"
          >
            {name}
          </div>
        </Link>
      </li>
    );
  };

  const renderNewRecentSearches = () => {
    return recentSearchesBrands.length > 0 ? (
      <div block="NewRecentSearches">
        <h3>{__("Recent Searches")}</h3>
        <ul block="NewRecentSearches" elem="searchList" mods={{ isArabic }}>
          {recentSearchesBrands.map(renderNewRecentSearch)}
        </ul>
      </div>
    ) : null;
  };

  const handleSearchSuggestionClick = (query,i) => {
    MOE_trackEvent(EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK, {
      country: getCountryFromUrl()?.toUpperCase(),
      language: getLanguageFromUrl()?.toUpperCase(),
      search_term: query || "",
      current_page: sessionStorage.getItem("currentScreen"),
      gender : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender,
      suggestion_position: i+1,
      app6thstreet_platform: "Web",
    })
    clickPopularSearch({
      screen_name: sessionStorage.getItem("currentScreen"),
      gender : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender,
      brand_name: query || "",
    })
  }

  const renderNewTrendingBrand = (brand, i) => {
    const { en_brand = "", ar_brand = "", url_path = "", rk = "" } = brand;
    const requestedBrandName = isArabic ? ar_brand : en_brand;
    return (
      <li key={i}>
        <Link
          to={{
            pathname: `/${url_path}.html?q=${encodeURIComponent(
              isArabic ? ar_brand : en_brand
            )}&p=0&dFR[brand_name][0]=${encodeURIComponent(
              isArabic ? ar_brand : en_brand
            )}&dFR[gender][0]=${capitalizeFirstLetter(
              requestedGender(gender)
            )}&dFR[in_stock][0]=${1}&prevPage=brands-menu`,
          }}
          onClick={() => handleSearchSuggestionClick(requestedBrandName,i)}
        >
          <div
            block="SearchSuggestionNew"
            elem="TrandingTagNew"
            className="NewSearchSuggetions"
          >
            {isArabic ? ar_brand : en_brand}
          </div>
        </Link>
      </li>
    );
  };

  const renderNewTrendingBrands = () => {
    return trendingBrands.length > 0 ? (
      <div block="NewRecentSearches" id="newTrendingBrands">
        <h3>{__("Popular Searches")}</h3>
        <ul block="NewRecentSearches" elem="searchList" mods={{ isArabic }}>
          {trendingBrands.map(renderNewTrendingBrand)}
        </ul>
      </div>
    ) : null;
  };

  useEffect(() => {
    getTrendingBrands();
  }, []);

  return (
    <>
      {renderNewRecentSearches()}
      {trandingBrandsLoading
        ? renderMegaMenuAnimationShimer(
            "CategoiresAccordianWrapper",
            "CategoiresAccordianCard",
            5
          )
        : renderNewTrendingBrands()}
    </>
  );
}

export default MobileRecentSearches;
