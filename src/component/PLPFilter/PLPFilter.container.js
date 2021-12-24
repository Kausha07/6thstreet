/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { toggleOverlayByKey } from "Store/Overlay/Overlay.action";
import { Filter } from "Util/API/endpoint/Product/Product.type";

import PLPFilter from "./PLPFilter.component";

export const mapStateToProps = (_state) => ({});

export const mapDispatchToProps = (_dispatch) => ({
  toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key)),
});

class PLPFilterContainer extends PureComponent {
  static propTypes = {
    filter: Filter.isRequired,
    toggleOverlayByKey: PropTypes.func.isRequired,
    updateFilters: PropTypes.func.isRequired,
    parentCallback: PropTypes.func.isRequired,
    currentActiveFilter: PropTypes.string,
    changeActiveFilter: PropTypes.func.isRequired,
    isReset: PropTypes.bool.isRequired,
    defaultFilters: PropTypes.bool.isRequired,
    resetParentState: PropTypes.func.isRequired,
    setDefaultFilters: PropTypes.func.isRequired,
    parentActiveFilters: PropTypes.object.isRequired,
  };

  static defaultProps = {
    currentActiveFilter: "",
  };

  state = {
    activeFilters: {},
    isChecked: false,
    parentActiveFilters: null,
    prevActiveFilters: {},
  };

  componentDidUpdate() {
    const { filters = {}, parentActiveFilters = {} } = this.props;

    const newActiveFilters = Object.entries(filters).reduce((acc, filter) => {
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
    }, {});

    if (!this.compareObjects(parentActiveFilters, newActiveFilters)) {
      this.setState({
        parentActiveFilters: this.props.parentActiveFilters,
      });
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

  containerFunctions = {
    handleCallback: this.handleCallback.bind(this),
  };

  handleCallback(initialFacetKey, facet_value, checked, isRadio) {
    const { parentCallback } = this.props;
    parentCallback(initialFacetKey, facet_value, checked, isRadio);
  }

  containerProps = () => {
    const {
      filter,
      changeActiveFilter,
      updateFilters,
      setDefaultFilters,
      defaultFilters,
      currentActiveFilter,
      isSortBy,
    } = this.props;

    const { parentActiveFilters } = this.state;
    return {
      filter,
      changeActiveFilter,
      updateFilters,
      setDefaultFilters,
      defaultFilters,
      currentActiveFilter,
      parentActiveFilters,
      isSortBy,
    };
  };

  render() {
    return (
      <PLPFilter
        {...this.state}
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPFilterContainer);
