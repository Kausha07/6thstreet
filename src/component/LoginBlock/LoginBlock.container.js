import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import LoginBlock from './LoginBlock.component';

const mapStateToProps = (state) => ({
    isSignedIn: state.MyAccountReducer.isSignedIn,
    language: state.AppState.language
});

export class LoginBlockContainer extends PureComponent {
    static propTypes = {
        isSignedIn: PropTypes.bool,
        language: PropTypes.string.isRequired
    };

    static defaultProps = {
        isSignedIn: false
    };

    render() {
        // TODO: test if redux connection works properly
        const { isSignedIn, language } = this.props;

        return (
            <LoginBlock
              isSignedIn={ isSignedIn }
              language={ language }
            />
        );
    }
}

export default connect(mapStateToProps)(LoginBlockContainer);
