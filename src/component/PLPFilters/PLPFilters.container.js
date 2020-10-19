/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { Filters } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLPFilters from './PLPFilters.component';

export const mapStateToProps = (_state) => ({
    filters: _state.PLP.filters,
    isLoading: _state.PLP.isLoading,
    activeOverlay: _state.OverlayReducer.activeOverlay,
    productsCount: _state.PLP.meta.hits_count
});

export const mapDispatchToProps = (_dispatch) => ({
    showOverlay: (overlayKey) => _dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => _dispatch(hideActiveOverlay()),
    goToPreviousNavigationState: () => _dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE)),
    goToPreviousHeaderState: () => _dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    changeHeaderState: (state) => _dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state))
});

export class PLPFiltersContainer extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        filters: Filters.isRequired,
        showOverlay: PropTypes.func.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        productsCount: PropTypes.string.isRequired
    };

    state = {
        initialFilters: {}
    };

    containerFunction = {
        onReset: this.onReset.bind(this)
    };

    static getDerivedStateFromProps(props, state) {
        const { filters } = props;
        const { initialFilters } = state;

        if (Object.keys(filters).length > Object.keys(initialFilters).length) {
            return {
                initialFilters: filters
            };
        }

        return null;
    }

    containerFunctions = () => {
        const { showOverlay } = this.props;

        return { showOverlay };
    };

    // eslint-disable-next-line consistent-return
    onReset() {
        const { initialFilters } = this.state;

        console.log(initialFilters);

        // eslint-disable-next-line fp/no-let
        for (let i = 0; i < Object.keys(initialFilters).length; i++) {
            WebUrlParser.setParam(Object.keys(initialFilters)[i], '');
        }
    }

    containerProps = () => {
        const {
            filters,
            isLoading,
            activeOverlay
        } = this.props;

        return {
            filters,
            isLoading,
            activeOverlay
        };
    };

    render() {
        console.log(this.state);
        return (
            <PLPFilters
              { ...this.props }
              { ...this.containerFunctions() }
              { ...this.containerFunction }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPFiltersContainer);
