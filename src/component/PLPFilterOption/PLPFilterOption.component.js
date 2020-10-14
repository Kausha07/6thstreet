import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { FilterOption } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import './PLPFilterOption.style';

class PLPFilterOption extends PureComponent {
    static propTypes = {
        option: FilterOption.isRequired,
        isRadio: PropTypes.bool.isRequired,
        onCheckboxOptionClick: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    renderField() {
        const {
            option: {
                facet_key,
                facet_value,
                is_selected: checked
            },
            isRadio,
            onCheckboxOptionClick
        } = this.props;

        console.log(onCheckboxOptionClick);
        // TODO: fix radio ?
        const type = isRadio ? 'radio' : 'checkbox';

        return (
            <Field
            //   onClick={ !isRadio ? onCheckboxOptionClick : null }
              type={ type }
              id={ facet_value }
              name={ facet_key }
              value={ facet_value }
              checked={ checked }
            />
        );
    }

    renderCount() {
        const {
            option: {
                product_count
            }
        } = this.props;

        return (
            <span>
                { `(${product_count})` }
            </span>
        );
    }

    renderLabel() {
        const {
            option: {
                label,
                facet_value,
                product_count
            }
        } = this.props;

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <label
              block="PLPFilterOption"
              htmlFor={ facet_value }
            >
                { label }
                { product_count ? this.renderCount() : null }
            </label>
        );
    }

    render() {
        const { isArabic } = this.state;
        const {
            option: {
                facet_value
            }
        } = this.props;

        if (!facet_value) {
            return null;
        }

        return (
            <li block="PLPFilterOption" elem="List" mods={ { isArabic } }>
                { this.renderField() }
                { this.renderLabel() }
            </li>
        );
    }
}

export default PLPFilterOption;
