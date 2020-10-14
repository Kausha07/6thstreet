import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import PLPFilterOption from 'Component/PLPFilterOption';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import './FieldMultiselect.style';

class FieldMultiselect extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string
    };

    static defaultProps = {
        placeholder: ''
    };

    filterButtonRef = createRef();

    constructor(props) {
        super(props);
        this.state = {
            toggleOptionsList: false,
            isArabic: isArabic()
        };
        this.toggelOptionList = this.toggelOptionList.bind(this);
    }

    renderOption = ([key, option]) => {
        const { filter: { is_radio } } = this.props;

        if (option.subcategories) {
            return Object.entries(option.subcategories).map(this.renderOption);
        }

        return (
            <PLPFilterOption
              key={ key }
              option={ option }
              isRadio={ is_radio }
              onClick={ this.onCheckboxOptionClick }
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

    onCheckboxOptionClick = () => {
        console.log('-------------------');
        this.filterButtonRef.current.focus();
    };

    toggelOptionList() {
        const { toggleOptionsList } = this.state;

        this.setState({
            toggleOptionsList: !toggleOptionsList
        });
    }

    onBlur = () => {
        // eslint-disable-next-line no-magic-numbers
        setTimeout(this.toggelOptionList, 100);
    };

    renderMultiselectContainer() {
        const { toggleOptionsList, isArabic } = this.state;
        const { placeholder, onChange } = this.props;

        return (
            <div block="FieldMultiselect">
            <button
              ref={ this.filterButtonRef }
              type="button"
              block="FieldMultiselect"
              elem="FilterButton"
              mods={ { toggleOptionsList } }
              mix={ {
                  block: 'FieldMultiselect',
                  elem: 'FilterButton',
                  mods: { isArabic }
              } }
              onFocus={ this.toggelOptionList }
              onBlur={ this.onBlur }
            >
                { placeholder }
            </button>
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
        console.log(this.filterButtonRef.current);
        return this.renderMultiselectContainer();
    }
}

export default FieldMultiselect;
