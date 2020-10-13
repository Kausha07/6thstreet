import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Form from 'Component/Form';
import Loader from 'Component/Loader';
import MyAccountReturnCreateItem from 'Component/MyAccountReturnCreateItem';

import './MyAccountReturnCreate.style';

export class MyAccountReturnCreate extends PureComponent {
    static propTypes = {
        onItemClick: PropTypes.func.isRequired,
        onReasonChange: PropTypes.func.isRequired,
        onResolutionChange: PropTypes.func.isRequired,
        onFormSubmit: PropTypes.func.isRequired,
        incrementId: PropTypes.string,
        // TODO: move this to API types
        items: PropTypes.arrayOf(
            PropTypes.shape({
                item_id: PropTypes.string,
                reason_options: PropTypes.arrayOf(PropTypes.shape({
                    id: PropTypes.number,
                    label: PropTypes.string
                }))
            })
        ),
        isLoading: PropTypes.bool.isRequired,
        selectedNumber: PropTypes.number.isRequired,
        handleDiscardClick: PropTypes.func.isRequired,
        // TODO: Move to API types
        resolutions: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired
            })
        )
    };

    static defaultProps = {
        items: [],
        incrementId: '',
        resolutions: []
    };

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
                <MyAccountReturnCreateItem
                  item={ item }
                  onClick={ onItemClick }
                  onResolutionChange={ onResolutionChange }
                  onReasonChange={ onReasonChange }
                  resolutions={ resolutions }
                />
            </li>
        );
    };

    renderOrderItems() {
        const { items, onFormSubmit } = this.props;

        return (
            <Form id="create-return" onSubmitSuccess={ onFormSubmit }>
                <ul>
                    { items.map(this.renderOrderItem) }
                </ul>
                { this.renderActions() }
            </Form>
        );
    }

    renderActions() {
        const { handleDiscardClick, selectedNumber } = this.props;
        const submitText = selectedNumber !== 1 ? __('Return %s items', selectedNumber)
            : __('Return %s item', selectedNumber);

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

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    renderOrderNumber() {
        const { incrementId } = this.props;

        return (
            <h2 block="MyAccountReturnCreate" elem="OrderNumber">
                { __('Order #%s', incrementId) }
            </h2>
        );
    }

    renderHeading() {
        return (
            <h2 block="MyAccountReturnCreate" elem="Heading">
                { __('Select 1 or more items you wish to return.') }
            </h2>
        );
    }

    renderReturnNotPossible() {
        return 'return is not possible at the time';
    }

    renderContent() {
        const { isLoading, incrementId } = this.props;

        if (!isLoading && !incrementId) {
            return this.renderReturnNotPossible();
        }

        return (
            <>
                { this.renderOrderNumber() }
                { this.renderHeading() }
                { this.renderOrderItems() }
            </>
        );
    }

    render() {
        return (
            <div block="MyAccountReturnCreate">
                { this.renderLoader() }
                { this.renderContent() }
            </div>
        );
    }
}

export default MyAccountReturnCreate;
