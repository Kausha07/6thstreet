import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import GenderButton from 'Component/GenderButton';

import './HeaderGenders.style';

class HeaderGenders extends PureComponent {
    static propTypes = {
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        isMobile: false
    };

    genderList = [
        {
            label: __('Men'),
            key: 'men'
        },
        {
            label: __('Women'),
            key: 'women'
        },
        {
            label: __('Kids'),
            key: 'kids'
        },
        {
            label: __('Ramadan'),
            key: 'ramadan'
        }
    ];

    renderGender = (gender) => {
        const { key } = gender;
        const { isMobile } = this.props;

        return (
            <div block="HeaderGenders" mods={ { isMobile } }>
                <div
                  block="GenderButton"
                  elem="Container"
                  key={ key }
                >
                    <GenderButton
                      gender={ gender }
                      mix={ {
                          block: 'HeaderGenders',
                          elem: 'Button'
                      } }
                    />
                </div>
            </div>
        );
    };

    renderGenders() {
        return this.genderList.map(this.renderGender);
    }

    render() {
        return (
            <div
              block="HeaderGenders"
            >
                { this.renderGenders() }
            </div>
        );
    }
}

export default HeaderGenders;
