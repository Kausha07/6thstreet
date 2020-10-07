/* eslint-disable */
import React from 'react';

import ms from './FieldMultiselect.style';
import Field from 'SourceComponent/Field';
// import '../assets/closeicon/css/fontello.css';
import PLPFilterOption from 'Component/PLPFilterOption';

const closeIconTypes = {
    circle: 'icon_cancel_circled',
    circle2: 'icon_cancel_circled2',
    close: 'icon_window_close',
    cancel: 'icon_cancel'
};

class FieldMultiselect extends React.Component {
    static defaultProps = {
        options: [],
        disablePreSelectedValues: false,
        selectedValues: [],
        isObject: true,
        displayValue: 'model',
        showCheckbox: false,
        selectionLimit: -1,
        placeholder: 'Select',
        groupBy: '',
        style: {},
        emptyRecordMsg: 'No Options Available',
        onSelect: () => {},
        onRemove: () => {},
        closeIcon: 'circle2',
        singleSelect: false,
        caseSensitiveSearch: false,
        id: '',
        closeOnSelect: true,
        avoidHighlightFirstOption: false,
        hidePlaceholder: false
    };
    
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            options: props.options,
            filteredOptions: props.options,
            unfilteredOptions: props.options,
            selectedValues: Object.assign([], props.selectedValues),
            preSelectedValues: Object.assign([], props.selectedValues),
            toggleOptionsList: false,
            highlightOption: props.avoidHighlightFirstOption ? -1 : 0,
            showCheckbox: props.showCheckbox,
            groupedObject: [],
            closeIconType: closeIconTypes[props.closeIcon] || closeIconTypes.circle
        };
        this.searchWrapper = React.createRef();
        this.searchBox = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.renderMultiselectContainer = this.renderMultiselectContainer.bind(this);
        this.onRemoveSelectedItem = this.onRemoveSelectedItem.bind(this);
        this.toggelOptionList = this.toggelOptionList.bind(this);
        this.onArrowKeyNavigation = this.onArrowKeyNavigation.bind(this);
        this.filterOptionsByInput = this.filterOptionsByInput.bind(this);
        this.removeSelectedValuesFromOptions = this.removeSelectedValuesFromOptions.bind(this);
        this.renderNormalOption = this.renderNormalOption.bind(this);
        this.listenerCallback = this.listenerCallback.bind(this);
        this.resetSelectedValues = this.resetSelectedValues.bind(this);
        this.getSelectedItems = this.getSelectedItems.bind(this);
        this.getSelectedItemsCount = this.getSelectedItemsCount.bind(this);
    }

    initialSetValue() {
        const { showCheckbox, groupBy, singleSelect } = this.props;
        const { options } = this.state;
        if (!showCheckbox && !singleSelect) {
            this.removeSelectedValuesFromOptions(false);
        }
        if (groupBy && showCheckbox) {
            this.groupByOptions(options);
        }
    }

    resetSelectedValues() {
        const { unfilteredOptions } = this.state;
        return new Promise((resolve) => {
            this.setState({
                selectedValues: [],
                preSelectedValues: [],
                options: unfilteredOptions,
                filteredOptions: unfilteredOptions
            }, () => {
                resolve();
                this.initialSetValue();
            });
        });
    }

    getSelectedItems() {
        return this.state.selectedValues;
    }

    getSelectedItemsCount() {
        return this.state.selectedValues.length;
    }

    componentDidMount() {
        this.initialSetValue();
        this.searchWrapper.current.addEventListener('click', this.listenerCallback);
    }

    componentDidUpdate(prevProps) {
        const { options, selectedValues } = this.props;
        const { options: prevOptions, selectedValues: prevSelectedvalues } = prevProps;
        if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
            this.setState({ options, filteredOptions: options, unfilteredOptions: options }, this.initialSetValue);
        }
        if (JSON.stringify(prevSelectedvalues) !== JSON.stringify(selectedValues)) {
            this.setState({ selectedValues: Object.assign([], selectedValues), preSelectedValues: Object.assign([], selectedValues) }, this.initialSetValue);
        }
    }

    listenerCallback() {
        this.searchBox.current.focus();
    }

    componentWillUnmount() {
        this.searchWrapper.current.removeEventListener('click', this.listenerCallback);
    }

    // Skipcheck flag - value will be true when the func called from on deselect anything.
    removeSelectedValuesFromOptions(skipCheck) {
        const { isObject, displayValue, groupBy } = this.props;
        const { selectedValues = [], unfilteredOptions, options } = this.state;
        if (!skipCheck && groupBy) {
            this.groupByOptions(options);
        }
        if (!selectedValues.length && !skipCheck) {
            return;
        }
        if (isObject) {
            const optionList = unfilteredOptions.filter((item) => (selectedValues.findIndex(
                (v) => v[displayValue] === item[displayValue]
            ) === -1));

            if (groupBy) {
                this.groupByOptions(optionList);
            }
            this.setState(
                { options: optionList, filteredOptions: optionList },
                this.filterOptionsByInput
            );

            return;
        }
        const optionList = unfilteredOptions.filter(
            (item) => selectedValues.indexOf(item) === -1
        );

        this.setState(
            { options: optionList, filteredOptions: optionList },
            this.filterOptionsByInput
        );
    }

    groupByOptions(options) {
        const { groupBy } = this.props;
        const groupedObject = options.reduce((r, a) => {
            const key = a[groupBy] || 'Others';
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create({}));

        this.setState({ groupedObject });
    }

    onChange(event) {
        const { onSearch } = this.props;
        this.setState(
            { inputValue: event.target.value },
            this.filterOptionsByInput
        );
        if (onSearch) {
            onSearch(event.target.value);
        }
    }

    filterOptionsByInput() {
        let { options, filteredOptions, inputValue } = this.state;
        const { isObject, displayValue } = this.props;
        if (isObject) {
            options = filteredOptions.filter((i) => this.matchValues(i[displayValue], inputValue));
        } else {
            options = filteredOptions.filter((i) => this.matchValues(i, inputValue));
        }
        this.groupByOptions(options);
        this.setState({ options });
    }

    matchValues(value, search) {
        if (this.props.caseSensitiveSearch) {
            return value.indexOf(search) > -1;
        }

        return value;
    }

    onArrowKeyNavigation(e) {
        // const {
        //     options,
        //     highlightOption,
        //     toggleOptionsList,
        //     inputValue,
        //     selectedValues
        // } = this.state;

        // if (e.keyCode === 8 && !inputValue && selectedValues.length) {
        //     this.onRemoveSelectedItem(selectedValues.length - 1);
        // }
        // if (!options.length) {
        //     return;
        // }
        // if (e.keyCode === 38) {
        //     if (highlightOption > 0) {
        //         this.setState((previousState) => ({
        //             highlightOption: previousState.highlightOption - 1
        //         }));
        //     } else {
        //         this.setState({ highlightOption: options.length - 1 });
        //     }
        // } else if (e.keyCode === 40) {
        //     if (highlightOption < options.length - 1) {
        //         this.setState((previousState) => ({
        //             highlightOption: previousState.highlightOption + 1
        //         }));
        //     } else {
        //         this.setState({ highlightOption: 0 });
        //     }
        // } else if (e.key === 'Enter' && options.length && toggleOptionsList) {
        //     if (highlightOption === -1) {
        //         return;
        //     }
        //     this.onSelectItem(options[highlightOption]);
        // }
    // TODO: Instead of scrollIntoView need to find better soln for scroll the dropwdown container.
    // setTimeout(() => {
    //   const element = document.querySelector("ul.optionContainer .highlight");
    //   if (element) {
    //     element.scrollIntoView();
    //   }
    // });
    }

    onRemoveSelectedItem(item) {
        let { selectedValues, index = 0, isObject } = this.state;
        const { onRemove, showCheckbox } = this.props;
        if (isObject) {
            index = selectedValues.findIndex(
                (i) => i[displayValue] === item[displayValue]
            );
        } else {
            index = selectedValues.indexOf(item);
        }
        selectedValues.splice(index, 1);
        onRemove(selectedValues, item);
        this.setState({ selectedValues }, () => {
            if (!showCheckbox) {
                this.removeSelectedValuesFromOptions(true);
            }
        });
        if (!this.props.closeOnSelect) {
            this.searchBox.current.focus();
        }
    }

    onSelectItem = (item) => {
        const { selectedValues } = this.state;
        const {
            selectionLimit, onSelect, showCheckbox, isRadio, closeOnSelect
        } = this.props;

 
        if (isRadio) {
            this.onSingleSelect(item);
            onSelect([item], item);
            return;
        }
        if (this.isSelectedValue(item)) {
            this.onRemoveSelectedItem(item);
            return;
        }
        if (selectionLimit == selectedValues.length) {
            return;
        }
        selectedValues.push(item);
        onSelect(selectedValues, item);
        // this.setState({ selectedValues }, () => {
        //     if (!showCheckbox) {
        //         this.removeSelectedValuesFromOptions(true);
        //     } else {
        //         this.filterOptionsByInput();
        //     }
        // });
        if (!closeOnSelect) {
            this.searchBox.current.focus();
        }
    }

    renderOption = ([key, option]) => {
        const { filter: { is_radio } } = this.props;

        if (option.subcategories) {
            return Object.entries(option.subcategories).map(this.renderOption)
        }

        return (
            <PLPFilterOption
                key={ key }
                option={ option }
                isRadio={ is_radio }
            />
        );
    };

    renderOptions() {
        const { filter: { data } } = this.props;

        return (
            <ul>
                { Object.entries(data).map(this.renderOption) }
            </ul>
        );
    }

    renderNormalOption() {
        const {
            isObject = false, displayValue, showCheckbox, style, singleSelect, isRadio, onSelect
        } = this.props;

        return this.state.options.map((option, i) => (
        //   <li
        //     block="FieldMultiselect"
        //     elem="List"
        //   >
        //     { showCheckbox && !singleSelect && (
        //       <Field
        //         type={ isRadio ? 'radio' : 'checkbox' }
        //         id={ option.value }
        //         name={ option.name }
        //         value={ option.value }
        //         checked={ option.checked }
        //       />
        //     ) }
        //     <label>
        //     { option.name }
        //         <span>
        //             { option.count ? ` (${option.count})` : null}
        //         </span>
        //     </label>
        //   </li>
        this.renderOption
        ));
    }

    toggelOptionList() {
        this.setState({
            toggleOptionsList: !this.state.toggleOptionsList,
            highlightOption: this.props.avoidHighlightFirstOption ? -1 : 0
        });
    }

    renderMultiselectContainer() {
        const { inputValue, toggleOptionsList, selectedValues } = this.state;
        const {
            placeholder, style, singleSelect, id, hidePlaceholder, disable, onChange
        } = this.props;

        return (
      <div className={ `${ms.multiSelectContainer} ${disable ? `${ms.disable_ms} disable_ms` : ''}` } id={ id || 'multiselectContainerReact' } style={ style.multiselectContainer }>
        <div
          className={ `${ms.searchWrapper} ${singleSelect ? ms.singleSelect : ''}` }
          ref={ this.searchWrapper }
          style={ style.searchBox }
          onClick={ singleSelect ? this.toggelOptionList : () => {} }
        >
          <button
            ref={ this.searchBox }
            type="button"
            block="FieldMultiselect"
            elem="FilterButton"
            mods={ { toggleOptionsList } }
            id={ placeholder }
            onChange={ this.onChange }
            value={ inputValue }
            onFocus={ this.toggelOptionList }
            onBlur={ () => setTimeout(this.toggelOptionList, 200) }
            onKeyDown={ this.onArrowKeyNavigation }
            style={ style.inputField }
            autoComplete="off"
            disabled={ singleSelect || disable }
          >
            { placeholder }
          </button>
          { singleSelect && (
<i
  className={ `icon_cancel ${ms.icon_down_dir}` }
/>
          ) }
        </div>
        <div
          block="FieldMultiselect"
          elem="OptionListContainer"
          mods={ { toggleOptionsList } }
        >
          <fieldset
              block="PLPFilter"
              onChange={ onChange }
            >
                { this.renderOptions() }
            </fieldset>
        </div>
      </div>
        );
    }

    render() {
        return this.renderMultiselectContainer();
    }
}

export default FieldMultiselect;
