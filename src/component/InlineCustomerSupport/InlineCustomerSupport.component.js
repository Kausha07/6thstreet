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
        isExpanded: false
    };

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
                { phone }
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
        const { isExpanded } = this.state;
        const Email = this.renderEmail();
        const Phone = this.renderPhone();

        return (
            <div>
                <button
                  block="InlineCustomerSupport"
                  elem="Button"
                  mods={ { isExpanded } }
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
                            <div block="InlineCustomerSupport" elem="PhoneIcon" />
                            { Phone }
                        </div>
                    ) : (Phone) }
                    { Email ? (
                        <div block="InlineCustomerSupport" elem="DisplayEmail">
                            <div block="InlineCustomerSupport" elem="EmailIcon" />
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
        return (
            <div block="InlineCustomerSupport">
                { this.renderDropdown() }
                <div block="InlineCustomerSupport" elem="DisplayQuickAccess">
                    { this.renderQuickAccess() }
                </div>
            </div>
        );
    }
}

export default InlineCustomerSupport;
