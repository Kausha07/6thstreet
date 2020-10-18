import { connect } from 'react-redux';

import { MyAccountReturnCreateContainer } from 'Component/MyAccountReturnCreate/MyAccountReturnCreate.container';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountCancelCreate from './MyAccountCancelCreate.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = () => ({});

export class MyAccountCancelCreateContainer extends MyAccountReturnCreateContainer {
    async getReturnableItems() {
        try {
            const orderId = this.getOrderId();
            const { items, order_id: incrementId } = await MagentoAPI.get(`/order/${ orderId }/cancelable-items`);
            this.setState({ items, incrementId, isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
        }
    }

    // TODO: For now this is an example of a request function
    // It will be needed when developing cancel functionality
    async onFormSubmit() {
        // const { selectedItems, items } = this.state;

        // const payload = {
        //     order_id: this.getOrderId()
        //     // TODO: for some reasons items break the BE (report to 6th street)
        //     // items: Object.entries(selectedItems).map(([id, resolutionId]) => {
        //     //     const { qty_to_cancel } = items.find(({ item_id }) => item_id === id);

        //     //     return {
        //     //         order_item_id: id,
        //     //         qty: qty_to_cancel,
        //     //         resolution: {
        //     //             id: resolutionId
        //     //         }
        //     //     };
        //     // })
        // };
    }

    render() {
        return (
            <MyAccountCancelCreate
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCancelCreateContainer);
