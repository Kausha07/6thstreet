import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import Field from 'Component/Field';
import { FilterOption } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './PLPFilterOption.style';

class PLPFilterOption extends PureComponent {
    static propTypes = {
        option: FilterOption.isRequired,
        isRadio: PropTypes.bool.isRequired,
        activeFilter: PropTypes.object
    };

    static defaultProps = {
        activeFilter: {}
    };

    fieldRef = createRef();

    optionRef = createRef();

    state = {
        isArabic: isArabic(),
        onSelectChecked: false
    };

    handleClick = () => {
        this.optionRef.current.children[1].click();
    };

    renderField() {
        const {
            option: {
                facet_key,
                facet_value,
                is_selected: checked
            },
            isRadio,
            activeFilter
        } = this.props;
        const { onSelectChecked } = this.state;

        const category = Object.keys(activeFilter)[0];

        if (category !== undefined) {
            const { values } = activeFilter[category];
            this.setState({ onSelectChecked: facet_value === values.find((value) => value === facet_value) });
        }

        // TODO: fix radio ?
        const type = isRadio ? 'radio' : 'checkbox';

        return isMobile.any() ? (
            <Field
              formRef={ this.fieldRef }
              onClick={ this.handleClick }
              mix={ {
                  block: 'PLPFilterOption',
                  elem: 'Input'
              } }
              type={ type }
              id={ facet_value }
              name={ facet_key }
              value={ facet_value }
              defaultChecked={ checked || onSelectChecked }
            />
        ) : (
            <Field
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
            <label
              block="PLPFilterOption"
              htmlFor={ facet_value }
            >
                { label }
                { product_count && !isMobile.any() ? this.renderCount() : null }
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
            <li ref={ this.optionRef } block="PLPFilterOption" elem="List" mods={ { isArabic } }>
                { this.renderField() }
                { this.renderLabel() }
            </li>
        );
    }
}

export default PLPFilterOption;
