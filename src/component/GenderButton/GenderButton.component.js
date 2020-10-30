import Link from '@scandipwa/scandipwa/src/component/Link/Link.component';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MixType } from 'Type/Common';

import './GenderButton.style';

class GenderButton extends PureComponent {
    static propTypes = {
        onGenderClick: PropTypes.func.isRequired,
        onGenderEnter: PropTypes.func.isRequired,
        onGenderLeave: PropTypes.func.isRequired,
        isCurrentGender: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        isUnsetStyle: PropTypes.bool.isRequired,
        mix: MixType
    };

    static defaultProps = {
        mix: {}
    };

    render() {
        const {
            onGenderClick,
            onGenderEnter,
            onGenderLeave,
            isCurrentGender,
            mix,
            label,
            isUnsetStyle
        } = this.props;

        return (
            <Link to={ `/${label.toLowerCase()}.html` }>
                <button
                  mix={ mix }
                  block="GenderButton"
                  elem="Button"
                  mods={ { isCurrentGender, isUnsetStyle } }
                  onClick={ onGenderClick }
                  onMouseEnter={ onGenderEnter }
                  onMouseLeave={ onGenderLeave }
                >
                    { label }
                </button>
            </Link>
        );
    }
}

export default GenderButton;
