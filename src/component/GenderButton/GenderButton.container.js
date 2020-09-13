import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setGender } from 'Store/AppState/AppState.action';

import GenderButton from './GenderButton.component';

export const mapStateToProps = (state) => ({
    currentGender: state.AppState.gender
});

export const mapDispatchToProps = (dispatch) => ({
    setGender: (gender) => dispatch(setGender(gender))
});

export class GenderButtonContainer extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        setGender: PropTypes.func.isRequired,
        currentGender: PropTypes.string.isRequired,
        gender: PropTypes.shape({
            label: PropTypes.string,
            key: PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        onClick: () => {}
    };

    containerFunctions = {
        onGenderClick: this.onGenderClick.bind(this)
    };

    containerProps = () => {
        const {
            gender: { label }
        } = this.props;

        return {
            isCurrentGender: this.getIsCurrentGender(),
            label
        };
    };

    getIsCurrentGender() {
        const {
            currentGender,
            gender: { key }
        } = this.props;

        return currentGender === key;
    }

    onGenderClick() {
        const {
            onClick,
            setGender,
            gender: { key }
        } = this.props;

        setGender(key);
        onClick(key);
    }

    render() {
        return (
            <GenderButton
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenderButtonContainer);
