import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Overlay from 'Component/Overlay';
import { ReactComponent as AccountIcon } from 'Style/account.svg';
import { isArabic } from 'Util/App';

import AddressIcon from './icons/address.png';
import ClubIcon from './icons/club-apparel.png';
import HeartIcon from './icons/heart-regular.svg';
import LogoutIcon from './icons/logout.png';
import OrdersIcon from './icons/orders.png';
import ReturnIcon from './icons/return.svg';
import { MY_ACCOUNT_SIGNED_IN_OVERLAY } from './MyAccountSignedInOverlay.config';

import './MyAccountSignedInOverlay.style';

export class MyAccountSignedInOverlay extends PureComponent {
    static propTypes = {
        onHide: PropTypes.func.isRequired,
        signOut: PropTypes.func.isRequired,
        accountLinked: PropTypes.bool.isRequired,
        clubApparel: PropTypes.object.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    renderMyAccountLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkAccount" to="/my-account/dashboard">
                <AccountIcon />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('My account') }</span>
            </Link>
        );
    }

    renderOrderHistoryLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkHistory" to="/my-account/my-orders">
                <Image src={ OrdersIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('Order history') }</span>
            </Link>
        );
    }

    renderReturnAnItemLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="ReturnAnItem" to="/my-account/return-item">
                <Image src={ ReturnIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('Return An Item') }</span>
            </Link>
        );
    }

    renderClubLink() {
        const { clubApparel: { accountLinked } } = this.props;
        const linkNowBtn = <span block="MyAccountSignedInOverlay" elem="LinkClubBtn">{ __('Link Now') }</span>;

        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkClub" to="/my-account/club-apparel">
                <Image src={ ClubIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('Club apparel loyalty') }</span>
                { !accountLinked ? linkNowBtn : null }
            </Link>
        );
    }

    renderWishlistLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkWishlist" to="/my-account/my-wishlist">
                <Image src={ HeartIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('My Wishlist') }</span>
            </Link>
        );
    }

    renderDeliveryLink() {
        return (
            <Link block="MyAccountSignedInOverlay" elem="LinkDelivery" to="/my-account/address-book">
                <Image src={ AddressIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('Delivery addresses') }</span>
            </Link>
        );
    }

    renderLogoutButton() {
        const { signOut } = this.props;

        return (
            <button block="MyAccountSignedInOverlay" elem="ButtonDelivery" onClick={ signOut }>
                <Image src={ LogoutIcon } mix={ { block: 'MyAccountSignedInOverlay', elem: 'Image' } } />
                <span block="MyAccountSignedInOverlay" elem="LinkTitle">{ __('Logout') }</span>
            </button>
        );
    }

    renderWrapper() {
        return (
            <div block="MyAccountSignedInOverlay" elem="Wrapper">
                { this.renderClubLink() }
                { this.renderMyAccountLink() }
                { this.renderOrderHistoryLink() }
                { this.renderReturnAnItemLink() }
                { this.renderWishlistLink() }
                { this.renderDeliveryLink() }
                { this.renderLogoutButton() }
            </div>
        );
    }

    render() {
        const { onHide } = this.props;
        const { isArabic } = this.state;

        return (
            <Overlay
              id={ MY_ACCOUNT_SIGNED_IN_OVERLAY }
              mix={ { block: 'MyAccountSignedInOverlay', mods: { isArabic } } }
              onHide={ onHide }
            >
                { this.renderWrapper() }
            </Overlay>
        );
    }
}

export default MyAccountSignedInOverlay;
