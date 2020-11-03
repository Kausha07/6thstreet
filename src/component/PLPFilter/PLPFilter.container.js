/* eslint-disable */
/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

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
        changeActiveFilter: PropTypes.func.isRequired,
        isReset: PropTypes.bool.isRequired,
        resetParentState: PropTypes.func.isRequired,
        parentActiveFilters: PropTypes.object.isRequired
    };

    static defaultProps = {
        currentActiveFilter: ''
    };

    state = {
        activeFilters: {},
        isChecked: false,
        prevActiveFilters: {}
    };

    containerFunctions = {
        handleCallback: this.handleCallback.bind(this)
    };

    handleCallback(initialFacetKey, facet_value, checked, isRadio) {
        const { parentCallback } = this.props;
    
        parentCallback(initialFacetKey, facet_value, checked, isRadio);
    }

    select = () => {
        const {
            parentCallback
        } = this.props;
        const { activeFilters } = this.state;

        console.log(activeFilters);

        if (!isMobile.any()) {
            Object.keys(activeFilters || {}).map((key) => WebUrlParser.setParam(key, activeFilters[key]));
        } else {
            parentCallback(activeFilters);
        }
    };

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
