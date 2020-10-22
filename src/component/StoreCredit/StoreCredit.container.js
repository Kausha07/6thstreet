import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import StoreCreditDispatcher, { STORE_CREDIT } from 'Store/StoreCredit/StoreCredit.dispatcher';
import { StoreCreditData } from 'Util/API/endpoint/StoreCredit/StoreCredit.type';
import BrowserDatabase from 'Util/BrowserDatabase';

import StoreCredit from './StoreCredit.component';

import './StoreCredit.style';

export const mapStateToProps = ({
    StoreCreditReducer: {
        storeCredit,
        isLoading
    }
}) => ({
    storeCredit,
    isLoading
});

export const mapDispatchToProps = (dispatch) => ({
    toggleStoreCredit: (apply) => StoreCreditDispatcher.toggleStoreCredit(dispatch, apply),
    fetchStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch),
    isStoreCreditApplied: () => StoreCreditDispatcher.isStoreCreditApplied()
});

export class StoreCreditContainer extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        storeCredit: StoreCreditData.isRequired,
        canApply: PropTypes.bool,
        hideIfZero: PropTypes.bool,
        toggleStoreCredit: PropTypes.func.isRequired,
        fetchStoreCredit: PropTypes.func.isRequired,
        isStoreCreditApplied: PropTypes.func.isRequired
    };

    static defaultProps = {
        canApply: false,
        hideIfZero: false
    };

    state = {
        storeCreditBalance: null,
        creditIsApplied: false
    };

    static getDerivedStateFromProps(props, state) {
        const { storeCredit: { current_balance: storeCreditBalance } = {}, isStoreCreditApplied } = props;
        const { storeCreditBalance: currentStoreCreditBalance, currentCreditIsApplied } = state;
        const newState = {};
        const creditIsApplied = isStoreCreditApplied();

        if (storeCreditBalance !== currentStoreCreditBalance) {
            newState.storeCreditBalance = storeCreditBalance;
        }

        if (creditIsApplied !== currentCreditIsApplied) {
            newState.creditIsApplied = creditIsApplied;
        }

        return newState.length ? newState : null;
    }

    componentDidMount() {
        const dbStoreCredit = BrowserDatabase.getItem(STORE_CREDIT) || null;
        const { fetchStoreCredit } = this.props;

        if (!dbStoreCredit) {
            fetchStoreCredit();
        }
    }

    render() {
        console.log(this.props);
        const props = {
            ...this.props,
            ...this.state
        };

        return (
            <StoreCredit { ...props } />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreCreditContainer);
