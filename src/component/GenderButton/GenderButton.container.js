import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setGender } from 'Store/AppState/AppState.action';

import GenderButton from './GenderButton.component';

export const mapStateToProps = (state) => ({
    currentContentGender: state.AppState.gender
});

export const mapDispatchToProps = (dispatch) => ({
    setGender: (gender) => dispatch(setGender(gender))
});

export class GenderButtonContainer extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        setGender: PropTypes.func.isRequired,
        currentContentGender: PropTypes.string.isRequired,
        changeMenuGender: PropTypes.func,
        isDefaultGenderSetted: PropTypes.bool.isRequired,
        isCurrentGender: PropTypes.bool.isRequired,
        getNewActiveMenuGender: PropTypes.func.isRequired,
        getGenderCategory: PropTypes.func.isRequired,
        gender: PropTypes.shape({
            label: PropTypes.string,
            key: PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        onClick: () => {},
        changeMenuGender: () => {}
    };

    containerFunctions = {
        onGenderClick: this.onGenderClick.bind(this),
        onGenderEnter: this.onGenderEnter.bind(this)
    };

    containerProps = () => {
        const {
            gender: { label },
            isCurrentGender
        } = this.props;

        return {
            label,
            isCurrentGender
        };
    };

    onGenderClick() {
        const {
            onClick,
            setGender,
            gender: { key }
        } = this.props;

        setGender(key);
        onClick(key);
    }

    onGenderEnter() {
        const { gender: { key }, changeMenuGender, getNewActiveMenuGender } = this.props;
        getNewActiveMenuGender(key);
        changeMenuGender(key);
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
