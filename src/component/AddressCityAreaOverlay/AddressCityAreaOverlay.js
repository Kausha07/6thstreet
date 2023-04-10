import { PureComponent, useEffect } from "react";
import "./AddressCityAreaOverlay.style";
import { isArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";


class AddressCityAreaOverlay extends PureComponent {
    constructor(props) {
        super(props);
        this.newPopup = React.createRef();
    }
    state = {
        isArabic : isArabic(),
        isSignedIn: isSignedIn(),
        searchInput: "",
        selectCityOptions: this.props.selectOptions || null,
        isOnFullScreen : false,
        checkclickCTAr: false
    }    
    
    hideAddressCityAreaPopup = (e, value) => {
        e.stopPropagation()
        this.props.onChange(value)
        this.props.handleShowCityPopup();

    }

    renderSelectCityItem() {
        const { selectOptions, oncityClick, onChange, citySelected, postCodeValue } = this.props;
        const { selectCityOptions } = this.state;
        const { isArabic } = this.state;
        if (!selectCityOptions) {
          return (
            <ul>
              <span block="NoAreaFound">No City Found</span>
            </ul>
          );
        }

        return (
          <ul block="cityAreaListUl" mods={{ isArabic }}>
            {selectCityOptions.map((obj) => {
              const { id, label, value } = obj;
                  
              return (
                (citySelected?.city === value || postCodeValue === value || citySelected === value) ? (
                  <li
                  key={id}
                    id={label}
                    onClick={(e) => this.hideAddressCityAreaPopup(e,value)}                    
                  >
                    <button
                      block={`CountrySwitcher`}
                      elem="CountryBtn"
                      className="activeselectedclasa"
                      mods={{ isArabic }}
                    >
                      <span>{isArabic ? label : value.toUpperCase()}</span>
                    </button>
                    <button
                      block={`CountrySwitcher`}
                      elem="CountryBtn"
                      className="abutton34"
                      mods={{ isArabic }}
                    >
                      ✓
                    </button>
                  </li>
                ) : (

                <li
                key={id}
                  id={label}
                  onClick={(e) => this.hideAddressCityAreaPopup(e,value)}
                >
                  <button
                    block={`CountrySwitcher`}
                    elem="CountryBtn"
                    className="cityAreaListLi"
                    mods={{ isArabic }}
                  >
                    <span>{isArabic ? label : value.toUpperCase()}</span>
                  </button>
                </li>
                )
              );
            })}
          </ul>
        );
    }

    handleSearchChange(e) {
        this.setState({searchInput:e.target.value});

        const { selectOptions } = this.props;
        const selectCityOptions = selectOptions;
        const searchInput = e.target.value;
        let filterArr = [];

        filterArr = selectCityOptions.filter((val) => {
          let { value } = val;
          if(value.toLowerCase().includes(searchInput.toLowerCase())) {
            return val;
          }
        })

        this.setState({selectCityOptions:filterArr})
  
    }

    // addclass100vh(e) {
    //   const elem = document.getElementById("cityAreaPopupBlockone");
    //   elem.classList.add('active');
    // }

    handleOnFocus(e) {
      e.stopPropagation();
      this.setState({ isOnFullScreen: true })
      // const elem = document.getElementById("cityAreaPopupBlockone");
      // elem.classList.add('active');
      
    }

    renderCitySearch() {
        const { isArabic } = this.state;
        return(
            <>
                <input
                    block="citySearchInput"
                    mods={{ isArabic }}
                    type="search"
                    value={this.state.searchInput}
                    // onClick={(e) => this.addclass100vh(e)}
                    onChange={(e) => this.handleSearchChange(e)}
                    onFocus={(e) => this.handleOnFocus(e)}
                    autoComplete="off"
                    placeholder={ __("Search...") }
                />
            </>
        )
    }

    checkclick =(e)=> {
      const { handleShowCityPopup } = this.props;
      e.stopPropagation();
      handleShowCityPopup(e)
    }

    checkclickCTAr = (e) => {
      e.stopPropagation();
      this.setState({ checkclickCTAr: !this.state.checkclickCTAr})     
    }

    renderBack() {
      return (
        <div block="CartPagenewone" elem="BackArrow">
          <button block="BackArrow-Button" onClick={this.checkclick}>
            <span />
          </button>
        </div>
      );
    }
    


    render() {
        const { isArabic, isOnFullScreen, isSignedIn } = this.state;
        const { handleShowCityPopup, popupType } = this.props;

        return (
            <div
              block="cityAreaPopup"
              onClick={(e) => this.checkclick(e)}
              key={"IamUniquOne"}
            >
                <div block="cityAreaOverlay">
                    <div block="cityAreaPopupBlock" ref={this.newPopup} 
                      onClick={(e) => this.checkclickCTAr(e)}
                      id="cityAreaPopupBlockone"
                      
                    >   
                        <div block="overlayHeader" 
                        // mods={{ isOnFullScreen }}
                        >
                          {(!isSignedIn && isOnFullScreen ) ? this.renderBack() : null}
                          <>
                              <h4
                                block="cityAreaPopupBlock"
                                elem="titleMeassage"
                                // mods={{ isOnFullScreen }}
                              >
                                  {popupType === "city" ? __("SELECT A CITY") : __("SELECT AN AREA") }
                              </h4>
                          </>
                          <div block="citySearch">{this.renderCitySearch()}</div>
                        </div>
                      <div block="CityDrop">{this.renderSelectCityItem()}</div>       
                    </div>
                </div>
            </div>
        )
    }
}

export default AddressCityAreaOverlay;
