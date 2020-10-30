import { CheckoutSuccess as SourceCheckoutSuccess } from 'SourceComponent/CheckoutSuccess/CheckoutSuccess.component';

import './CheckoutSuccess.style.scss';

export class CheckoutSuccess extends SourceCheckoutSuccess {
    state = {
        delay: 1000,
        successHidden: false,
        wasLoaded: false
    };

    componentDidMount() {
        const { delay } = this.state;
        this.timer = setInterval(this.tick, delay);
    }

    componentDidUpdate(prevState) {
        const { delay } = this.state;
        if (prevState !== delay) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, delay);
        }
    }

    componentWillUnmount() {
        this.timer = null;
    }

    tick = () => {
        const { wasLoaded, successHidden } = this.state;
        if (!successHidden) {
            this.setState({ successHidden: true });
        }
        if (!wasLoaded && successHidden) {
            this.setState({ wasLoaded: true });
        }
    };

    renderSuccess() {
        const { successHidden } = this.state;
        return (
            <div block={ `SuccessOverlay ${successHidden ? 'hidden' : ''}` }>
                <div block="OrderPlacedTextWrapper">
                    <div block="confirmSimbol" />
                    <p>
                        { __('Order Placed') }
                    </p>
                </div>
            </div>
        );
    }

    render() {
        const { orderID } = this.props;
        const { wasLoaded } = this.state;

        return (
            <div block="CheckoutSuccess">
                { wasLoaded ? '' : this.renderSuccess() }
                <h3>{ __('Your order # is: %s', orderID) }</h3>
                <p>{ __('We`ll email you an order confirmation with details and tracking info.') }</p>
                { this.renderButtons() }
            </div>
        );
    }
}

export default CheckoutSuccess;
