import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import LoginBlock from './LoginBlock.component';

const mapStateToProps = (state) => ({
    config: state.MyAccountReducer.isSignedIn
});

export class LoginBlockContainer extends PureComponent {
    static propTypes = {
        isSignedIn: PropTypes.bool.isRequired
    };

    render() {
        // TODO: test if redux connection works properly
        const { isSignedIn } = this.props;

        return (
            <LoginBlock
              isSignedIn={ isSignedIn }
              name="Username"
            />
        );
    }
}

export default connect(mapStateToProps)(LoginBlockContainer);
