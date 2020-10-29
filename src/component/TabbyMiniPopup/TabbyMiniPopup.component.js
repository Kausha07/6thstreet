import PropTypes from 'prop-types';
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PureComponent } from 'react';

import tabby from './icons/tabby.png';
import { TABBY_ROW_DATA } from './TabbyMiniPopup.config';

import './TabbyMiniPopup.style.scss';

class TabbyMiniPopup extends PureComponent {
    static propTypes = {
        closeTabbyPopup: PropTypes.func.isRequired,
        page: PropTypes.string
    };

    static defaultProps = {
        page: ''
    };

    renderPopup() {
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
                    { this.renderTabbyContent() }
                </div>
            </div>
        );
    }

    renderTabbyContent = () => {
        const { page } = this.props;
        if (page === 'pdp') {
            return this.renderPdpContent();
        }

        return null;
    };

    renderPdpContent() {
        return (
            <>
                <h2>{ __('Split your purchase into equal monthly installments') }</h2>
                <div block="TabbyMiniPopup" elem="Columns">
                    <div block="TabbyMiniPopup" elem="Column">
                        { this.renderTabbyPopupRow('fees') }
                        { this.renderTabbyPopupRow('card') }
                        { this.renderTabbyPopupRow('easy') }
                    </div>
                </div>
                <p block="TabbyMiniPopup" elem="ContentFooter">
                    { __('Sounds good? Just select Tabby at checkout.') }
                </p>
            </>
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
                { this.renderPopup() }
            </>
        );
    }
}

export default TabbyMiniPopup;
