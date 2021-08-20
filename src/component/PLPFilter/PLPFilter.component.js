/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";

import FieldMultiselect from "Component/FieldMultiselect";
import { Filter } from "Util/API/endpoint/Product/Product.type";

import "./PLPFilter.style";

class PLPFilter extends PureComponent {
  static propTypes = {
    filter: Filter.isRequired,
    activeFilter: PropTypes.object,
    isChecked: PropTypes.bool,
    defaultFilters: PropTypes.bool,
    currentActiveFilter: PropTypes.string,
    changeActiveFilter: PropTypes.func.isRequired,
    handleCallback: PropTypes.func.isRequired,
    updateFilters: PropTypes.func.isRequired,
    setDefaultFilters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeFilter: {},
    isChecked: false,
    defaultFilters: false,
    currentActiveFilter: "",
  };

  renderDropDownList() {
    const {
      filter: { label, category, is_radio },
      filter,
      activeFilter,
      isChecked,
      currentActiveFilter,
      changeActiveFilter,
      handleCallback,
      updateFilters,
      setDefaultFilters,
      defaultFilters,
    } = this.props;

    if (category === "categories.level1") {
      return null;
    }
    let placeholder = category === "in_stock" ? 'BY STOCK' : label

    return (
      <FieldMultiselect
        placeholder={placeholder}
        showCheckbox
        isRadio={is_radio}
        filter={filter}
        activeFilter={activeFilter}
        isChecked={isChecked}
        currentActiveFilter={currentActiveFilter}
        changeActiveFilter={changeActiveFilter}
        parentCallback={handleCallback}
        updateFilters={updateFilters}
        setDefaultFilters={setDefaultFilters}
        defaultFilters={defaultFilters}
      />
    );
  }

  render() {
    return <>{this.renderDropDownList()}</>;
  }
}

export default PLPFilter;
