import Image from "Component/Image";
import Link from "Component/Link";
import Overlay from "Component/Overlay";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { ReactComponent as AccountIcon } from "Style/account.svg";
import { isArabic } from "Util/App";
import AddressIcon from "./icons/address.svg";
import OrdersIcon from "./icons/cat-menu.svg";
import ClubIcon from "./icons/club-apparel.png";
import HeartIcon from "./icons/heart-regular.svg";
import LogoutIcon from "./icons/logout.png";
import ReturnIcon from "./icons/return.svg";
import { MY_ACCOUNT_SIGNED_IN_OVERLAY } from "./MyAccountSignedInOverlay.config";
import "./MyAccountSignedInOverlay.style";

export class MyAccountSignedInOverlay extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    accountLinked: PropTypes.bool,
    clubApparel: PropTypes.object,
  };

  static defaultProps = {
    clubApparel: {},
    accountLinked: false,
  };

  state = {
    isArabic: isArabic(),
  };

  renderMyAccountLink() {
    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="LinkAccount"
        to="/my-account/dashboard"
      >
        <AccountIcon />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("My Profile")}
        </span>
      </Link>
    );
  }

  renderOrderHistoryLink() {
    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="LinkHistory"
        to="/my-account/my-orders"
      >
        <Image
          lazyLoad={true}
          src={OrdersIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("My Orders")}
        </span>
      </Link>
    );
  }

  renderReturnAnItemLink() {
    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="ReturnAnItem"
        to="/my-account/return-item"
      >
        <Image
          lazyLoad={true}
          src={ReturnIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("My Returns")}
        </span>
      </Link>
    );
  }

  renderClubLink() {
    const {
      clubApparel: { accountLinked },
    } = this.props;
    const linkNowBtn = (
      <span block="MyAccountSignedInOverlay" elem="LinkClubBtn">
        {__("Link Now")}
      </span>
    );

    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="LinkClub"
        to="/my-account/club-apparel"
      >
        <Image
          lazyLoad={true}
          src={ClubIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("Club apparel loyalty")}
        </span>
        {!accountLinked ? linkNowBtn : null}
      </Link>
    );
  }

  renderWishlistLink() {
    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="LinkWishlist"
        to="/my-account/my-wishlist"
      >
        <Image
          lazyLoad={true}
          src={HeartIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("My Wishlist")}
        </span>
      </Link>
    );
  }

  renderDeliveryLink() {
    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="LinkDelivery"
        to="/my-account/address-book"
      >
        <Image
          lazyLoad={true}
          src={AddressIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("My Address Book")}
        </span>
      </Link>
    );
  }

  renderWalletPayment() {
    return (
      <Link
        block="MyAccountSignedInOverlay"
        elem="LinkDelivery"
        to="/my-account/wallet-payments"
      >
        <Image
          lazyLoad={true}
          src={AddressIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("Wallet & Payments")}
        </span>
      </Link>
    );
  }

  renderLogoutButton() {
    const { signOut } = this.props;

    return (
      <button
        block="MyAccountSignedInOverlay"
        elem="ButtonDelivery"
        onClick={signOut}
      >
        <Image
          lazyLoad={true}
          src={LogoutIcon}
          mix={{ block: "MyAccountSignedInOverlay", elem: "Image" }}
        />
        <span block="MyAccountSignedInOverlay" elem="LinkTitle">
          {__("Logout")}
        </span>
      </button>
    );
  }

  renderWrapper() {
    return (
      <div block="MyAccountSignedInOverlay" elem="Wrapper">
        {this.renderClubLink()}
        {this.renderMyAccountLink()}
        {this.renderOrderHistoryLink()}
        {this.renderReturnAnItemLink()}
        {this.renderWishlistLink()}
        {this.renderDeliveryLink()}
        {this.renderWalletPayment()}
        {this.renderLogoutButton()}
      </div>
    );
  }

  render() {
    const { onHide } = this.props;
    const { isArabic } = this.state;

    return (
      <Overlay
        id={MY_ACCOUNT_SIGNED_IN_OVERLAY}
        mix={{ block: "MyAccountSignedInOverlay", mods: { isArabic } }}
        onHide={onHide}
      >
        {this.renderWrapper()}
      </Overlay>
    );
  }
}

export default MyAccountSignedInOverlay;
