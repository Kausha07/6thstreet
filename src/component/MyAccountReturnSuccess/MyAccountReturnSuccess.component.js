import PropTypes from 'prop-types';

import Link from 'Component/Link';
import { MyAccountReturnCreate } from 'Component/MyAccountReturnCreate/MyAccountReturnCreate.component';
import MyAccountReturnSuccessItem from 'Component/MyAccountReturnSuccessItem';
import { customerType } from 'Type/Account';
import { formatDate } from 'Util/Date';

import './MyAccountReturnSuccess.style';

export class MyAccountReturnSuccess extends MyAccountReturnCreate {
    static propTypes = {
        orderId: PropTypes.string,
        returnNumber: PropTypes.string,
        orderNumber: PropTypes.string,
        customer: customerType.isRequired,
        date: PropTypes.string,
        item: PropTypes.any // TODO: Should be some specific type
    };

    static defaultProps = {
        orderId: null,
        returnNumber: null,
        orderNumber: null,
        date: null
    };

    renderHeading() {
        const { customer: { email } = {} } = this.props;

        return (
            <div block="MyAccountReturnSuccess" elem="Heading">
                <p>{ __('We have received your request.') }</p>
                { !!email && (
                    <p>
                        { __('An email has been sent to ') }
                        <span>{ email }</span>
                        { __(' with next steps.') }
                    </p>
                ) }
            </div>
        );
    }

    renderItems() {
        const { items = [] } = this.props;

        return (
            <div block="MyAccountReturnSuccess" elem="Items">
                { items.map((item) => (
                    <MyAccountReturnSuccessItem
                      key={ item.id }
                      item={ item }
                    />
                )) }
            </div>
        );
    }

    renderDetails() {
        const { returnNumber, orderNumber, date } = this.props;
        const dateObject = new Date(date);
        const dateString = formatDate('YY/MM/DD at hh:mm', dateObject);

        return (
            <div block="MyAccountReturnSuccess" elem="Details">
                <h3>{ __('Request information') }</h3>
                <p>
                    { __('ID: ') }
                    <span>{ returnNumber }</span>
                </p>
                <p>
                    { __('Order ID: ') }
                    <span>{ orderNumber }</span>
                </p>
                <p>
                    { __('Date requested ') }
                    <span>{ dateString }</span>
                </p>
            </div>
        );
    }

    renderBackButton() {
        const { orderId } = this.props;

        if (!orderId) {
            return null;
        }

        return (
            <Link
              block="MyAccountReturnSuccess"
              elem="BackButton"
              to={ `/my-account/my-orders/${ orderId }` }
            >
                { __('Back to Order Detail') }
            </Link>
        );
    }

    renderContent() {
        const { isLoading, returnNumber } = this.props;

        if (!isLoading && !returnNumber) {
            return this.renderReturnNotPossible();
        }

        return (
            <>
                { this.renderHeading() }
                { this.renderItems() }
                { this.renderDetails() }
            </>
        );
    }

    render() {
        return (
            <div block="MyAccountReturnSuccess">
                { this.renderLoader() }
                { this.renderContent() }
                { this.renderBackButton() }
            </div>
        );
    }
}

export default MyAccountReturnSuccess;
