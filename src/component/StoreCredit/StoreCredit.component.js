import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Loader from 'Component/Loader';

import './StoreCredit.style';

export class StoreCredit extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        canApply: PropTypes.bool.isRequired,
        creditIsApplied: PropTypes.bool.isRequired,
        storeCreditBalance: PropTypes.string.isRequired,
        toggleStoreCredit: PropTypes.func.isRequired,
        setCreditIsApplied: PropTypes.func.isRequired
    };

    handleCheckboxChange = () => {
        const { toggleStoreCredit, creditIsApplied, setCreditIsApplied } = this.props;

        toggleStoreCredit(!creditIsApplied).then((isApplied) => {
            setCreditIsApplied({ creditIsApplied: isApplied });

            return isApplied;
        });
    };

    renderAmount() {
        const { canApply, storeCreditBalance } = this.props;
        const amount = canApply ? `(${ storeCreditBalance })` : storeCreditBalance;

        return (
            <span block="StoreCredit" elem="Amount">
                { ` ${ amount }` }
            </span>
        );
    }

    renderCheckbox(checkboxId) {
        const { creditIsApplied } = this.props;

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

export default StoreCredit;
