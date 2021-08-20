import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    STATUS_BEING_PROCESSED,
    STATUS_COMPLETE
} from 'Component/MyAccountOrderListItem/MyAccountOrderListItem.config';
import { HistoryType, MatchType } from 'Type/Common';
import { getCountriesForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountOrderView from './MyAccountOrderView.component';
import { DISPLAY_DISCOUNT_PERCENTAGE } from '../Price/Price.config';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    country: state.AppState.country
});

export const mapDispatchToProps = () => ({});

export class MyAccountOrderViewContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired,
        config: Config.isRequired,
        history: HistoryType.isRequired,
        country: PropTypes.string.isRequired
    };

    containerFunctions = {
        getCountryNameById: this.getCountryNameById.bind(this),
        openOrderCancelation: this.openOrderCancelation.bind(this)
    };

    state = {
        isLoading: true,
        order: null
    };

    constructor(props) {
        super(props);

        this.getOrder();
    }

    containerProps = () => {
        const {
            isLoading,
            order
        } = this.state;
        const { history, country } = this.props;

        const displayDiscountPercentage = DISPLAY_DISCOUNT_PERCENTAGE[country];
        return {
            isLoading,
            order,
            history,
            displayDiscountPercentage
        };
    };

    getCountryNameById(countryId) {
        const { config } = this.props;
        const countries = getCountriesForSelect(config);

        return (countries.find(({ id }) => id === countryId) || {}).label || '';
    }

    getOrderId() {
        const {
            match: {
                params: {
                    order
                } = {}
            } = {}
        } = this.props;
        return order;
    }

    openOrderCancelation() {
        const { history } = this.props;
        const { order: { entity_id, status, is_returnable } = {} } = this.state;

        if (!entity_id || !(STATUS_BEING_PROCESSED.includes(status) || (status === STATUS_COMPLETE && is_returnable))) {
            return;
        }

        const url = status === STATUS_COMPLETE ? `/my-account/return-item/create/${ entity_id }`
            : `/my-account/return-item/cancel/${ entity_id }`;

        history.push(url);
    }

    async getOrder() {
        try {
            const orderId = this.getOrderId();
            const { data: order } = await MagentoAPI.get(`orders/${ orderId }`);
            this.setState({ order, isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <MyAccountOrderView
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderViewContainer));
