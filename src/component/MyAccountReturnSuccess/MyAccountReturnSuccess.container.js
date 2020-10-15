// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { customerType } from 'Type/Account';
import { MatchType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountReturnSuccess from './MyAccountReturnSuccess.component';

export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = () => ({});

export class MyAccountReturnSuccessContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired,
        customer: customerType.isRequired
    };

    state = {
        order_id: null,
        order_increment_id: null,
        increment_id: null,
        items: [],
        date: null,
        isLoading: false
    };

    componentDidMount() {
        this.getReturnInformation();
    }

    containerProps = () => {
        const { customer } = this.props;
        const {
            order_id,
            order_increment_id,
            increment_id,
            date,
            items,
            isLoading
        } = this.state;

        return {
            orderId: order_id,
            orderNumber: order_increment_id,
            returnNumber: increment_id,
            date,
            items,
            isLoading,
            customer
        };
    };

    getReturnId() {
        const {
            match: {
                params: {
                    returnId
                } = {}
            } = {}
        } = this.props;

        return returnId;
    }

    getReturnInformation() {
        const returnId = this.getReturnId();

        this.setState({ isLoading: true });

        MagentoAPI.get(`returns/${ returnId }`).then(({ data }) => {
            const {
                order_id,
                order_increment_id,
                increment_id,
                date,
                items
            } = data;

            this.setState({
                isLoading: false,
                order_id,
                order_increment_id,
                increment_id,
                date,
                items
            });
        }).catch((error) => {
            this.setState({ isLoading: false });

            console.error(error);
        });
    }

    render() {
        return <MyAccountReturnSuccess { ...this.containerProps() } />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnSuccessContainer);
