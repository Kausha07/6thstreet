import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import Field from 'Component/Field';
import { FilterOption } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './PLPQuickFilterOption.style';

class PLPQuickFilterOption extends PureComponent {
    static propTypes = {
        option: FilterOption.isRequired,
        isRadio: PropTypes.bool.isRequired,
        activeFilter: PropTypes.object,
        updateFilters: PropTypes.func.isRequired
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

    componentDidUpdate() {
        const { updateFilters } = this.props;
        updateFilters();
    }

    handleClick = () => {
        this.forceUpdate();
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

        if (isMobile.any()) {
            return this.renderMobileField(facet_value, facet_key, checked, onSelectChecked);
        }

        return (
            <Field
              type={ type }
              id={ facet_value }
              name={ facet_key }
              value={ facet_value }
              checked={ checked }
            />
        );
    }

    renderMobileField(facet_value, facet_key, checked, onSelectChecked) {
        const { isRadio } = this.props;

        const type = isRadio ? 'radio' : 'checkbox';

        return (
            <Field
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

export default PLPQuickFilterOption;
