/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    MyAccountReturnCreateListContainer as SourceComponent
} from 'Component/MyAccountReturnCreateList/MyAccountReturnCreateList.container';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';

import MyAccountOrderList from './MyAccountOrderList.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification('error', error)),
    getOrders: (limit, page) => MyAccountDispatcher.getOrders(limit, page)
});

export class MyAccountOrderListContainer extends SourceComponent {
    static propTypes = {
        ...SourceComponent.propTypes,
        getOrders: PropTypes.func.isRequired
    };

    state = {
        limit: 15,
        page: 0,
        orders: [],
        isGetNewOrders: true
    };

    componentDidMount() {
        const { limit, page } = this.state;
        this.setState({ isLoading: true });

        this.getOrderList(limit, page);

        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const {
            isMobile,
            limit,
            page,
            isLoading,
            isGetNewOrders
        } = this.state;
        const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
        const { body } = document;
        const html = document.documentElement;
        const footerHeight = !isMobile ? 300 : 0;
        const docHeight = Math
            .max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom + footerHeight >= docHeight && !isLoading && isGetNewOrders) {
            this.setState({ isLoading: true }, () => this.getOrderList(limit, page));
        }
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    containerProps = () => {
        const { orders, isLoading, requestInProgress } = this.state;

        return { orders, isLoading, requestInProgress };
    };

    getOrderList(limit = 0, page = 0) {
        const { getOrders, showErrorNotification } = this.props;
        const { orders } = this.state;

        this.setState({ requestInProgress: true });

        getOrders(limit, page).then(({ data }) => {
            this.setState({
                orders: data || orders,
                isLoading: false,
                requestInProgress: false,
                limit: limit + 15,
                page: page + 1,
                isGetNewOrders: data.length > orders.length
            });
        }).catch(() => {
            showErrorNotification(__('Error appeared while fetching orders'));
            this.setState({ isLoading: false, requestInProgress: false, isGetNewOrders: false });
        });
    }

    render() {
        return (
            <MyAccountOrderList
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderListContainer);
