/* eslint-disable react/no-unused-state */
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

import { PureComponent } from "react";
import { connect } from "react-redux";
import { customerType } from "Type/Account";
import ContactHelp from "./ContactHelp.component";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
});

export class ContactHelpContainer extends PureComponent {
  static propTypes = {
    customer: customerType.isRequired,
  };

  state = {};

  containerFunctions = {};

  render() {
    return (
      <ContactHelp
        {...this.props}
        {...this.state}
        {...this.containerFunctions}
      />
    );
  }
}

export default connect(mapStateToProps)(ContactHelpContainer);
