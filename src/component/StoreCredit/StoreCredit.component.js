import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import Field from 'Component/Field';
import Loader from 'Component/Loader';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
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
    toggleStoreCredit: (apply) => StoreCreditDispatcher.toggleStoreCredit(dispatch, apply)
});

export class StoreCredit extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        storeCredit: StoreCreditData.isRequired,
        canApply: PropTypes.bool,
        toggleStoreCredit: PropTypes.func.isRequired
    };

    static defaultProps = {
        canApply: false
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

    handleCheckboxChange = () => {
        const { creditIsApplied } = this.state;
        const { toggleStoreCredit } = this.props;

        toggleStoreCredit(!creditIsApplied).then((isApplied) => {
            this.setState({ creditIsApplied: isApplied });

            return isApplied;
        });
    };

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

    renderCheckbox(checkboxId) {
        const { creditIsApplied } = this.state;

        return (
            <Field
              block="StoreCredit"
              elem="Toggle"
              type="checkbox"
              id={ checkboxId }
              name={ checkboxId }
              value={ checkboxId }
              checked={ creditIsApplied }
              onClick={ this.handleCheckboxChange }
            />
        );
    }

    render() {
        const { isLoading, canApply } = this.props;
        const checkboxId = 'store_credit_applied';
        const label = canApply
            ? __('Use Store Credit')
            : __('Store Credit:');

        return (
            <div block="StoreCredit">
                <Loader isLoading={ isLoading } />

                { canApply && this.renderCheckbox(checkboxId) }

                <label block="StoreCredit" elem="Label" htmlFor={ checkboxId }>
                    { label }
                    { this.renderAmount() }
                </label>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreCredit);
