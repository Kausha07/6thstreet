import { MyAccountTabListItem as SourceMyAccountTabListItem } from "SourceComponent/MyAccountTabListItem/MyAccountTabListItem.component";

export class MyAccountTabListItem extends SourceMyAccountTabListItem {
  render() {
    const {
      tabEntry: [, { name, linkClassName }],
      isActive,
      tabEntry,
    } = this.props;
    const tabImageId = tabEntry[0];

    return (
      <li
        block="MyAccountTabListItem"
        mods={{ isActive, [linkClassName]: !!linkClassName }}
      >
        <button
          block="MyAccountTabListItem"
          elem="Button"
          mods={{ tabImageId }}
          onClick={this.changeActiveTab}
          role="link"
        >
          {name}
        </button>
      </li>
    );
  }
}

export default MyAccountTabListItem;
