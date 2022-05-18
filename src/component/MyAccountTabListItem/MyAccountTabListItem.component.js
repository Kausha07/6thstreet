import { MyAccountTabListItem as SourceMyAccountTabListItem } from "SourceComponent/MyAccountTabListItem/MyAccountTabListItem.component";
import StoreCredit from 'Component/StoreCredit';
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
export class MyAccountTabListItem extends SourceMyAccountTabListItem {

  state= {
    isArabic: isArabic(),
  }
  render() {
    const {
      tabEntry: [, { name, linkClassName, className }],
      isActive,
      tabEntry,
    } = this.props;
    const tabImageId = tabEntry[0];
    const {isArabic} = this.state;
    return (
      <li
        block={linkClassName ? `MyAccountTabListItem` : `MyAccountTabListItem ${className}`}
        mods={{ isActive, [linkClassName]: !!linkClassName }}
      >
        <button
          block="MyAccountTabListItem"
          elem="Button"
          mods={{ tabImageId }}
          onClick={this.changeActiveTab}
          role="link"
        >
          {name === __("Payment Methods") ?
            <div 
            block="MyAccountTabListItem"
            elem="nameElem"
            mods={{ isArabic }}
            >
              <div>
                {__("Payments")}
              </div>
              {isMobile.any() ? <StoreCredit /> : null}
            </div> 
            : name
          }
        </button>
      </li>
    );
  }
}

export default MyAccountTabListItem;
