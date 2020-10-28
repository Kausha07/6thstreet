import Link from '@scandipwa/scandipwa/src/component/Link/Link.component';
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

    render() {
        const {
            onGenderClick,
            onGenderEnter,
            isCurrentGender,
            mix,
            label
        } = this.props;

        return (
            <Link to={ `/${label}.html` }>
                <button
                  mix={ mix }
                  block="GenderButton"
                  elem="Button"
                  mods={ { isCurrentGender } }
                  onClick={ onGenderClick }
                  onMouseEnter={ onGenderEnter }
                >
                    { label }
                </button>
            </Link>
        );
    }
}

export default GenderButton;
