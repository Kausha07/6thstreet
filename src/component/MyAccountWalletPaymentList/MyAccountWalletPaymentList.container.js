/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import {  ADDRESS_POPUP_ID} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import { showPopup } from "Store/Popup/Popup.action";
import { countriesType } from "Type/Config";

import MyAccountWalletPaymentList from "./MyAccountWalletPaymentList.component";

export const mapStateToProps = (state) => ({
  countries: state.ConfigReducer.countries,
});

export const mapDispatchToProps = (dispatch) => ({});

export class MyAccountWalletPaymentListContainer extends PureComponent {
  static propTypes = {
    savedCard: PropTypes.isRequired,
  };

  containerFunctions = {};

  render() {
    return (
      <MyAccountWalletPaymentList {...this.props} {...this.containerFunctions} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountWalletPaymentListContainer);
