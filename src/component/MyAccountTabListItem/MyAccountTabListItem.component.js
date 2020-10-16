import {
    MyAccountTabListItem as SourceMyAccountTabListItem
} from 'SourceComponent/MyAccountTabListItem/MyAccountTabListItem.component';

export class MyAccountTabListItem extends SourceMyAccountTabListItem {
    render() {
        const { tabEntry: [, { name, linkClassName }], isActive } = this.props;

        return (
            <li
              block="MyAccountTabListItem"
              mods={ { isActive, [linkClassName]: !!linkClassName } }
            >
                <button
                  block="MyAccountTabListItem"
                  elem="Button"
                  onClick={ this.changeActiveTab }
                  role="link"
                >
                    { name }
                </button>
            </li>
        );
    }
}

export default MyAccountTabListItem;
