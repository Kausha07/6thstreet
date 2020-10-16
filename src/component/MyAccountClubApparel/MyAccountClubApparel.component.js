import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';

import './MyAccountClubApparel.style';

class MyAccountClubApparel extends PureComponent {
    static propTypes = {
        linkAccount: PropTypes.func.isRequired
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

    render() {
        return (
            <div block="MyAccountClubApparel">
                { this.renderLinkAccount() }
            </div>
        );
    }
}

export default MyAccountClubApparel;
