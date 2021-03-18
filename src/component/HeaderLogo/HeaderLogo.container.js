import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setGender } from 'Store/AppState/AppState.action';

import HeaderLogo from './HeaderLogo.component';

export const mapDispatchToProps = (dispatch) => ({
    setGender: (gender) => dispatch(setGender(gender))
});

class HeaderLogoContainer extends PureComponent {
    static propTypes = {
        setGender: PropTypes.func.isRequired
    };

    containerFunctions = {
        setGender: this.setGender.bind(this)
    };

    setGender() {
        const { setGender } = this.props;

        setGender('women');
    }

    render() {
        return (
            <HeaderLogo
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(HeaderLogoContainer);
