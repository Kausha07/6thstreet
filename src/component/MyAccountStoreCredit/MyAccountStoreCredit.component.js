import dateformat from 'dateformat';
import React, { PureComponent } from 'react';

import { StoreCreditData } from 'Util/API/endpoint/StoreCredit/StoreCredit.type';

import './MyAccountStoreCredit.style';

class MyAccountStoreCredit extends PureComponent {
    static propTypes = {
        storeCredit: StoreCreditData.isRequired
    };

    blockClass = 'MyAccountStoreCredit';

    renderBalance() {
        const {
            storeCredit: {
                current_balance: balance
            } = {}
        } = this.props;

        return (
            <div block={ this.blockClass } elem="Balance">
                <span block={ this.blockClass } elem="BalanceText">
                    { __('Current Store Credit:') }
                </span>
                <span block={ this.blockClass } elem="BalanceAmount">
                    { balance || '' }
                </span>
            </div>
        );
    }

    renderTableHead(headers = []) {
        return (
            <thead>
                { headers.map((header) => (
                    <th>{ header }</th>
                )) }
            </thead>
        );
    }

    renderTableRows(rows = []) {
        return (
            <tbody>
                { rows.map((cells = []) => (
                    <tr>
                        { cells.map((value) => (
                            <td>{ value }</td>
                        )) }
                    </tr>
                )) }
            </tbody>
        );
    }

    renderHistory() {
        const {
            storeCredit: {
                history = []
            } = {}
        } = this.props;

        if (!history || !history.length) {
            return null;
        }

        const headers = [
            __('Action'),
            __('Balance Change'),
            __('Balance'),
            __('Date')
        ];
        const rows = history.map((row) => {
            const {
                action, balance_change, balance_amount, updated_at
            } = row;

            return [
                action,
                balance_change,
                balance_amount,
                dateformat(updated_at, 'd/M/yyyy, H:M TT')
            ];
        });

        return (
            <div block={ this.blockClass } elem="History">
                <div block={ this.blockClass } elem="BlockTitle">
                    { __('Transactions History') }
                </div>
                <table block={ this.blockClass } elem="HistoryTable">
                    { this.renderTableHead(headers) }
                    { this.renderTableRows(rows) }
                </table>
            </div>
        );
    }

    render() {
        return (
            <div block={ this.blockClass }>
                { this.renderBalance() }
                { this.renderHistory() }
            </div>
        );
    }
}

export default MyAccountStoreCredit;
