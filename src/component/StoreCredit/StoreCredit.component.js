import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import Loader from 'Component/Loader';
// import { getInitialState } from 'Store/StoreCredit/StoreCredit.reducer';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
// import Field from 'Component/Field';
import { StoreCreditData } from 'Util/API/endpoint/StoreCredit/StoreCredit.type';

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
    retrieveStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch)
});

export class StoreCredit extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        storeCredit: StoreCreditData.isRequired,
        canApply: PropTypes.bool
        // applyStoreCredit: PropTypes.func.isRequired,
        // removeStoreCredit: PropTypes.func.isRequired
    };

    static defaultProps = {
        canApply: false
    };

    state = {
        storeCreditBalance: null
    };

    static getDerivedStateFromProps(props, state) {
        const { storeCredit: { current_balance: storeCreditBalance } = {} } = props;
        const { storeCreditBalance: currentStoreCreditBalance } = state;

        if (storeCreditBalance !== currentStoreCreditBalance) {
            return { storeCreditBalance };
        }

        return null;
    }

    renderAmount() {
        const { canApply } = this.props;
        const { storeCreditBalance } = this.state;
        const amount = canApply ? `(${ storeCreditBalance })` : storeCreditBalance;

        return (
            <span block="StoreCredit" elem="Amount">
                { ` ${ amount }` }
            </span>
        );
    }

    render() {
        const { isLoading, canApply } = this.props;
        const label = canApply
            ? __('Use Store Credit')
            : __('Store Credit:');

        return (
            <div block="StoreCredit" elem="Static">
                <Loader isLoading={ isLoading } />

                { label }
                { this.renderAmount() }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreCredit);
