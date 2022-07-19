import { MyAccountTabListItem as SourceMyAccountTabListItem } from "SourceComponent/MyAccountTabListItem/MyAccountTabListItem.component";
import StoreCredit from "Component/StoreCredit";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import {
  EVENT_MOE_ACCOUNT_ORDERS_CLICK,
  EVENT_MOE_ACCOUNT_RETURNS_CLICK,
  EVENT_MOE_ACCOUNT_ADDRESS_BOOK_CLICK,
  EVENT_MOE_ACCOUNT_PROFILE_CLICK,
  EVENT_MOE_ACCOUNT_CLUB_APPAREL_CLICK,
  EVENT_MOE_ACCOUNT_SETTINGS_CLICK,
  EVENT_MOE_ACCOUNT_CUSTOMER_SUPPORT_CLICK,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
export class MyAccountTabListItem extends SourceMyAccountTabListItem {
  state = {
    isArabic: isArabic(),
  };

  sendEvents(name) {
    const MoeEvent =
      name == "My Profile"
        ? EVENT_MOE_ACCOUNT_PROFILE_CLICK
        : name == "My Orders"
        ? EVENT_MOE_ACCOUNT_ORDERS_CLICK
        : name == "settings"
        ? EVENT_MOE_ACCOUNT_SETTINGS_CLICK
        : name == "My Address Book"
        ? EVENT_MOE_ACCOUNT_ADDRESS_BOOK_CLICK
        : name == "My Return/Exchange"
        ? EVENT_MOE_ACCOUNT_RETURNS_CLICK
        : name == "Club Apparel Loyalty"
        ? EVENT_MOE_ACCOUNT_CLUB_APPAREL_CLICK
        : "";
    Moengage.track_event(MoeEvent, {
      country: getCountryFromUrl() ? getCountryFromUrl().toUpperCase() : "",
      language: getLanguageFromUrl() ? getLanguageFromUrl().toUpperCase() : "",
      app6thstreet_platform: "Web",
    });
  }

  render() {
    const {
      tabEntry: [, { name, linkClassName, className }],
      isActive,
      tabEntry,
    } = this.props;
    const tabImageId = tabEntry[0];
    const { isArabic } = this.state;

    return (
      <li
        block={
          linkClassName
            ? `MyAccountTabListItem`
            : `MyAccountTabListItem ${className}`
        }
        mods={{ isActive, [linkClassName]: !!linkClassName }}
      >
        <button
          block="MyAccountTabListItem"
          elem="Button"
          mods={{ tabImageId }}
          onClick={() => {
            this.changeActiveTab();
            this.sendEvents(name);
          }}
          role="link"
        >
          {name === __("Payment Methods") ? (
            <div
              block="MyAccountTabListItem"
              elem="nameElem"
              mods={{ isArabic }}
            >
              <div>{__("Payments")}</div>
              {/* {isMobile.any() ? <StoreCredit /> : null} */}
            </div>
          ) : (
            name
          )}
        </button>
      </li>
    );
  }
}

export default MyAccountTabListItem;
