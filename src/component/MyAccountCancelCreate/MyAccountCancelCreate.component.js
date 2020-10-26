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
