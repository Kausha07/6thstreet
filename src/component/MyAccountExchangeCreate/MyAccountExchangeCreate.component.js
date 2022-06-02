import PropTypes from "prop-types";
import { PureComponent } from "react";
import { getCountryFromUrl } from "Util/Url/Url";

import Form from "Component/Form";
import Loader from "Component/Loader";
import MyAccountReturnCreateItem from "Component/MyAccountReturnCreateItem";
import { ReturnReasonType, ReturnResolutionType } from "Type/API";
import CheckoutAddressBook from "Component/CheckoutAddressBook";
import "./MyAccountExchangeCreate.style";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";

export class MyAccountExchangeCreate extends PureComponent {
  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    onReasonChange: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    incrementId: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        item_id: PropTypes.string,
        reason_options: PropTypes.arrayOf(ReturnReasonType),
      })
    ),
    isLoading: PropTypes.bool.isRequired,
    selectedNumber: PropTypes.number.isRequired,
    handleDiscardClick: PropTypes.func.isRequired,
    resolutions: PropTypes.arrayOf(ReturnResolutionType),
  };

  static defaultProps = {
    items: [],
    incrementId: "",
    resolutions: [],
  };

  renderOrderItem = (item) => {
    const { item_id } = item;
    const { onItemClick, onReasonChange, resolutions, reasonId } = this.props;

    if (!item.is_exchangeable) {
      return false;
    }

    return (
      <li block="MyAccountExchangeCreate" elem="Item" key={item_id}>
        <MyAccountReturnCreateItem
          item={item}
          {...this.props}
          isExchange={true}
          reasonId={reasonId}
          onClick={onItemClick}
          onReasonChange={onReasonChange}
          resolutions={resolutions}
        />
      </li>
    );
  };

  renderOrderItems() {
    const { items = [], onFormSubmit } = this.props;
    return (
      <Form id="create-exchange" onSubmitSuccess={onFormSubmit}>
        <ul>{items.map(this.renderOrderItem)}</ul>
        {this.renderActions()}
      </Form>
    );
  }

  checkOutOfStockStatus = () => {
    const { isOutOfStock } = this.props;
    let outOfStockItems = Object.values(isOutOfStock).filter((item) => {
      if (item === true) {
        return item;
      }
    });
    return outOfStockItems.length === Object.keys(isOutOfStock).length;
  };

  renderActions() {
    const {
      handleDiscardClick,
      selectedNumber,
      disabledStatus,
      disabledStatusArr,
    } = this.props;
    let outOfStockStatus = this.checkOutOfStockStatus();
    let isDisabled = false;
    // outOfStockStatus === true
    //   ? true
    //   : Object.keys(disabledStatusArr).length < selectedNumber
    //   ? true
    //   : disabledStatus === true
    //   ? true
    //   : false;
    const submitText =
      selectedNumber !== 1
        ? __("Exchange %s items", selectedNumber)
        : __("Exchange %s item", selectedNumber);
    return (
      <div>
        <div block="MyAccountExchangeCreate" elem="Actions">
          <button
            block="MyAccountExchangeCreate"
            elem="ButtonDiscard"
            type="button"
            mix={{ block: "Button" }}
            onClick={handleDiscardClick}
          >
            {__("Discard")}
          </button>
          <button
            block="MyAccountExchangeCreate"
            elem="ButtonSubmit"
            type="submit"
            disabled={isDisabled}
            mix={{ block: "Button" }}
          >
            {submitText}
          </button>
        </div>
      </div>
    );
  }

  renderLoader() {
    const { isLoading } = this.props;

    return <Loader isLoading={isLoading} />;
  }

  renderOrderNumber() {
    const { incrementId } = this.props;

    return (
      <h2 block="MyAccountExchangeCreate" elem="OrderNumber">
        {__("Order #%s", incrementId)}
      </h2>
    );
  }

  renderHeading() {
    return (
      <h2 block="MyAccountExchangeCreate" elem="Heading">
        {__("Select 1 or more items you wish to exchange.")}
      </h2>
    );
  }

  renderExchangeNotPossible() {
    return __("Exchange is not possible at the time");
  }

  onAddressSelect = (address) => {
    const { id = 0 } = address;
    const { setSelectedAddress } = this.props;
    setSelectedAddress(id);
  };

  renderAddAdress() {
    const { customer, showCards, closeForm, openForm, isArabic, formContent } =
      this.props;
    return (
      <div
        block="MyAccountAddressBook"
        elem="ContentWrapper"
        mods={{ formContent }}
      >
        <button
          block="MyAccountAddressBook"
          elem="backButton"
          mods={{ isArabic }}
          onClick={showCards}
        />
        <MyAccountAddressPopup
          formContent={formContent}
          closeForm={closeForm}
          openForm={openForm}
          showCards={showCards}
          customer={customer}
        />
      </div>
    );
  }

  renderButtonLabel() {
    const { isMobile } = this.props;

    return isMobile ? (
      <>
        <span
          style={{ paddingRight: "10px", fontWeight: "bold", fontSize: "16px" }}
        >
          +
        </span>{" "}
        {__("New address")}
      </>
    ) : (
      __("Add new address")
    );
  }

  renderOpenPopupButton = () => {
    const {
      notSavedAddress,
      addresses,
      openFirstPopup,
      formContent,
      isArabic,
      openNewForm,
      setPopStatus,
      isSignedIn,
    } = this.props;

    const isCountryNotAddressAvailable =
      !addresses.some((add) => add.country_code === getCountryFromUrl()) &&
      !isMobile.any();
    if (!openFirstPopup && addresses && isSignedIn && notSavedAddress()) {
      setPopStatus();
      openNewForm();
    }

    if (isSignedIn && addresses.length > 0) {
      return (
        <div
          block="MyAccountAddressBook"
          elem="NewAddressWrapper"
          mods={{ formContent, isArabic, isCountryNotAddressAvailable }}
        >
          <button
            block="MyAccountAddressBook"
            elem="NewAddress"
            mix={{
              block: "button primary small",
            }}
            onClick={openNewForm}
          >
            {this.renderButtonLabel()}
          </button>
        </div>
      );
    }

    return null;
  };

  renderExchangeAddress = () => {
    const {
      addresses,
      hideCards,
      showCards,
      closeForm,
      openForm,
      formContent,
      isSignedIn,
    } = this.props;
    return (
      <>
        {this.renderOpenPopupButton()}
        {formContent ? (
          this.renderAddAdress()
        ) : (
          <CheckoutAddressBook
            onAddressSelect={this.onAddressSelect}
            addresses={addresses}
            formContent={formContent}
            closeForm={closeForm}
            openForm={openForm}
            showCards={showCards}
            hideCards={hideCards}
          />
        )}
      </>
    );
  };

  renderContent() {
    const { isLoading, incrementId } = this.props;
    if (isLoading) {
      return null;
    }

    if (!isLoading && !incrementId) {
      return this.renderExchangeNotPossible();
    }

    return (
      <>
        {this.renderOrderNumber()}
        {this.renderHeading()}
        {this.renderOrderItems()}
      </>
    );
  }

  render() {
    const { showExchangeAddress } = this.props;
    return (
      <div block="MyAccountExchangeCreate">
        {this.renderLoader()}
        {this.renderContent()}
        {/* {showExchangeAddress && this.renderExchangeAddress()} */}
      </div>
    );
  }
}

export default MyAccountExchangeCreate;
