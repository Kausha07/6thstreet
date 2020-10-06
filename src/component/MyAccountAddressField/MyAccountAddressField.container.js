/* eslint-disable max-len */
// import MyAccountAddressPopupContainer from '../../../node_modules/@scandipwa/scandipwa/src/component/MyAccountAddressPopup.container';

import MyAccountAddressPopupContainer from 'Component/MyAccountAddressPopup.container';

import MyAccountAddressField from './MyAccountAddressField.component';

class MyAccountAddressFieldContainer extends MyAccountAddressPopupContainer {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        return (
            <MyAccountAddressField
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default MyAccountAddressFieldContainer;
