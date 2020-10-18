import Form from 'Component/Form';
import { MyAccountReturnCreate } from 'Component/MyAccountReturnCreate/MyAccountReturnCreate.component';

import './MyAccountCancelCreate.style';

class MyAccountCancelCreate extends MyAccountReturnCreate {
    renderOrderItems() {
        const { items, onFormSubmit } = this.props;

        return (
            <Form id="cancel-return" onSubmitSuccess={ onFormSubmit }>
                <ul>
                    { items.map(this.renderOrderItem) }
                </ul>
                { this.renderActions() }
            </Form>
        );
    }

    renderActions() {
        return (
            <button type="submit" block="Button">
                { __('Cancel') }
            </button>
        );
    }
}

export default MyAccountCancelCreate;
