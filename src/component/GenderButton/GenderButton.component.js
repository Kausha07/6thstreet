import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MixType } from 'Type/Common';

import './GenderButton.style';

class GenderButton extends PureComponent {
    static propTypes = {
        onGenderClick: PropTypes.func.isRequired,
        onGenderEnter: PropTypes.func.isRequired,
        isCurrentGender: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        mix: MixType
    };

    static defaultProps = {
        mix: {}
    };

    renderLabel() {
        const { label } = this.props;
        return label;
    }

    render() {
        const {
            onGenderClick,
            onGenderEnter,
            isCurrentGender,
            mix
        } = this.props;

        return (
            <button
              mix={ mix }
              block="GenderButton"
              elem="Button"
              mods={ { isCurrentGender } }
              onClick={ onGenderClick }
              onMouseEnter={ onGenderEnter }
            >
                { this.renderLabel() }
            </button>
        );
    }
}

export default GenderButton;
