import { CheckoutSuccess } from 'Component/CheckoutSuccess/CheckoutSuccess.component';
import Image from 'Component/Image';
import WarningImage from 'Component/MyAccountOrderView/icons/warning.png';

export class CheckoutFail extends CheckoutSuccess {
    renderStatus() {
        return (
            <div block="MyAccountOrderView" elem="StatusFailed">
                <Image
                  src={ WarningImage }
                  mix={ { block: 'MyAccountOrderView', elem: 'WarningImage' } }
                />
                <p>
                    { __('Payment Failed') }
                </p>
            </div>
        );
    }

    renderDetails() {
        return (
            <div block="CheckoutSuccess">
                <div block="CheckoutSuccess" elem="Details">
                    { this.renderStatus() }
                    { this.renderTrackOrder() }
                    { this.renderTotalsItems() }
                    { this.renderTotals() }
                    { this.renderAddresses() }
                    { this.renderDeliveryOption() }
                    { this.renderPaymentType() }
                </div>
                { this.renderMyAccountPopup() }
            </div>
        );
    }
}

export default CheckoutFail;
