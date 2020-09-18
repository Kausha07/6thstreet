/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { SelectOptions } from 'Type/Field';

import './StoreSwitcherPopup.style';

export const STORE_POPUP_ID = 'testStoreId';

class StoreSwitcherPopup extends PureComponent {
    static propTypes = {
        onCountrySelect: PropTypes.func.isRequired,
        countrySelectOptions: SelectOptions.isRequired,
        closePopup: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired
    };

    renderListItem(item, country) {
        const { onCountrySelect } = this.props;
        const flag = <span block="StoreSwitcherPopup" elem="Flag" />;
        const svg = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" /></svg>;
        const check = item.value === country ? <span block="StoreSwitcherPopup" elem="Check">{ svg }</span> : '';
        return (
        <li key={ item.id }>
            { flag }
            { item.label }
            { check }
            <button onClick={ () => onCountrySelect(item.value) }>Change</button>
        </li>
        );
    }

    renderCountryList() {
        const {
            countrySelectOptions,
            country
        } = this.props;

        const list = countrySelectOptions.map((element) => this.renderListItem(element, country));
        return <ul block="StoreSwitcherPopup" elem="List">{ list }</ul>;
    }

    renderPopupContent() {
        const {
            closePopup
        } = this.props;

        return (
            <div block="StoreSwitcherPopup">
                <div block="StoreSwitcherPopup" elem="Container">
                <img block="StoreSwitcherPopup" elem="Image" src="https://static.6media.me/static/version1600395563/frontend/6SNEW/6snew/en_US/images/store-selector-background.png" alt="Store" />
                    <div block="StoreSwitcherPopup" elem="Content">
                        <button
                          block="StoreSwitcherPopup"
                          elem="Close"
                          onClick={ closePopup }
                        >
                        <img alt="X" src="https://static.6media.me/static/version1600395563/frontend/6SNEW/6snew/en_US/images/x-close.svg" />
                        </button>
                        <div block="StoreSwitcherPopup" elem="Options">
                            <h1>Welcome</h1>
                            <p>you are shopping in</p>
                            <div block="StoreSwitcherPopup" elem="ButtonsContainer">
                                <button block="button primary">DUMMY</button>
                                <button block="button primary">TEST</button>
                            </div>
                            { this.renderCountryList() }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        // const {
        //     country
        // } = this.props;

        return this.renderPopupContent();
    }
}

export default StoreSwitcherPopup;
