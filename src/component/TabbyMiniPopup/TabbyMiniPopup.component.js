import PropTypes from 'prop-types';
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PureComponent } from 'react';

import tabby from './icons/tabby.png';
import { TABBY_ROW_DATA } from './TabbyMiniPopup.config';

import './TabbyMiniPopup.style.scss';

class TabbyMiniPopup extends PureComponent {
    static propTypes = {
        closeTabbyPopup: PropTypes.func.isRequired
    };

    renderPdpTabbyPopup() {
        const { closeTabbyPopup } = this.props;

        return (
            <div block="TabbyMiniPopup" elem="Wrapper">
                <div block="TabbyMiniPopup" elem="Content">
                    <button
                      block="TabbyMiniPopup"
                      elem="CloseBtn"
                      onClick={ closeTabbyPopup }
                    >
                        { ' ' }
                    </button>
                    <img src={ tabby } alt="tabby" />
                    <h2>{ __('Split your purchase into equal monthly installments') }</h2>
                    { this.renderTabbyPopupRow('fees') }
                    { this.renderTabbyPopupRow('card') }
                    { this.renderTabbyPopupRow('easy') }
                    <p block="TabbyMiniPopup" elem="ContentFooter">
                        { __('Sounds good? Just select Tabby at checkout.') }
                    </p>
                </div>
            </div>
        );
    }

    renderTabbyPopupRow(data) {
        return (
            <div block="TabbyMiniPopup" elem="Row">
                <img src={ TABBY_ROW_DATA[data].img } alt="icon" />
                <div block="TabbyMiniPopup" elem="RowText">
                    <h3>{ TABBY_ROW_DATA[data].title }</h3>
                    <p>{ TABBY_ROW_DATA[data].text }</p>
                </div>
            </div>
        );
    }

    render() {
        const { closeTabbyPopup } = this.props;

        return (
            <>
                <div block="TabbyMiniPopup" elem="Overlay" onClick={ closeTabbyPopup } />
                { this.renderPdpTabbyPopup() }
            </>
        );
    }
}

export default TabbyMiniPopup;
