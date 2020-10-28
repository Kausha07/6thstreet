import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import MyAccountTabList from 'Component/MyAccountTabList';
import { tabMap } from 'Route/MyAccount/MyAccount.container';
import {
    activeTabType
} from 'Type/Account';

import './CheckoutSuccess.style';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals
});

export class CheckoutSuccess extends PureComponent {
    static propTypes = {
        changeActiveTab: PropTypes.func.isRequired,
        activeTab: activeTabType.isRequired
    };

    renderButtons() {
        return (
            <div block="CheckoutSuccess" elem="ButtonWrapper">
                <Link
                  block="Button"
                  mix={ { block: 'CheckoutSuccess', elem: 'ContinueButton' } }
                  to="/"
                >
                    { __('Continue shopping') }
                </Link>
            </div>
        );
    }

    renderContent() {
        const { activeTab, changeActiveTab } = this.props;
        const { name } = tabMap[activeTab];

        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <MyAccountTabList
                  tabMap={ tabMap }
                  activeTab={ activeTab }
                  changeActiveTab={ changeActiveTab }
                />
                <div block="MyAccount" elem="TabContent">
                    <h1 block="MyAccount" elem="Heading">{ name }</h1>
                </div>
            </ContentWrapper>
        );
    }

    render() {
        return (
            <div block="CheckoutSuccess">
                { this.renderContent() }
            </div>
        );
    }
}

export default CheckoutSuccess;
