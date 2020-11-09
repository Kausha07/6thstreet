import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Overlay from 'Component/Overlay';
import { ReactComponent as AccountIcon } from 'Style/account.svg';

import AddressIcon from './icons/address.png';
import ClubIcon from './icons/club-apparel.png';
import LogoutIcon from './icons/logout.png';
import OrdersIcon from './icons/orders.png';
import { MY_ACCOUNT_SIGNED_IN_OVERLAY } from './MyAccountSignedInOverlay.config';

import './MyAccountSignedInOverlay.style';

export class MyAccountSignedInOverlay extends PureComponent {
    static propTypes = {
        onHide: PropTypes.func.isRequired,
        signOut: PropTypes.func.isRequired
    };

    renderMyAccountLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkAccount" to="/my-account/dashboard">
                <AccountIcon />
                <span>{ __('My account') }</span>
            </Link>
        );
    }

    renderOrderHistoryLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkHistory" to="/my-account/my-orders">
                <Image src={ OrdersIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span>{ __('Order history') }</span>
            </Link>
        );
    }

    renderClubLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkClub" to="/my-account/club-apparel">
                <Image src={ ClubIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span>{ __('Club apparel') }</span>
            </Link>
        );
    }

    renderDeliveryLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkDelivery" to="/my-account/address-book">
                <Image src={ AddressIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span>{ __('Delivery addresses') }</span>
            </Link>
        );
    }

    renderLogoutButton() {
        const { signOut } = this.props;

        return (
            <button block="MyAccountSignedInOverlay" elem="ButtonDelivery" onClick={ signOut }>
                <Image src={ LogoutIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span>{ __('Logout') }</span>
            </button>
        );
    }

    renderWrapper() {
        return (
            <div block="MyAccountSignedInOverlay" elem="Wrapper">
                { this.renderMyAccountLink() }
                { this.renderOrderHistoryLink() }
                { this.renderClubLink() }
                { this.renderDeliveryLink() }
                { this.renderLogoutButton() }
            </div>
        );
    }

    render() {
        const { onHide } = this.props;

        return (
            <Overlay
              id={ MY_ACCOUNT_SIGNED_IN_OVERLAY }
              mix={ { block: 'MyAccountSignedInOverlay' } }
              onHide={ onHide }
            >
                { this.renderWrapper() }
            </Overlay>
        );
    }
}

export default MyAccountSignedInOverlay;
