import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { StoreCreditData } from 'Util/API/endpoint/StoreCredit/StoreCredit.type';

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
    toggleStoreCredit: (apply) => StoreCreditDispatcher.toggleStoreCredit(dispatch, apply)
});

export class StoreCreditContainer extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        storeCredit: StoreCreditData.isRequired,
        canApply: PropTypes.bool,
        hideIfZero: PropTypes.bool,
        toggleStoreCredit: PropTypes.func.isRequired
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
        const { storeCredit: { current_balance: storeCreditBalance } = {} } = props;
        const { storeCreditBalance: currentStoreCreditBalance } = state;

        if (storeCreditBalance !== currentStoreCreditBalance) {
            return { storeCreditBalance };
        }

        return null;
    }

    render() {
        const props = {
            ...this.props,
            ...this.state,
            setCreditIsApplied: (value) => this.setState(value)
        };

        return (
            <StoreCredit { ...props } />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreCreditContainer);
