import { ENTER_KEY_CODE } from 'Component/Field/Field.config';
import { FieldSelectContainer as SourceFieldSelectContainer } from 'SourceComponent/FieldSelect/FieldSelect.container';
import { isArabic } from "Util/App";
import { AddressCityAreaOverlay } from 'Component/AddressCityAreaOverlay/AddressCityAreaOverlay';
import {
    A_KEY_CODE,
    a_KEY_CODE,
    Z_KEY_CODE,
    z_KEY_CODE
} from './FieldSelect.config';

export class FieldSelectContainer extends SourceFieldSelectContainer {
    static defaultProps = {
        selectOptions: [],
        formRef: () => {},
        onChange: () => {},
        oncityClick: () => {},
        citySelected: null,
        popupType: "",
        postCodeValue: null,
    };
    state = {
        isArabic: isArabic(),
        showPopupField: false,
        showCityPopup: false,
    };
    containerFunctions = {
        handleSelectExpand: this.handleSelectExpand.bind(this),
        handleSelectExpandedExpand: this.handleSelectExpandedExpand.bind(this),
        handleSelectListOptionClick: this.handleSelectListOptionClick.bind(this),
        handleSelectListKeyPress: this.handleSelectListKeyPress.bind(this),
        handleShowCityPopup: this.handleShowCityPopup.bind(this),
    };

    handleSelectListKeyPress(event) {
        const { isSelectExpanded } = this.state;
        const { selectOptions, onChange, id: selectId } = this.props;
        const keyCode = event.which || event.keycode;

        // on Enter pressed
        if (keyCode === ENTER_KEY_CODE) {
            this.handleSelectExpand();
            return;
        }

        if (!isSelectExpanded
            || !keyCode
            || keyCode < A_KEY_CODE
            || keyCode > z_KEY_CODE
            || (keyCode > Z_KEY_CODE && keyCode < a_KEY_CODE)
        ) {
            return;
        }

        const { searchString, valueIndex } = this._getSelectedValueIndex(keyCode);

        // valueIndex can be 0, so !valueIndex === true
        if (!searchString || valueIndex === null) {
            return;
        }

        this.setState({ searchString, valueIndex }, () => {
            const { id, value } = selectOptions[valueIndex];
            // converting to string for avoiding the error with the first select option
            onChange(value.toString());
            const formattedId = id.split(' ')[0];
            const selectedElement = document.querySelector(`#${selectId} + ul #o${formattedId}`);

            if (selectedElement) {
                selectedElement.focus();
            }
        });
    }
    containerProps = () => {
        const {
            valueIndex,
            searchString,
            isSelectExpanded,
            isArabic,
            showPopupField,
            showCityPopup,
        } = this.state;

        return {
            selectOptions: this.sortSelectOptions(),
            valueIndex,
            searchString,
            isSelectExpanded,
            isArabic,
            showPopupField,
            showCityPopup,
        };
    };
    handleShowCityPopup(e) {
        this.setState({showCityPopup: !this.state.showCityPopup})
    }

    handleSelectExpand() {
        this.setState(({ isSelectExpanded }) => ({ isSelectExpanded: !isSelectExpanded }));
    }
}

export default FieldSelectContainer;
