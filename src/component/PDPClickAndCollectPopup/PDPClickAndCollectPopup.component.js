import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Popup from 'Component/Popup';
import Form from 'SourceComponent/Form';
import Field from 'SourceComponent/Field';
import { Search } from '../Icons';
import { isArabic } from 'Util/App';

import { PDP_CLICK_AND_COLLECT_POPUP_ID } from './PDPClickAndCollectPopup.config';
import './PDPClickAndCollectPopup.style';

class PDPClickAndCollectPopup extends PureComponent {
    static propTypes = {
        togglePDPClickAndCollectPopup: PropTypes.func.isRequired,
        stores: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
        selectedClickAndCollectStore: PropTypes.object,
        confirmClickAndCollect: PropTypes.func.isRequired
    };

    static defaultProps = {
        selectedClickAndCollectStore: null
    };

    renderStoreSelect() {
        const { stores, selectedClickAndCollectStore, selectClickAndCollectStore } = this.props;
        return (
            <Form key="select-store">
                <Search />
                <Field
                    type="select"
                    id="selectStore"
                    name="selectStore"
                    placeholder={ `${ __('Select a Store') }*` }
                    selectOptions={ stores }
                    value={ selectedClickAndCollectStore }
                    onChange={ selectClickAndCollectStore }
                />
            </Form>
        );
    }

    renderConfirmButton() {
        const { selectedClickAndCollectStore, confirmClickAndCollect, isLoading } = this.props;
        return (
            <button
                block="PDPAddToCart"
                elem="ConfirmClickAndCollectButton"
                mods={{
                    isLoading: isLoading
                }}
                disabled={ !selectedClickAndCollectStore || isLoading }
                onClick={ confirmClickAndCollect }
            >
                {
                    isLoading
                    ?
                    <span>{ __('Adding to Bag...')}</span>
                    :
                    <span>{ __('CONFIRM CLICK & COLLECT')}</span>
                }
            </button>
        )
    }

    render() {
        return (
            <Popup
                id={ PDP_CLICK_AND_COLLECT_POPUP_ID }
                mix={ {
                    block: 'PDPClickAndCollectPopup',
                    mods: { isArabic: isArabic() } 
                }}
                onHide={this.props.togglePDPClickAndCollectPopup}
            >
                <h3>{ __( "PICK A STORE" ) }</h3>
                <div block="PDPClickAndCollectPopup" elem="StoreSelectContainer">
                    { this.renderStoreSelect() }
                </div>
                <h4>
                    Orders can take 1-2 hours to get to the store. In addition to your order confirmation, you will receive an email notification once your order has shipped and another email once it has arrived in store and is available for pickup.
                </h4>
                <div block="PDPClickAndCollectPopup" elem="ConfirmButtonContainer">
                    { this.renderConfirmButton() }
                </div>
            </Popup>
        );
    }
}

export default PDPClickAndCollectPopup;
