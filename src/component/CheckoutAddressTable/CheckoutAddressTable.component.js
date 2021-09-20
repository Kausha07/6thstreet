/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Loader from "Component/Loader";
import { CheckoutAddressTable as SourceCheckoutAddressTable } from "SourceComponent/CheckoutAddressTable/CheckoutAddressTable.component";
import { isArabic } from "Util/App";
import { getCountryFromUrl } from "Util/Url/Url";
import isMobile from "Util/Mobile";
import pencil from "./icons/edit_btn.png";
import trash from "./icons/trash.png";
import Image from "Component/Image";
import "./CheckoutAddressTable.style.scss";
import editLogo from "../CheckoutAddressBook/icons/checkmark-circle-active.png";
export class CheckoutAddressTable extends SourceCheckoutAddressTable {
  state = {
    isArabic: isArabic(),
  };

  mobileEditAddress = (e) => {
    const { hideCards, onEditClick } = this.props;
    if (isMobile.any()) {
      onEditClick();
      hideCards();
      e.stopPropagation();
    }
  };

  renderCard() {
    const {
      address: {
        default_billing,
        firstname,
        lastname,
        street,
        city,
        country_id,
        region: { region },
      },
      isSelected,
    } = this.props;

    const def = default_billing === true ? __("default") : " ";
    const countryId = `(${country_id})`;
    const { isArabic } = this.state;

    return (
      <div block="MyAccountAddressCard" onClick={this.onAddressClick} mods={{ isSelected }}>
        <div block="MyAccountAddressCard" elem="EditButton" mods={{ isArabic }}>
          <div >
            <div block="MyAccountAddressCard" elem="Default">
              {def}
            </div>
            <div block="MyAccountAddressCard" elem="Name">
              {firstname} {lastname}
            </div>
            <div block="MyAccountAddressCard" elem="Street">
              {street}
            </div>
            <div block="MyAccountAddressCard" elem="City">
              {region}
              {" - "}
              {city}
              {" - "}
              {countryId}
            </div>
            <div block="MyAccountAddressCard" elem="Phone">
              {this.getPhone()}
            </div>
          </div>
          {isMobile.any() ? (
            <div
              block="EditAddress"
              elem="Container"
              mods={{ isArabic }}
              onClick={this.mobileEditAddress}
            >
              <div block="EditAddress" elem="Logo" mods={{ isArabic }}></div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  onEdit = () => {
    const { onEditClick } = this.props;
    onEditClick();
    if (!isMobile.any()) {
      const elmnts = document.getElementsByClassName(
        "MyAccountAddressBook-NewAddress"
      );

      if (elmnts && elmnts.length > 0) {
        elmnts[0].scrollIntoView();
      }
    }
  };

  renderActions() {
    const { onDeleteClick, showActions } = this.props;

    if (!showActions) {
      return null;
    }

    return (
      <>
        <button
          block="MyAccountAddressTable"
          elem="ActionBtn"
          type="button"
          onClick={this.onEdit}
        >
          <img
            block="MyAccountAddressTable"
            elem="Icon"
            mods={{ pencil: true }}
            alt="pencil"
            src={pencil}
          />
        </button>
        <button
          block="MyAccountAddressTable"
          elem="ActionBtn"
          type="button"
          onClick={onDeleteClick}
        >
          <img
            block="MyAccountAddressTable"
            elem="Icon"
            mods={{ trash: true }}
            alt="trash"
            src={trash}
          />
        </button>
      </>
    );
  }

  render() {
    const {
      countries = [],
      mix,
      address: { country_id },
    } = this.props;
    const { isArabic } = this.state;

    if (country_id !== getCountryFromUrl()) {
      return null;
    }

    return (
      <div block="MyAccountAddressTable" mods={{ isArabic }} mix={mix}>
        <Loader isLoading={!countries.length} />
        {this.renderCard()}
        {this.renderActions()}
      </div>
    );
  }
}

export default CheckoutAddressTable;
