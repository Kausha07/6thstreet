import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';
import { ClubApparelMember } from 'Util/API/endpoint/ClubApparel/ClubApparel.type';

import './MyAccountClubApparel.style';

class MyAccountClubApparel extends PureComponent {
    static propTypes = {
        linkAccount: PropTypes.func.isRequired,
        verifyOtp: PropTypes.func.isRequired,
        clubApparel: ClubApparelMember
    };

    static defaultProps = {
        clubApparel: {}
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

    renderLinkedMember() {
        const { clubApparel: { caPointsValue, currency, memberDetails: { memberTier } = {} } } = this.props;

        return (
            <div block="MyAccountClubApparel" elem="MemberData">
                <div block="MyAccountClubApparel" elem="Points">
                    Rewards Worth
                    { currency }
                    { caPointsValue }
                </div>
                <div block="MyAccountClubApparel" elem="Tier">
                    { memberTier }
                    Tier
                </div>
            </div>
        );
    }

    renderLinkForm() {
        return (
            <div block="MyAccountClubApparel" elem="LinkForm">
                { this.renderLinkAccount() }
                { this.renderVerifyOtp() }
            </div>
        );
    }

    render() {
        const { clubApparel: { accountLinked } } = this.props;

        return (
            <div block="MyAccountClubApparel">
                { accountLinked ? this.renderLinkedMember() : this.renderLinkForm() }
            </div>
        );
    }
}

export default MyAccountClubApparel;
