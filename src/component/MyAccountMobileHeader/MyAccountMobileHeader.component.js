/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import CountrySwitcher from 'Component/CountrySwitcher';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import Link from 'Component/Link';
import StoreCredit from 'Component/StoreCredit';
import HeaderCart from "Component/HeaderCart";
import { isArabic } from 'Util/App';

import './MyAccountMobileHeader.style.scss';

export const mapStateToProps = (state) => ({
    isWalletEnabled: state.AppConfig.isWalletV1Enabled,
});

class MyAccountMobileHeader extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isHiddenTabContent: PropTypes.bool.isRequired,
        alternativePageName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    };

    state = {
        isArabic: isArabic(),
        isClubApparel: false
    };

    static getDerivedStateFromProps(props) {
        const { alternativePageName, name, isHiddenTabContent } = props;

        if (isHiddenTabContent) {
            return {
                isClubApparel: alternativePageName === 'Club Apparel Loyalty' || name === 'Club Apparel Loyalty'
            };
        }

        return {
            isClubApparel: false
        };
    }

    renderStoreCredits() {
        const { isWalletEnabled } = this.props;
        return (
            <>
                { !isWalletEnabled ?
                    <Link
                        block="MyAccountMobileHeader"
                        elem="StoreCreditLink"
                        to="/my-account/storecredit/info"
                    >
                        <StoreCredit />
                    </Link> :<div>
                        {/* placeholder tag */}
                    </div> }
                { this.renderChangeStore() }
            </>
        );
    }

    renderCartIcon() {
        const { isArabic } = this.state;
        const { name = "" } = this.props
        if(name === "My wishlist" || name === "قائمة أمنياتي") {            
            return <HeaderCart showCartPopUp={false} mods={{ isArabic }} />;
        }
        return null;
    }

    renderTabOptionHeader() {
        const { alternativePageName, name } = this.props;

        return (
            <div block="MyAccountMobileHeader" elem="TabOptionHeader">
                { this.renderCloseButton() }
                <h1 block="MyAccountMobileHeader" elem="Heading">{ alternativePageName || name }</h1>
                {this.renderCartIcon() }
            </div>
        );
    }

    renderCloseButton() {
        const { onClose } = this.props;
        const { isArabic, isClubApparel } = this.state;

        return (
            <button
              elem="Button"
              block="MyAccountMobileHeader"
              onClick={ onClose }
              mods={ { isArabic, isClubApparel } }
            />
        );
    }

    renderChangeStore() {
        return (
            <div block="MyAccountOverlay" elem="StoreSwitcher">
                <LanguageSwitcher />
                <CountrySwitcher />
            </div>
        );
    }

    render() {
        const { isHiddenTabContent } = this.props;
        const { isClubApparel } = this.state;

        return !isClubApparel ? (
            <div block="MyAccountMobileHeader" id='MyAccountMobileHeader'>
                { isHiddenTabContent
                    ? this.renderTabOptionHeader()
                    : this.renderStoreCredits() }
            </div>
        ) : this.renderCloseButton();
    }
}

export default connect(mapStateToProps, null)(MyAccountMobileHeader);
