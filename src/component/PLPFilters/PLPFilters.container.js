/* eslint-disable no-param-reassign */
/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import {
  changeNavigationState,
  goToPreviousNavigationState,
} from "Store/Navigation/Navigation.action";
import {
  BOTTOM_NAVIGATION_TYPE,
  TOP_NAVIGATION_TYPE,
} from "Store/Navigation/Navigation.reducer";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import { Filters } from "Util/API/endpoint/Product/Product.type";
import { updatePLPInitialFilters } from "Store/PLP/PLP.action";
import WebUrlParser from "Util/API/helper/WebUrlParser";

import PLPFilters from "./PLPFilters.component";
import { SIZES } from "./PLPFilters.config";

export const mapStateToProps = (_state) => ({
  filters: _state.PLP.filters,
  isLoading: _state.PLP.isLoading,
  initialOptions: _state.PLP.initialOptions,
  activeOverlay: _state.OverlayReducer.activeOverlay,
  productsCount: _state.PLP.meta.hits_count,
});

export const mapDispatchToProps = (_dispatch) => ({
  showOverlay: (overlayKey) => _dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => _dispatch(hideActiveOverlay()),
  updatePLPInitialFilters: (filters, facet_key, facet_value) =>
    _dispatch(updatePLPInitialFilters(filters, facet_key, facet_value)),
  goToPreviousNavigationState: () =>
    _dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE)),
  goToPreviousHeaderState: () =>
    _dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
  changeHeaderState: (state) =>
    _dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
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
    productsCount: PropTypes.number,
  };

  static defaultProps = {
    productsCount: 0,
  };

  state = {
    initialFilters: {},
    activeFilters: {},
  };

  containerFunction = {
    onReset: this.onReset.bind(this),
  };

  static getDerivedStateFromProps(props, state) {
    const { filters = {} } = props;
    const { initialFilters = {} } = state;

    if (Object.keys(filters).length > Object.keys(initialFilters).length) {
      if (filters[SIZES]) {
        return {
          initialFilters: filters[SIZES].data
            ? {
                ...initialFilters,
                ...filters,
                ...filters[SIZES].data,
              }
            : {
                ...initialFilters,
                ...filters,
              },
        };
      }

      return {
        initialFilters: {
          ...initialFilters,
          ...filters,
        },
      };
    }

    return null;
  }

  componentDidUpdate() {
    const { filters = {} } = this.props;
    const { activeFilters } = this.state;

    const newActiveFilters = Object.entries(filters).reduce((acc, filter) => {
      if (filter[1]) {
        const { selected_filters_count, data = {} } = filter[1];

        if (selected_filters_count !== 0) {
          if (filter[0] === SIZES) {
            const mappedData = Object.entries(data).reduce((acc, size) => {
              const { subcategories } = size[1];
              const mappedSizeData = this.mapData(subcategories);

              acc = { ...acc, [size[0]]: mappedSizeData };

              return acc;
            }, []);

            acc = { ...acc, ...mappedData };
          } else {
            acc = { ...acc, [filter[0]]: this.mapData(data) };
          }
        }

        return acc;
      }
    }, {});
    if (!this.compareObjects(activeFilters, newActiveFilters)) {
      this.setActveFilters(newActiveFilters);
    }
  }

  compareObjects(object1 = {}, object2 = {}) {
    if (Object.keys(object1).length === Object.keys(object2).length) {
      const isEqual = Object.entries(object1).reduce((acc, key) => {
        if (object2[key[0]]) {
          if (key[1].length !== object2[key[0]].length) {
            acc.push(0);
          } else {
            acc.push(1);
          }
        } else {
          acc.push(1);
        }

        return acc;
      }, []);

      return !isEqual.includes(0);
    }

    return false;
  }

  setActveFilters = (activeFilters) => {
    this.setState({ activeFilters });
  };

  mapData(data = {}) {
    const { initialOptions } = this.props;
    let categoryLevel1 = initialOptions.q.split(" ")[1];
    let formattedData = data;
    if (data[categoryLevel1]) {
      formattedData = data[categoryLevel1].subcategories;
    }
    const mappedData = Object.entries(formattedData).reduce((acc, option) => {
      const { is_selected } = option[1];
      if (is_selected) {
        acc.push(option[0]);
      }

      return acc;
    }, []);
    return mappedData;
  }

  containerFunctions = () => {
    const { showOverlay, updatePLPInitialFilters, updateFiltersState } =
      this.props;

    return { showOverlay, updatePLPInitialFilters, updateFiltersState };
  };

  // eslint-disable-next-line consistent-return
  onReset() {
    const { initialFilters = {} } = this.state;
    const { query } = this.props;
    // eslint-disable-next-line fp/no-let
    for (let i = 0; i < Object.keys(initialFilters).length; i++) {
      WebUrlParser.setParam(Object.keys(initialFilters)[i], "", query);
    }
  }

  containerProps = () => {
    const {
      filters,
      isLoading,
      activeOverlay,
      query,
      initialOptions,
      plpPageActiveFilters,
    } = this.props;
    const { activeFilters } = this.state;

    return {
      filters,
      isLoading,
      activeOverlay,
      activeFilters,
      initialOptions,
      query,
      plpPageActiveFilters,
    };
  };

  render() {
    return (
      <PLPFilters
        {...this.props}
        {...this.containerFunctions()}
        {...this.containerFunction}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PLPFiltersContainer);
