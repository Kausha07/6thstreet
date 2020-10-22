import React, { PureComponent } from 'react';

import Link from 'Component/Link';
import StoreCredit from 'Component/StoreCredit';

import './MyAccountMobileHeader.style.scss';

class MyAccountMobileHeader extends PureComponent {
    render() {
        return (
            <div block="MyAccountMobileHeader">
                <Link
                  block="MyAccountMobileHeader"
                  elem="StoreCreditLink"
                  to="/my-account/storecredit/info"
                >
                    <StoreCredit />
                </Link>
                <div block="MyAccountMobileHeader" elem="Actions" />
            </div>
        );
    }
}

export default MyAccountMobileHeader;
