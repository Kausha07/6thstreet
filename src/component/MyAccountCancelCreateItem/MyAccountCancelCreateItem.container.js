import { connect } from 'react-redux';

import {
    mapDispatchToProps,
    mapStateToProps,
    MyAccountReturnCreateItemContainer as SourceComponent
} from 'Component/MyAccountReturnCreateItem/MyAccountReturnCreateItem.container';

import MyAccountCancelCreateItem from './MyAccountCancelCreateItem.component';
export class MyAccountCancelCreateItemContainer extends SourceComponent {

    onQuantitySelection(quantity, itemId) {
        const { handleChangeQuantity } = this.props
        handleChangeQuantity(quantity, itemId)
      }

    render() {
        const { country,cancelableQty } = this.props;
        return (
            <MyAccountCancelCreateItem
              cancelableQty={cancelableQty}
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCancelCreateItemContainer);
