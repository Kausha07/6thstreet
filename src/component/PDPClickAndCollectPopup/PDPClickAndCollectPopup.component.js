import PropTypes from "prop-types";
import { PureComponent } from "react";
import CTCPopup from "Component/CTCPopup";

import Form from "SourceComponent/Form";
import Field from "SourceComponent/Field";
import { Search } from "../Icons";
import { isArabic } from "Util/App";

import { PDP_CLICK_AND_COLLECT_POPUP_ID } from "./PDPClickAndCollectPopup.config";
import "./PDPClickAndCollectPopup.style";

class PDPClickAndCollectPopup extends PureComponent {
  static propTypes = {
    togglePDPClickAndCollectPopup: PropTypes.func.isRequired,
    stores: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    selectedClickAndCollectStore: PropTypes.object,
    confirmClickAndCollect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedClickAndCollectStore: null,
  };

  state = {
    searchKeyword: "",
    showStoreList: true,
    nearMe: true,
  };

  handleSearchKeywordChange(value) {
    this.setState({ searchKeyword: value });
  }

  handleStoreSelect(store) {
    const { selectClickAndCollectStore } = this.props;
    selectClickAndCollectStore(store);
    this.setState(
      {
        searchKeyword: store.label,
      },
      this.toggleStoreList
    );
  }

  toggleStoreList() {
    const { showStoreList } = this.state;
    this.setState({
      showStoreList: !showStoreList,
    });
  }

  storeListDisplay() {
    this.setState({
      showStoreList: true,
    });
  }
  renderStoreSelect() {
    const { searchKeyword } = this.state;
    return (
      <>
        <Form key="select-store">
          <Search />
          <Field
            type="input"
            id="selectStore"
            name="selectStore"
            placeholder={`${__("Select a Store")}*`}
            value={searchKeyword}
            onChange={(value) => this.handleSearchKeywordChange(value)}
            onClick={() => this.storeListDisplay()}
          />
        </Form>
        {this.renderStoresList()}
      </>
    );
  }

  renderStoresList() {
    const { stores } = this.props;
    const { searchKeyword, showStoreList, nearMe } = this.state;

    if (showStoreList) {
      return (
        <>
          {/* <Field
                            type="toggle"
                            value={nearMe}
                            checked={nearMe}
                            name="Near Me"
                            label="Near Me"
                            id="NearMe"
                            onClick={(checked) => {
                                console.log(checked)
                                this.setState({nearMe: !checked})
                            }}
                    /> */}
          <ul>
            {stores
              .filter((store) =>
                store.label.toLowerCase().includes(searchKeyword.toLowerCase())
              )
              .map((store) => (
                <li
                  onClick={(e) => {
                    e.persist();
                    e.nativeEvent.stopImmediatePropagation();
                    this.handleStoreSelect(store);
                    e.stopPropagation();
                  }}
                  key={store.id}
                >
                  <div>{store.label}</div>
                  <div>{`${store.city} | ${store.area}`}</div>
                </li>
              ))}
          </ul>
        </>
      );
    }
    return null;
  }

  renderConfirmButton() {
    const { selectedClickAndCollectStore, confirmClickAndCollect, isLoading } =
      this.props;
    return (
      <button
        block="PDPAddToCart"
        elem="ConfirmClickAndCollectButton"
        mods={{
          isLoading: isLoading,
        }}
        disabled={!selectedClickAndCollectStore || isLoading}
        onClick={confirmClickAndCollect}
      >
        {isLoading ? (
          <span>{__("Adding to Bag...")}</span>
        ) : (
          <span>{__("CONFIRM CLICK & COLLECT")}</span>
        )}
      </button>
    );
  }

  render() {
    const { togglePDPClickAndCollectPopup, openClickAndCollectPopup } =
      this.props;
    const { showStoreList } = this.state;

    return (
      <CTCPopup
        id={PDP_CLICK_AND_COLLECT_POPUP_ID}
        mix={{
          block: "PDPClickAndCollectPopup",
          mods: {
            isArabic: isArabic(),
          },
        }}
        onClose={togglePDPClickAndCollectPopup}
        open={openClickAndCollectPopup}
      >
        <h3>{__("PICK A STORE")}</h3>
        <div block="PDPClickAndCollectPopup" elem="StoreSelectContainer">
          {this.renderStoreSelect()}
        </div>
        {!showStoreList ? (
          <>
            <h4>
              Orders can take 1-2 hours to get to the store. In addition to your
              order confirmation, you will receive an email notification once
              your order has shipped and another email once it has arrived in
              store and is available for pickup.
            </h4>
            <div block="PDPClickAndCollectPopup" elem="ConfirmButtonContainer">
              {this.renderConfirmButton()}
            </div>
          </>
        ) : null}
      </CTCPopup>
    );
  }
}

export default PDPClickAndCollectPopup;
