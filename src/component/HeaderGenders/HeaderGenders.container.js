import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import HeaderGenders from './HeaderGenders.component';

import './HeaderGenders.style';

export const mapStateToProps = (state) => ({
    currentContentGender: state.AppState.gender
});

class HeaderGendersContainer extends PureComponent {
    static propTypes = {
        currentContentGender: PropTypes.string.isRequired,
        changeMenuGender: PropTypes.func,
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        changeMenuGender: () => {},
        isMobile: false
    };

    render() {
        return (
            <HeaderGenders
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, null)(HeaderGendersContainer);
