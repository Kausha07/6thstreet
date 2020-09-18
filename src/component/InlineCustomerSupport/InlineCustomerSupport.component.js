import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './InlineCustomerSupport.style';

class InlineCustomerSupport extends PureComponent {
    static propTypes = {
        isEmailSupported: PropTypes.bool.isRequired,
        isPhoneSupported: PropTypes.bool.isRequired,
        isContactEmail: PropTypes.bool.isRequired,
        contactLabel: PropTypes.string.isRequired,
        openHoursLabel: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired
    };

    state = {
        // eslint-disable-next-line react/no-unused-state
        language: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language,
        isArabic: false
    };

    static getDerivedStateFromProps(state) {
        const { language } = state;
        // eslint-disable-next-line max-len
        return language === 'ar' ? {
            isArabic: true,
            language: 'ar'
        } : {
            isArabic: false,
            language: 'en'
        };
    }

    onDropdownClick = () => {
        // Toggle dropdown
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
    };

    renderEmail = () => {
        const { isEmailSupported, email } = this.props;

        if (!isEmailSupported) {
            return null;
        }

        return (
            <a block="InlineCustomerSupport" elem="Email" href={ `mailto:${ email }` }>
                { email }
            </a>
        );
    };

    renderPhone = () => {
        const { isPhoneSupported, phone } = this.props;

        if (!isPhoneSupported) {
            return null;
        }

        return (
            <a block="InlineCustomerSupport" elem="Phone" href={ `tel:${ phone }` }>
                <bdi>{ phone }</bdi>
            </a>
        );
    };

    renderWorkingHours() {
        const { openHoursLabel } = this.props;

        return (
            <>
                <p>{ __('We are available all days from:') }</p>
                <p block="InlineCustomerSupport" elem="OpenHours">{ openHoursLabel }</p>
            </>
        );
    }

    renderDropdown() {
        const { isExpanded, isArabic } = this.state;
        const Email = this.renderEmail();
        const Phone = this.renderPhone();

        return (
            <div>
                <button
                  block="InlineCustomerSupport"
                  elem="Button"
                  mods={ { isExpanded } }
                  mix={ {
                      block: 'InlineCustomerSupport',
                      elem: 'Button',
                      mods: { isArabic }
                  } }
                  onClick={ this.onDropdownClick }
                >
                    { __('customer service') }
                </button>
                <div
                  block="InlineCustomerSupport"
                  elem="Dropdown"
                  mods={ { isExpanded } }
                >
                    { this.renderWorkingHours() }
                    { Phone ? (
                        <div block="InlineCustomerSupport" elem="DisplayPhone">
                            <div block="InlineCustomerSupport" elem="PhoneIcon" mods={ { isArabic } } />
                            { Phone }
                        </div>
                    ) : (Phone) }
                    { Email ? (
                        <div block="InlineCustomerSupport" elem="DisplayEmail">
                            <div block="InlineCustomerSupport" elem="EmailIcon" mods={ { isArabic } } />
                            { Email }
                        </div>
                    ) : (Email) }
                </div>
            </div>
        );
    }

    renderQuickAccess() {
        const {
            isContactEmail,
            contactLabel
        } = this.props;

        const contactRenderer = isContactEmail
            ? this.renderEmail
            : this.renderPhone;

        return (
            <p>
                { contactLabel }
                { contactRenderer() }
            </p>
        );
    }

    render() {
        const { isArabic } = this.state;

        return (
            <div block="InlineCustomerSupport">
                { this.renderDropdown() }
                <div block="InlineCustomerSupport" elem="DisplayQuickAccess" mods={ { isArabic } }>
                    { this.renderQuickAccess() }
                </div>
            </div>
        );
    }
}

export default InlineCustomerSupport;
