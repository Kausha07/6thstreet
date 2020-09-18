import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { FilterOption } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilterOption.style';

class PLPFilterOption extends PureComponent {
    static propTypes = {
        option: FilterOption.isRequired,
        isRadio: PropTypes.bool.isRequired
    };

    renderField() {
        const {
            option: {
                facet_key,
                facet_value,
                is_selected: checked
            },
            isRadio
        } = this.props;

        // TODO: fix radio ?
        const type = isRadio ? 'radio' : 'checkbox';

        return (
            <Field
              type={ type }
              id={ facet_value }
              name={ facet_key }
              value={ facet_value }
              defaultChecked={ checked }
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
            <strong>{ product_count }</strong>
        );
    }

    renderLabel() {
        const {
            option: {
                label,
                facet_value
            }
        } = this.props;

        return (
            <label
              htmlFor={ facet_value }
            >
                { label }
                { this.renderCount() }
            </label>
        );
    }

    render() {
        const {
            option: {
                facet_value
            }
        } = this.props;

        if (!facet_value) {
            return null;
        }

        return (
            <li block="PLPFilterOption">
                { this.renderField() }
                { this.renderLabel() }
            </li>
        );
    }
}

export default PLPFilterOption;
