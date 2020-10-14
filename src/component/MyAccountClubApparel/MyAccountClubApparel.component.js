import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';

import './MyAccountClubApparel.style';

class MyAccountClubApparel extends PureComponent {
    static propTypes = {
        linkAccount: PropTypes.func.isRequired,
        verifyOtp: PropTypes.func.isRequired
    };

    renderLinkAccount() {
        const { linkAccount } = this.props;

        return (
            <Form
              onSubmitSuccess={ linkAccount }
            >
                <Field
                  type="text"
                  placeholder="00000000"
                  id="phone"
                  name="phone"
                  validation={ ['notEmpty'] }
                />
                <button
                  block="Button"
                  type="submit"
                >
                    { __('Link Account') }
                </button>
            </Form>
        );
    }

    renderVerifyOtp() {
        const { verifyOtp } = this.props;

        return (
            <Form
              onSubmitSuccess={ verifyOtp }
            >
                <Field
                  type="text"
                  placeholder="00000"
                  id="otp"
                  name="otp"
                  validation={ ['notEmpty'] }
                />
                <button
                  block="Button"
                  type="submit"
                >
                    { __('Verify number') }
                </button>
            </Form>
        );
    }

    render() {
        return (
            <div block="MyAccountClubApparel">
                { this.renderLinkAccount() }
                { this.renderVerifyOtp() }
            </div>
        );
    }
}

export default MyAccountClubApparel;
