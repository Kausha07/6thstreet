import { PureComponent } from 'react';

import { CM_TO_INCH, UK_SIZE_CM } from './SizeTable.config';

import './SizeTable.style';

export class SizeTable extends PureComponent {
    constructor() {
        super();
        this.state = { isCm: true };
    }

    handleClick = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    };

    renderTableRow = (row) => {
        const { size, bust, waist } = row;
        const { isCm } = this.state;

        if (isCm) {
            return (
                <tr>
                    <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ size }</td>
                    <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ bust }</td>
                    <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ waist }</td>
                </tr>
            );
        }

        return (
            <tr>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ size }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ (bust * CM_TO_INCH).toFixed(2) }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ (waist * CM_TO_INCH).toFixed(2) }</td>
            </tr>
        );
    }

    renderTableRows() {
        const rows = UK_SIZE_CM.map(this.renderTableRow);
        return rows;
    }

    SwitchToCm = () => {
        this.setState({ isCm: true });
    };

    SwitchToInch = () => {
        this.setState({ isCm: false });
    };

    render() {
        const { isCm } = this.state;

        return (
            <div block="SizeTable">
                <div mix={ { block: 'SizeTable', elem: 'ButtonContainer' } }>
                    <button
                      onClick={ this.SwitchToCm }
                      mix={ { block: 'SizeTable', elem: 'ButtonCm', mods: { isCm } } }
                    >
                        { __('Cm') }
                    </button>
                    <button
                      onClick={ this.SwitchToInch }
                      mix={ { block: 'SizeTable', elem: 'ButtonInch', mods: { isCm } } }
                    >
                        { __('Inches') }
                    </button>
                </div>
                <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                    <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                        <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Size') }</td>
                        <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Bust') }</td>
                        <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Waist') }</td>
                    </tr>
                    { this.renderTableRows() }
                </table>
            </div>
        );
    }
}

export default SizeTable;
