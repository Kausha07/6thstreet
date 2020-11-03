/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { SIZES } from 'Component/PLPFilters/PLPFilters.config';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';
import isMobile from 'Util/Mobile';

import PLPFilter from './PLPFilter.component';

export const mapStateToProps = (_state) => ({});

export const mapDispatchToProps = (_dispatch) => ({
    toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key))
});

class PLPFilterContainer extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired,
        parentCallback: PropTypes.func.isRequired,
        currentActiveFilter: PropTypes.string,
        changeActiveFilter: PropTypes.func.isRequired
    };

    static defaultProps = {
        currentActiveFilter: ''
    };

    state = {
        activeFilter: {},
        isChecked: false
    };

    containerFunctions = {
        onSelect: this.onSelect.bind(this)
    };

    onSelect() {
        const {
            filter: { category, facet_key },
            filter,
            parentCallback
        } = this.props;

        // This syntax gets form with name "filters" from document
        // then it extracts all inputs from form
        if (category === SIZES && isMobile.any()) {
            const sizes = Object.entries(filter.data).reduce((acc, filter) => {
                const inputs = Array.from(document.forms.filters[filter[0]] || []);

                const values = inputs.reduce((acc, node) => {
                    const { checked, value } = node;

                    if (checked) {
                        acc.push(value);
                    }

                    return acc;
                }, []);

                // eslint-disable-next-line no-param-reassign
                acc = { ...acc, [ filter[0] ]: values };

                return acc;
            }, []);

            parentCallback(category, { ...sizes });
            this.setState({
                activeFilter: {
                    [category]: { ...sizes }
                },
                isChecked: true
            });
        } else {
            const inputs = category
                ? Array.from(document.forms.filters[category] || [])
                : Array.from(document.forms.filters[facet_key] || []);

            const values = inputs.reduce((acc, node) => {
                const { checked, value } = node;

                if (checked) {
                    acc.push(value);
                }

                return acc;
            }, []);

            if (!isMobile.any()) {
                WebUrlParser.setParam(category || facet_key, values);
            } else {
                parentCallback(category, values);
                this.setState({
                    activeFilter: {
                        [ category ]: { values }
                    },
                    isChecked: true
                });
            }
        }
    }

    containerProps = () => {
        const { filter, changeActiveFilter, currentActiveFilter } = this.props;

        return { filter, changeActiveFilter, currentActiveFilter };
    };

    render() {
        return (
            <PLPFilter
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPFilterContainer);
