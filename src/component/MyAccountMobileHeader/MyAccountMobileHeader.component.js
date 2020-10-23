/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Link from 'Component/Link';
import StoreCredit from 'Component/StoreCredit';

import './MyAccountMobileHeader.style.scss';

class MyAccountMobileHeader extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isHiddenTabContent: PropTypes.bool.isRequired,
        alternativePageName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    };

    renderStoreCredits() {
        return (
            <Link
              block="MyAccountMobileHeader"
              elem="StoreCreditLink"
              to="/my-account/storecredit/info"
            >
                <StoreCredit />
            </Link>
        );
    }

    renderTabOptionHeader() {
        const { alternativePageName, name } = this.props;

        return (
            <div block="MyAccountMobileHeader" elem="TabOptionHeader">
                { this.renderCloseButton() }
                <h1 block="MyAccountMobileHeader" elem="Heading">{ alternativePageName || name }</h1>
            </div>
        );
    }

    renderCloseButton() {
        const { onClose } = this.props;

        return (
            <button
              elem="Button"
              block="MyAccountMobileHeader"
              onClick={ onClose }
            />
        );
    }

    render() {
        const { isHiddenTabContent } = this.props;

        return (
            <div block="MyAccountMobileHeader">
                { isHiddenTabContent
                    ? this.renderTabOptionHeader()
                    : this.renderStoreCredits() }
                <div block="MyAccountMobileHeader" elem="Actions" />
            </div>
        );
    }
}

export default MyAccountMobileHeader;
