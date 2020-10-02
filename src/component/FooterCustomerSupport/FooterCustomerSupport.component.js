import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './FooterCustomerSupport.style';

class FooterCustomerSupport extends PureComponent {
    static propTypes = {
        isEmailSupported: PropTypes.bool.isRequired,
        isPhoneSupported: PropTypes.bool.isRequired,
        openHoursLabel: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired
    };

    renderEmail = () => {
        const { isEmailSupported, email } = this.props;

        if (!isEmailSupported) {
            return null;
        }

        return (
            <a block="FooterCustomerSupport" elem="Email" href={ `mailto:${ email }` }>
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
            <a block="FooterCustomerSupport" elem="Phone" href={ `tel:${ phone }` }>
                <bdi>{ phone }</bdi>
            </a>
        );
    };

    renderWorkingHours() {
        const { openHoursLabel } = this.props;

        return (
            <div block="FooterCustomerSupport" elem="FirstParagraph">
                <p><bdi>{ __('We are available all days from:') }</bdi></p>
                <p block="FooterCustomerSupport" elem="OpenHours">
                { openHoursLabel }
                </p>
            </div>
        );
    }

    renderSupport() {
        const Phone = this.renderPhone();
        const Email = this.renderEmail();

        return (
            <div>
                <h4>CUSTOMER SUPPORT</h4>
                    { this.renderWorkingHours() }
                    { Phone ? (
                    <div block="FooterCustomerSupport" elem="DisplayPhone">
                        <div block="FooterCustomerSupport" elem="PhoneIcon" />
                        <span />
                        { Phone }
                    </div>
                    ) : (null) }
                    { Email ? (
                    <div block="FooterCustomerSupport" elem="DisplayEmail">
                        <div block="FooterCustomerSupport" elem="EmailIcon" />
                        <span />
                        { Email }
                    </div>
                    ) : (null) }
            </div>
        );
    }

    render() {
        return (
            <div block="FooterCustomerSupport">
                { this.renderSupport() }
            </div>
        );
    }
}

export default FooterCustomerSupport;
