import Form from 'Component/Form';
import MyAccountCancelCreateItem from 'Component/MyAccountCancelCreateItem';
import { MyAccountReturnCreate } from 'Component/MyAccountReturnCreate/MyAccountReturnCreate.component';

import './MyAccountCancelCreate.style';

class MyAccountCancelCreate extends MyAccountReturnCreate {
    renderOrderItem = (item) => {
        const { item_id } = item;
        const {
            onItemClick,
            onResolutionChange,
            onReasonChange,
            resolutions
        } = this.props;

        return (
            <li block="MyAccountReturnCreate" elem="Item" key={ item_id }>
                <MyAccountCancelCreateItem
                  item={ item }
                  onClick={ onItemClick }
                  onResolutionChange={ onResolutionChange }
                  onReasonChange={ onReasonChange }
                  resolutions={ resolutions }
                />
            </li>
        );
    };

    renderHeading() {
        return (
            <h2 block="MyAccountReturnCreate" elem="Heading">
                { __('Select 1 or more items you wish to cancel.') }
            </h2>
        );
    }

    renderOrderItems() {
        const { items, onFormSubmit } = this.props;

        return (
            <Form id="create-cancel" onSubmitSuccess={ onFormSubmit }>
                <ul>
                    { items.filter(({ qty_canceled, qty_to_cancel }) => +qty_canceled < +qty_to_cancel)
                        .map(this.renderOrderItem) }
                </ul>
                { this.renderActions() }
            </Form>
        );
    }

    renderActions() {
        const { handleDiscardClick, selectedNumber } = this.props;
        const submitText = selectedNumber <= 0
            ? __('Cancel') : __('Cancel %s %s', selectedNumber, selectedNumber === 1 ? __('item') : __('items'));

        return (
            <div block="MyAccountReturnCreate" elem="Actions">
                <button
                  block="MyAccountReturnCreate"
                  elem="ButtonDiscard"
                  type="button"
                  mix={ { block: 'Button' } }
                  onClick={ handleDiscardClick }
                >
                    { __('Discard') }
                </button>
                <button
                  block="MyAccountReturnCreate"
                  elem="ButtonSubmit"
                  type="submit"
                  mix={ { block: 'Button' } }
                  disabled={ selectedNumber <= 0 }
                >
                    { submitText }
                </button>
            </div>
        );
    }
}

export default MyAccountCancelCreate;
