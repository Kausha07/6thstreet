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
import MyAccountWalletPaymentList from "./MyAccountWalletPaymentList.component";
import CreditCardDispatcher from "Store/CreditCard/CreditCard.dispatcher";

export const mapStateToProps = (state) => ({});

export const mapDispatchToProps = (dispatch) => ({
  deleteCreditCard: (gatewayToken) =>
    CreditCardDispatcher.deleteCreditCard(dispatch, gatewayToken),
});

export class MyAccountWalletPaymentListContainer extends PureComponent {
  static propTypes = {
    savedCard: PropTypes.isRequired,
    deleteCreditCard: PropTypes.isRequired,
  };

  deleteCreditCard = (gatewayToken) => {
    this.props.deleteCreditCard(gatewayToken);
  };

  containerFunctions = {
    deleteCreditCard: this.deleteCreditCard,
  };

  render() {
    return (
      <MyAccountWalletPaymentList
        {...this.props}
        {...this.containerFunctions}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountWalletPaymentListContainer);
