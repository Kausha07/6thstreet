import { FieldSelect as SourceFieldSelect } from 'SourceComponent/FieldSelect/FieldSelect.component';
import './FieldSelect.style.extended.scss';
import ClickOutside from 'SourceComponent/ClickOutside';
import AddressCityAreaOverlay from 'Component/AddressCityAreaOverlay/AddressCityAreaOverlay';
import isMobile from "Util/Mobile";
export class FieldSelect extends SourceFieldSelect {
    state = {
        isMobile: isMobile.any() || isMobile.tablet(),
    }

    componentDidMount() {
        const { id } = this.props;
        const { isMobile } = this.state;
        
        var selector = document.getElementById(id);

        if(selector && (id === "city" || id === "region_string" || id === "region_id") && isMobile) {

            selector.addEventListener('mousedown', function(event){
            if (event.preventDefault) {
                event.preventDefault(); 
            } 
            });
        }
      }

    componentDidUpdate() {
        const { showCityPopup, citySelected, postCodeValue, id } = this.props;

        if(showCityPopup) {
            const elem = document.getElementById("mobileBottomBar");
            if(elem){
                elem.classList.add('removeZIndex');
            }
        }else{
            const elem = document.getElementById("mobileBottomBar");
            if(elem) {
                elem.classList.remove('removeZIndex');
            }
        }

        if(showCityPopup) {
            const elem = document.getElementById("MyAccountMobileHeader");
            if(elem){
                elem.classList.add('removeZIndex');
            }
        }else{
            const elem = document.getElementById("MyAccountMobileHeader");
            if(elem) {
                elem.classList.remove('removeZIndex');
            }
        }

        if((showCityPopup && citySelected) || (showCityPopup && postCodeValue)) {
            this.handleScroll();
        }
        
    }
    
    renderNativeSelectMobi() {
        const {
            name,
            id,
            onChange,
            selectOptions,
            formRef,
            value,
            isDisabled,
            isSelectExpanded: isExpanded,
            autocomplete,
            skipValue,
            oncityClick,
            showCityPopup,
            handleShowCityPopup,
        } = this.props;

        return (
            <select
              block="FieldSelect"
              elem="Select"
              autoComplete={ autocomplete }
              ref={ formRef }
              name={ name }
              id={ id }
              tabIndex="0"
              value={ value || '' }
              onChange={ onChange }
              className='selectCityArea'
              data-skip-value={ skipValue }
            >
                { this.renderPlaceholderMobi() }
                {showCityPopup ? null : selectOptions.map(this.renderNativeOptionMobi)}
            </select>
        );
    }

    renderNativeOptionMobi = (option) => {
        const { showCityPopup } = this.props;
        const {
            id,
            value,
            disabled,
            label
        } = option;

        if(showCityPopup) {
            return null;
        }
        return (
            <option
              key={ id }
              id={ id }
              value={ value }
              disabled={ disabled }
            >
                { label }
            </option>
        );
    };
    
    renderPlaceholderMobi() {
        const { placeholder, showCityPopup } = this.props;

        if (!placeholder || showCityPopup) {
            return null;
        }

        return (
            <option value="" label={ placeholder } />
        );
    }

    handleScroll() {
        const { citySelected, showCityPopup, postCodeValue } = this.props;
        
        if( citySelected && showCityPopup && citySelected.city) {
          const city = citySelected.city;
          const elementCity = document.getElementById(`${city}`);
          if(elementCity) {
            elementCity.scrollIntoView({ behavior: 'auto', block: "center" });
          }
        }

        if( showCityPopup && postCodeValue ) {
            const cityArea = postCodeValue;
            const  elementArea = document.getElementById(`${cityArea}`);
            if(elementArea) {
                elementArea.scrollIntoView({ behavior: 'auto', block: "center" });
            }
        }
        return;
      }

    render() {
        const {
            isSelectExpanded: isExpanded,
            handleSelectExpand,
            handleSelectListKeyPress,
            handleSelectExpandedExpand,
            selectOptions,
            onChange,
            oncityClick,
            showCityPopup,
            handleShowCityPopup,
            citySelected,
            popupType,
            checking,
            postCodeValue,
        } = this.props;

        const { isMobile } = this.state;
        
        return (

            isMobile && (popupType === "city" || popupType === "area") ? (
                <>
                    {showCityPopup ? (
                        <AddressCityAreaOverlay 
                            selectOptions={selectOptions}
                            onChange={onChange}
                            oncityClick={oncityClick}
                            handleShowCityPopup={handleShowCityPopup}
                            showCityPopup={showCityPopup}
                            citySelected={citySelected}
                            popupType={popupType}
                            postCodeValue={postCodeValue}
                        />
                    ) : (null)}
                        <div
                        block="FieldSelect"
                        onClick={ handleShowCityPopup }
                        role="button"
                        tabIndex="0"
                        aria-label="Select drop-down"
                        aria-expanded={ isExpanded }
                        >
                            { this.renderNativeSelectMobi() }
                        </div>
                </>
            ) : (
                <ClickOutside onClick={ handleSelectExpandedExpand }>
                    <div
                    block="FieldSelect"
                    onClick={ handleSelectExpand }
                    onKeyPress={ handleSelectListKeyPress }
                    role="button"
                    tabIndex="0"
                    aria-label="Select drop-down"
                    aria-expanded={ isExpanded }
                    >
                        { this.renderNativeSelect() }
                        { this.renderOptions() }
                    </div>
                </ClickOutside>
            )

        );
    }
}

export default FieldSelect;

