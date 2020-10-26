// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { MatchType } from 'Type/Common';
import { getCountriesForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountOrderView from './MyAccountOrderView.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config
});

export const mapDispatchToProps = () => ({});

export class MyAccountOrderViewContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired,
        config: Config.isRequired
    };

    containerFunctions = {
        getCountryNameById: this.getCountryNameById.bind(this)
    };

    state = {
        isLoading: true,
        order: {}
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

        return {
            isLoading,
            order
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

    async getOrder() {
        try {
            const orderId = this.getOrderId();
            const { data: order } = await MagentoAPI.get(`/orders/${ orderId }`);
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderViewContainer);
