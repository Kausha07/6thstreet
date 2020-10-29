import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Loader from 'Component/Loader';

import './StoreCredit.style';

export class StoreCredit extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        canApply: PropTypes.bool.isRequired,
        hideIfZero: PropTypes.bool.isRequired,
        creditIsApplied: PropTypes.bool,
        storeCreditBalance: PropTypes.string.isRequired,
        toggleStoreCredit: PropTypes.func.isRequired
    };

    static defaultProps = {
        creditIsApplied: false
    };

    hasCredit() {
        const { storeCreditBalance } = this.props;

        if (storeCreditBalance && storeCreditBalance.length) {
            const [, amount] = storeCreditBalance.split(' ');

            return parseFloat(amount) > 0;
        }

        return false;
    }

    handleCheckboxChange = () => {
        const { toggleStoreCredit, creditIsApplied } = this.props;

        toggleStoreCredit(!creditIsApplied);
    };

    renderAmount() {
        const { canApply, storeCreditBalance } = this.props;
        const amount = canApply ? `(${ storeCreditBalance })` : storeCreditBalance;

        return (
            <span block="StoreCredit" elem="Amount">
                { `${ amount }` }
            </span>
        );
    }

    renderCheckbox(checkboxId) {
        const { creditIsApplied } = this.props;

        return (
            <Field
              block="StoreCredit"
              elem="Toggle"
              type="toggle"
              id={ checkboxId }
              name={ checkboxId }
              value={ checkboxId }
              checked={ creditIsApplied }
              onClick={ this.handleCheckboxChange }
            />
        );
    }

    render() {
        const { isLoading, canApply, hideIfZero } = this.props;

        if (hideIfZero && !this.hasCredit()) {
            return null;
        }

        const checkboxId = 'store_credit_applied';
        const label = canApply
            ? __('Use Store Credit')
            : __('Store Credit:');

        return (
            <div block="StoreCredit" mods={ { canApply } }>
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
